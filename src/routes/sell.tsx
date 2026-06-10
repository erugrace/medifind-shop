import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Store } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { SellerDashboard } from "@/components/sell/SellerDashboard";
import { useAuth } from "@/hooks/use-auth";

export const Route = createFileRoute("/sell")({
  head: () => ({
    meta: [
      { title: "Sell on MediFind — Seller Dashboard" },
      { name: "description", content: "List your medical equipment, set deals and reach hospitals, clinics and consumers." },
      { property: "og:title", content: "Sell on MediFind — Seller Dashboard" },
      { property: "og:description", content: "List medical equipment and reach hospitals, clinics and consumers." },
    ],
  }),
  component: SellPage,
});

function SellPage() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center gap-2 text-sm text-muted-foreground">
        <Spinner className="size-4" /> Loading…
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center p-6">
        <div className="max-w-md text-center">
          <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
            <Store className="size-7" />
          </div>
          <h1 className="text-2xl font-bold">Sell on MediFind</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            List your products and reach hospitals, clinics and consumers. Sign in to set up your
            seller storefront — it takes less than a minute.
          </p>
          <Button
            className="mt-5"
            onClick={() => navigate({ to: "/auth", search: { redirect: "/sell" } })}
          >
            Sign in to start selling
          </Button>
        </div>
      </div>
    );
  }

  return <SellerDashboard />;
}
