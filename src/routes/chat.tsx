import { createFileRoute } from "@tanstack/react-router";
import { Bot } from "lucide-react";
import { ComingSoon } from "@/components/layout/ComingSoon";

export const Route = createFileRoute("/chat")({
  head: () => ({
    meta: [
      { title: "AI Shopping Assistant — MediFind" },
      { name: "description", content: "Chat with an AI assistant that interprets medical records and recommends the right equipment." },
      { property: "og:title", content: "AI Shopping Assistant — MediFind" },
      { property: "og:description", content: "AI assistant that interprets medical records and recommends the right equipment." },
    ],
  }),
  component: ChatPage,
});

function ChatPage() {
  return (
    <ComingSoon
      icon={Bot}
      phase="Coming in Phase 2"
      title="AI Shopping Assistant"
      description="A smart assistant that helps you find exactly the right equipment."
      bullets={[
        "Upload medical records and get product recommendations matched to your needs",
        "Ask how to use any piece of equipment and get clear instructions",
        "Recommendations respect your active marketplace filters",
      ]}
    />
  );
}
