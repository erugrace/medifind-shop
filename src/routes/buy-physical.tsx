import { createFileRoute } from "@tanstack/react-router";
import { MapPin } from "lucide-react";
import { ComingSoon } from "@/components/layout/ComingSoon";

export const Route = createFileRoute("/buy-physical")({
  head: () => ({
    meta: [
      { title: "Buy Physical — Find Nearby Stores — MediFind" },
      { name: "description", content: "Find nearby pharmacies and medical supply stores that stock the equipment you need." },
      { property: "og:title", content: "Buy Physical — Find Nearby Stores — MediFind" },
      { property: "og:description", content: "Find nearby pharmacies and medical supply stores with an embedded map." },
    ],
  }),
  component: BuyPhysicalPage,
});

function BuyPhysicalPage() {
  return (
    <ComingSoon
      icon={MapPin}
      phase="Coming in Phase 3"
      title="Buy Physical"
      description="Find the equipment you need at stores near you."
      bullets={[
        "Enter your address and what you're looking for",
        "See nearby pharmacies and medical supply stores on an embedded map",
        "Compare distances and pick the most convenient option",
      ]}
    />
  );
}
