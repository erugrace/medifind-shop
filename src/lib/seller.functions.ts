import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const SELLER_TYPES = ["individual", "certified", "hospital", "brand"] as const;
const CONDITIONS = ["new", "refurbished", "used"] as const;

const RegisterInput = z.object({
  name: z.string().min(2).max(80),
  type: z.enum(SELLER_TYPES),
});

const ProductInput = z.object({
  id: z.string().min(1).max(64).optional(),
  name: z.string().min(2).max(200),
  brand: z.string().min(1).max(80),
  categoryId: z.string().min(1).max(40),
  subcategory: z.string().max(80).default(""),
  price: z.number().min(0.5).max(100000),
  originalPrice: z.number().min(0.5).max(100000).nullable().optional(),
  condition: z.enum(CONDITIONS),
  description: z.string().max(2000).default(""),
  inStock: z.boolean(),
  freeShipping: z.boolean(),
  shipsIn24h: z.boolean(),
  active: z.boolean().default(true),
});

export const getSellerDashboard = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data: seller } = await context.supabase
      .from("sellers")
      .select("id,name,type,verified,rating")
      .eq("user_id", context.userId)
      .maybeSingle();
    if (!seller) return { seller: null, products: [], sales: [] };

    const { data: products } = await context.supabase
      .from("products")
      .select(
        "id,name,brand,category_id,subcategory,price,original_price,condition,in_stock,free_shipping,ships_in_24h,active,rating,review_count,description",
      )
      .eq("seller_id", seller.id)
      .order("created_at", { ascending: false });

    const productIds = (products ?? []).map((p) => p.id);
    let sales: Array<{
      product_name: string;
      quantity: number;
      unit_price: number;
      created_at: string;
      status: string;
    }> = [];
    if (productIds.length > 0) {
      const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
      const { data: items } = await supabaseAdmin
        .from("order_items")
        .select("product_name,quantity,unit_price,created_at,orders(status,payment_status)")
        .in("product_id", productIds)
        .order("created_at", { ascending: false })
        .limit(25);
      sales = (items ?? [])
        .filter((i) => (i.orders as { payment_status?: string } | null)?.payment_status === "paid")
        .map((i) => ({
          product_name: i.product_name,
          quantity: i.quantity,
          unit_price: Number(i.unit_price),
          created_at: i.created_at,
          status: (i.orders as { status?: string } | null)?.status ?? "placed",
        }));
    }

    return { seller, products: products ?? [], sales };
  });

export const registerSeller = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => RegisterInput.parse(input))
  .handler(async ({ data, context }) => {
    const { data: existing } = await context.supabase
      .from("sellers")
      .select("id")
      .eq("user_id", context.userId)
      .maybeSingle();
    if (existing) return { sellerId: existing.id };

    const { data: seller, error } = await context.supabase
      .from("sellers")
      .insert({ user_id: context.userId, name: data.name, type: data.type })
      .select("id")
      .single();
    if (error || !seller) {
      console.error("Seller registration failed", error);
      throw new Error("Could not create the seller profile.");
    }

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    await supabaseAdmin
      .from("user_roles")
      .upsert({ user_id: context.userId, role: "seller" }, { onConflict: "user_id,role", ignoreDuplicates: true });

    return { sellerId: seller.id };
  });

export const saveProduct = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => ProductInput.parse(input))
  .handler(async ({ data, context }) => {
    const { data: seller } = await context.supabase
      .from("sellers")
      .select("id")
      .eq("user_id", context.userId)
      .maybeSingle();
    if (!seller) throw new Error("Create a seller profile first.");

    const row = {
      name: data.name,
      brand: data.brand,
      category_id: data.categoryId,
      subcategory: data.subcategory,
      price: data.price,
      original_price: data.originalPrice ?? null,
      condition: data.condition,
      description: data.description,
      in_stock: data.inStock,
      free_shipping: data.freeShipping,
      ships_in_24h: data.shipsIn24h,
      active: data.active,
    };

    if (data.id) {
      const { error } = await context.supabase
        .from("products")
        .update(row)
        .eq("id", data.id)
        .eq("seller_id", seller.id);
      if (error) {
        console.error("Product update failed", error);
        throw new Error("Could not update the product.");
      }
      return { productId: data.id };
    }

    const { data: created, error } = await context.supabase
      .from("products")
      .insert({ ...row, seller_id: seller.id })
      .select("id")
      .single();
    if (error || !created) {
      console.error("Product insert failed", error);
      throw new Error("Could not create the product.");
    }
    return { productId: created.id };
  });

export const deleteProduct = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => z.object({ id: z.string().min(1).max(64) }).parse(input))
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase.from("products").delete().eq("id", data.id);
    if (error) {
      console.error("Product delete failed", error);
      throw new Error("Could not delete the product.");
    }
    return { ok: true };
  });
