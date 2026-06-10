import { createFileRoute } from "@tanstack/react-router";
import { Sparkles } from "lucide-react";
import { ComingSoon } from "@/components/layout/ComingSoon";

export const Route = createFileRoute("/ai-tool")({
  head: () => ({
    meta: [
      { title: "AI Tool — Record Analyzer & Usage Guide — MediFind" },
      { name: "description", content: "Analyze medical records into an equipment needs report, and get AI usage guides for any device." },
      { property: "og:title", content: "AI Tool — Record Analyzer & Usage Guide — MediFind" },
      { property: "og:description", content: "Analyze medical records and get AI usage guides for any device." },
    ],
  }),
  component: AiToolPage,
});

function AiToolPage() {
  return (
    <ComingSoon
      icon={Sparkles}
      phase="Coming in Phase 2"
      title="AI Tool"
      description="Two powerful standalone AI tools in one place."
      bullets={[
        "Medical Record Analyzer — upload records and get a structured equipment needs report with product links",
        "Equipment Usage Guide — pick a device and get step-by-step usage instructions and safety tips",
      ]}
    />
  );
}
