import { Link, createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { CheckCircle2, Package } from "lucide-react";
import { useServerFn } from "@tanstack/react-start";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { finalizeCheckout } from "@/lib/payments.functions";
import { useCart } from "@/hooks/use-cart";

export const Route = createFileRoute("/_authenticated/checkout-return")({
  validateSearch: (search: Record<string, unknown>) => ({
    session_id: typeof search.session_id === "string" ? search.session_id : "",
  }),
  head: () => ({
    meta: [{ title: "Order confirmation — MediFind" }],
  }),
  component: CheckoutReturnPage,
});

function CheckoutReturnPage() {
  const { session_id } = Route.useSearch();
  const finalize = useServerFn(finalizeCheckout);
  const { clear } = useCart();
  const [state, setState] = useState<"loading" | "paid" | "pending" | "error">("loading");
  const ranRef = useRef(false);

  useEffect(() => {
    if (ranRef.current) return;
    ranRef.current = true;
    if (!session_id) {
      setState("error");
      return;
    }
    finalize({ data: { sessionId: session_id } })
      .then((result) => {
        if (result.paid) {
          clear();
          setState("paid");
        } else {
          setState("pending");
        }
      })
      .catch(() => setState("error"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex min-h-[70vh] items-center justify-center p-6">
      <div className="max-w-md text-center">
        {state === "loading" && (
          <div className="flex flex-col items-center gap-3 text-muted-foreground">
            <Spinner className="size-6" />
            <p className="text-sm">Confirming your payment…</p>
          </div>
        )}
        {state === "paid" && (
          <>
            <CheckCircle2 className="mx-auto size-14 text-primary" />
            <h1 className="mt-4 text-2xl font-bold">Order confirmed!</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Thanks for your purchase. You can follow delivery progress in your orders.
            </p>
            <div className="mt-6 flex justify-center gap-2">
              <Button asChild>
                <Link to="/orders">
                  <Package className="size-4" /> Track my order
                </Link>
              </Button>
              <Button asChild variant="outline">
                <Link to="/">Keep shopping</Link>
              </Button>
            </div>
          </>
        )}
        {state === "pending" && (
          <>
            <h1 className="text-2xl font-bold">Payment not completed</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Your payment hasn't gone through yet. You can try again from your cart.
            </p>
            <Button asChild className="mt-5">
              <Link to="/cart">Return to cart</Link>
            </Button>
          </>
        )}
        {state === "error" && (
          <>
            <h1 className="text-2xl font-bold">Something went wrong</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              We couldn't confirm this payment. If you were charged, your order will appear in your
              orders shortly.
            </p>
            <Button asChild className="mt-5">
              <Link to="/orders">View my orders</Link>
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
