import { createFileRoute } from "@tanstack/react-router";
import { Store } from "lucide-react";
import { ComingSoon } from "@/components/layout/ComingSoon";

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
  return (
    <ComingSoon
      icon={Store}
      phase="Coming in Phase 4"
      title="Seller Dashboard"
      description="List your products and reach hospitals, clinics and consumers."
      bullets={[
        "Create seller accounts — individual, certified supplier, hospital supplier or official brand store",
        "Add and edit product listings with photos, pricing and deals",
        "Track orders received and manage fulfillment",
      ]}
    />
  );
}
