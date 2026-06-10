import { createFileRoute } from "@tanstack/react-router";
import { createHmac, timingSafeEqual } from "crypto";

function verifyStripeSignature(header: string, body: string, secret: string): boolean {
  const parts = new Map<string, string[]>();
  for (const piece of header.split(",")) {
    const [k, v] = piece.split("=", 2);
    if (!k || !v) continue;
    const list = parts.get(k.trim()) ?? [];
    list.push(v.trim());
    parts.set(k.trim(), list);
  }
  const timestamp = parts.get("t")?.[0];
  const signatures = parts.get("v1") ?? [];
  if (!timestamp || signatures.length === 0) return false;

  // Reject events older than 5 minutes
  const age = Math.abs(Date.now() / 1000 - Number(timestamp));
  if (!Number.isFinite(age) || age > 300) return false;

  const expected = createHmac("sha256", secret).update(`${timestamp}.${body}`).digest("hex");
  const expectedBuf = Buffer.from(expected);
  return signatures.some((sig) => {
    const sigBuf = Buffer.from(sig);
    return sigBuf.length === expectedBuf.length && timingSafeEqual(sigBuf, expectedBuf);
  });
}

export const Route = createFileRoute("/api/public/payments/webhook")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const secret = process.env.PAYMENTS_WEBHOOK_SECRET;
        if (!secret) return new Response("Webhook not configured", { status: 500 });

        const signature = request.headers.get("stripe-signature") ?? "";
        const body = await request.text();
        if (!signature || !verifyStripeSignature(signature, body, secret)) {
          return new Response("Invalid signature", { status: 401 });
        }

        let event: { type?: string; data?: { object?: { id?: string } } };
        try {
          event = JSON.parse(body);
        } catch {
          return new Response("Invalid payload", { status: 400 });
        }

        if (event.type === "checkout.session.completed" && event.data?.object?.id) {
          const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
          const { error } = await supabaseAdmin
            .from("orders")
            .update({ status: "confirmed", payment_status: "paid" })
            .eq("payment_session_id", event.data.object.id)
            .eq("payment_status", "pending");
          if (error) console.error("Webhook order update failed", error);
        }

        return new Response(JSON.stringify({ received: true }), {
          headers: { "Content-Type": "application/json" },
        });
      },
    },
  },
});
