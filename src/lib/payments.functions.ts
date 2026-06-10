import { createServerFn, createMiddleware } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { stripeRequest, type StripeCheckoutSession } from "@/lib/stripe.server";

const FREE_SHIPPING_THRESHOLD = 50;
const SHIPPING_FEE = 6.99;

const requireOrigin = createMiddleware({ type: "function" }).server(async ({ next }) => {
  const request = getRequest();
  const url = new URL(request.url);
  const origin = `${url.protocol}//${url.host}`;
  return next({ context: { origin } });
});

const CheckoutInput = z.object({
  items: z
    .array(
      z.object({
        productId: z.string().min(1).max(64),
        quantity: z.number().int().min(1).max(99),
      }),
    )
    .min(1)
    .max(50),
});

export const createCheckoutSession = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => CheckoutInput.parse(input))
  .handler(async ({ data, context }) => {
    const ids = data.items.map((i) => i.productId);
    const { data: products, error: prodError } = await context.supabase
      .from("products")
      .select("id,name,brand,category_id,price,in_stock")
      .in("id", ids)
      .eq("active", true);
    if (prodError || !products || products.length === 0) {
      throw new Error("Could not load products for checkout.");
    }

    const lines = data.items
      .map((item) => {
        const product = products.find((p) => p.id === item.productId);
        if (!product || !product.in_stock) return null;
        return { product, quantity: item.quantity };
      })
      .filter((l): l is NonNullable<typeof l> => l !== null);
    if (lines.length === 0) throw new Error("None of the cart items are available.");

    const subtotal = lines.reduce((sum, l) => sum + Number(l.product.price) * l.quantity, 0);
    const shipping = subtotal > FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE;
    const total = subtotal + shipping;

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: order, error: orderError } = await supabaseAdmin
      .from("orders")
      .insert({
        user_id: context.userId,
        status: "placed",
        payment_status: "pending",
        subtotal: Number(subtotal.toFixed(2)),
        shipping,
        total: Number(total.toFixed(2)),
        email: (context.claims?.email as string | undefined) ?? null,
      })
      .select("id")
      .single();
    if (orderError || !order) {
      console.error("Order insert failed", orderError);
      throw new Error("Could not create the order.");
    }

    const { error: itemsError } = await supabaseAdmin.from("order_items").insert(
      lines.map((l) => ({
        order_id: order.id,
        product_id: l.product.id,
        product_name: l.product.name,
        brand: l.product.brand,
        category_id: l.product.category_id,
        unit_price: Number(l.product.price),
        quantity: l.quantity,
      })),
    );
    if (itemsError) {
      console.error("Order items insert failed", itemsError);
      throw new Error("Could not create the order.");
    }

    const params: Record<string, string> = {
      mode: "payment",
      ui_mode: "embedded_page",
      return_url: `${data.origin}/checkout-return?session_id={CHECKOUT_SESSION_ID}`,
      "metadata[order_id]": order.id,
    };
    lines.forEach((l, i) => {
      params[`line_items[${i}][quantity]`] = String(l.quantity);
      params[`line_items[${i}][price_data][currency]`] = "usd";
      params[`line_items[${i}][price_data][unit_amount]`] = String(
        Math.round(Number(l.product.price) * 100),
      );
      params[`line_items[${i}][price_data][product_data][name]`] = l.product.name.slice(0, 250);
    });
    if (shipping > 0) {
      const i = lines.length;
      params[`line_items[${i}][quantity]`] = "1";
      params[`line_items[${i}][price_data][currency]`] = "usd";
      params[`line_items[${i}][price_data][unit_amount]`] = String(Math.round(shipping * 100));
      params[`line_items[${i}][price_data][product_data][name]`] = "Shipping";
    }

    let session: StripeCheckoutSession;
    try {
      session = await stripeRequest<StripeCheckoutSession>("/v1/checkout/sessions", {
        params: { ...params, "automatic_tax[enabled]": "true" },
      });
    } catch (e) {
      // Fall back without automatic tax if the account isn't configured for it yet.
      console.error("Checkout with automatic tax failed, retrying without:", e);
      session = await stripeRequest<StripeCheckoutSession>("/v1/checkout/sessions", { params });
    }

    await supabaseAdmin
      .from("orders")
      .update({ payment_session_id: session.id })
      .eq("id", order.id);

    if (!session.client_secret) throw new Error("Payment session could not be initialized.");
    return { clientSecret: session.client_secret, orderId: order.id };
  });

export const finalizeCheckout = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) =>
    z.object({ sessionId: z.string().min(5).max(200) }).parse(input),
  )
  .handler(async ({ data, context }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: order } = await supabaseAdmin
      .from("orders")
      .select("id,status,payment_status,user_id")
      .eq("payment_session_id", data.sessionId)
      .eq("user_id", context.userId)
      .maybeSingle();
    if (!order) throw new Error("Order not found.");

    const session = await stripeRequest<StripeCheckoutSession>(
      `/v1/checkout/sessions/${encodeURIComponent(data.sessionId)}`,
      { method: "GET" },
    );

    if (session.payment_status === "paid" && order.payment_status !== "paid") {
      await supabaseAdmin
        .from("orders")
        .update({ status: "confirmed", payment_status: "paid" })
        .eq("id", order.id);
      return { paid: true, orderId: order.id };
    }
    return { paid: session.payment_status === "paid", orderId: order.id };
  });

export const getMyOrders = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data: orders, error } = await context.supabase
      .from("orders")
      .select(
        "id,status,payment_status,subtotal,shipping,total,created_at,order_items(id,product_id,product_name,brand,category_id,unit_price,quantity)",
      )
      .order("created_at", { ascending: false });
    if (error) {
      console.error("Orders load failed", error);
      return { orders: [] };
    }
    return { orders: orders ?? [] };
  });
