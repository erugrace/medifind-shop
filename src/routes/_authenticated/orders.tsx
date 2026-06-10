import { Link, createFileRoute } from "@tanstack/react-router";
import { Check, Package } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { getMyOrders } from "@/lib/payments.functions";

export const Route = createFileRoute("/_authenticated/orders")({
  head: () => ({
    meta: [
      { title: "My Orders — MediFind" },
      { name: "description", content: "Track your medical equipment orders and delivery progress." },
    ],
  }),
  component: OrdersPage,
});

const STEPS = ["placed", "confirmed", "shipped", "delivered"] as const;
const STEP_LABELS: Record<(typeof STEPS)[number], string> = {
  placed: "Placed",
  confirmed: "Confirmed",
  shipped: "Shipped",
  delivered: "Delivered",
};

function ProgressTracker({ status }: { status: string }) {
  const currentIndex = Math.max(0, STEPS.indexOf(status as (typeof STEPS)[number]));
  return (
    <div className="flex items-center gap-0">
      {STEPS.map((step, i) => {
        const done = i <= currentIndex;
        return (
          <div key={step} className="flex flex-1 items-center last:flex-none">
            <div className="flex flex-col items-center">
              <span
                className={`flex size-6 items-center justify-center rounded-full text-[10px] font-bold ${
                  done ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                }`}
              >
                {done ? <Check className="size-3.5" /> : i + 1}
              </span>
              <span className={`mt-1 text-[10px] font-medium ${done ? "text-foreground" : "text-muted-foreground"}`}>
                {STEP_LABELS[step]}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div className={`mx-1 mb-4 h-0.5 flex-1 rounded ${i < currentIndex ? "bg-primary" : "bg-muted"}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}

function OrdersPage() {
  const fetchOrders = useServerFn(getMyOrders);
  const { data, isLoading } = useQuery({
    queryKey: ["my-orders"],
    queryFn: () => fetchOrders(),
  });

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center gap-2 text-sm text-muted-foreground">
        <Spinner className="size-4" /> Loading your orders…
      </div>
    );
  }

  const orders = data?.orders ?? [];

  if (orders.length === 0) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center p-6">
        <div className="text-center">
          <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-2xl bg-accent text-accent-foreground">
            <Package className="size-7" />
          </div>
          <h1 className="text-2xl font-bold">No orders yet</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            When you place an order, you'll be able to track it here.
          </p>
          <Button asChild className="mt-5">
            <Link to="/">Browse products</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 md:px-8">
      <h1 className="text-2xl font-bold tracking-tight">My Orders</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        {orders.length} order{orders.length === 1 ? "" : "s"}
      </p>

      <div className="mt-6 space-y-5">
        {orders.map((order) => (
          <div key={order.id} className="rounded-xl border bg-card p-5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <p className="text-sm font-semibold">Order #{order.id.slice(0, 8).toUpperCase()}</p>
                <p className="text-xs text-muted-foreground">
                  {new Date(order.created_at).toLocaleDateString(undefined, {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant={order.payment_status === "paid" ? "default" : "secondary"}>
                  {order.payment_status === "paid" ? "Paid" : "Payment pending"}
                </Badge>
                <span className="text-sm font-bold">${Number(order.total).toFixed(2)}</span>
              </div>
            </div>

            <div className="mt-4 max-w-md">
              <ProgressTracker status={order.status} />
            </div>

            <div className="mt-4 space-y-1.5 border-t pt-3">
              {order.order_items.map((item) => (
                <div key={item.id} className="flex items-center justify-between gap-3 text-sm">
                  <span className="min-w-0 truncate">
                    {item.product_name}
                    <span className="text-muted-foreground"> × {item.quantity}</span>
                  </span>
                  <span className="shrink-0 text-muted-foreground">
                    ${(Number(item.unit_price) * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
