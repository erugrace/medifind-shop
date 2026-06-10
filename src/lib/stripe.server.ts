// Server-only Stripe helper. Routes all Stripe API calls through the
// Lovable connector gateway — never call api.stripe.com directly.

const GATEWAY_URL = "https://connector-gateway.lovable.dev/stripe";

function requireKeys() {
  const lovableKey = process.env.LOVABLE_API_KEY;
  const stripeKey = process.env.STRIPE_API_KEY ?? process.env.STRIPE_SANDBOX_API_KEY;
  if (!lovableKey || !stripeKey) {
    throw new Error("Payments are not configured on the server.");
  }
  return { lovableKey, stripeKey };
}

export async function stripeRequest<T>(
  path: string,
  options?: { method?: "GET" | "POST"; params?: Record<string, string> },
): Promise<T> {
  const { lovableKey, stripeKey } = requireKeys();
  const method = options?.method ?? "POST";

  const headers: Record<string, string> = {
    Authorization: `Bearer ${lovableKey}`,
    "X-Connection-Api-Key": stripeKey,
  };
  let body: string | undefined;
  if (method === "POST") {
    headers["Content-Type"] = "application/x-www-form-urlencoded";
    body = options?.params ? new URLSearchParams(options.params).toString() : "";
  }

  const res = await fetch(`${GATEWAY_URL}${path}`, { method, headers, body });
  const text = await res.text();
  let json: unknown;
  try {
    json = text ? JSON.parse(text) : {};
  } catch {
    throw new Error(`Payment service returned an invalid response (${res.status}).`);
  }
  if (!res.ok) {
    const message =
      (json as { error?: { message?: string } })?.error?.message ??
      `Payment request failed (${res.status})`;
    throw new Error(message);
  }
  return json as T;
}

export interface StripeCheckoutSession {
  id: string;
  client_secret: string | null;
  status: string;
  payment_status: string;
  amount_total: number | null;
  currency: string | null;
}
