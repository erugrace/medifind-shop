import { Link, createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { ArrowLeft, ShieldCheck } from "lucide-react";
import { loadStripe } from "@stripe/stripe-js";
import { useServerFn } from "@tanstack/react-start";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { createCheckoutSession } from "@/lib/payments.functions";
import { useCart } from "@/hooks/use-cart";

export const Route = createFileRoute("/_authenticated/checkout")({
  head: () => ({
    meta: [
      { title: "Checkout — MediFind" },
      { name: "description", content: "Secure checkout for your medical equipment order." },
    ],
  }),
  component: CheckoutPage,
});

function CheckoutPage() {
  const { items } = useCart();
  const navigate = useNavigate();
  const createSession = useServerFn(createCheckoutSession);
  const [error, setError] = useState<string | null>(null);
  const [ready, setReady] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const startedRef = useRef(false);

  useEffect(() => {
    if (startedRef.current) return;
    if (items.length === 0) {
      navigate({ to: "/cart", replace: true });
      return;
    }
    startedRef.current = true;

    let destroyed = false;
    let checkoutInstance: { destroy: () => void; mount: (el: HTMLElement) => void } | null = null;

    (async () => {
      try {
        const { clientSecret } = await createSession({
          data: {
            items: items.map((i) => ({ productId: i.productId, quantity: i.quantity })),
          },
        });
        const publishableKey = import.meta.env.VITE_PAYMENTS_CLIENT_TOKEN as string | undefined;
        if (!publishableKey) throw new Error("Payments are not configured.");
        const stripe = await loadStripe(publishableKey);
        if (!stripe) throw new Error("Could not load the payment form.");
        if (destroyed) return;
        const checkout = await stripe.createEmbeddedCheckoutPage({ clientSecret });
        checkoutInstance = checkout;
        if (destroyed) {
          checkout.destroy();
          return;
        }
        if (containerRef.current) {
          checkout.mount(containerRef.current);
          setReady(true);
        }
      } catch (e) {
        console.error(e);
        setError(e instanceof Error ? e.message : "Could not start checkout.");
      }
    })();

    return () => {
      destroyed = true;
      checkoutInstance?.destroy();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 md:px-8">
      <div className="mb-4 flex items-center justify-between">
        <Button asChild variant="ghost" size="sm">
          <Link to="/cart">
            <ArrowLeft className="size-4" /> Back to cart
          </Link>
        </Button>
        <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
          <ShieldCheck className="size-3.5 text-primary" /> Secure payment
        </span>
      </div>

      {error ? (
        <div className="rounded-xl border bg-card p-10 text-center">
          <p className="font-semibold">Checkout couldn't start</p>
          <p className="mt-1 text-sm text-muted-foreground">{error}</p>
          <Button asChild variant="outline" className="mt-4">
            <Link to="/cart">Return to cart</Link>
          </Button>
        </div>
      ) : (
        <div className="rounded-xl border bg-card p-2 md:p-4">
          {!ready && (
            <div className="flex items-center justify-center gap-2 py-16 text-sm text-muted-foreground">
              <Spinner className="size-4" /> Preparing secure checkout…
            </div>
          )}
          <div ref={containerRef} />
        </div>
      )}
    </div>
  );
}
