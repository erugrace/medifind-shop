import { createFileRoute } from "@tanstack/react-router";
import { FileSearch, BookOpenText } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RecordAnalyzer } from "@/components/ai-tool/RecordAnalyzer";
import { UsageGuideTool } from "@/components/ai-tool/UsageGuideTool";

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
    <div className="mx-auto max-w-3xl px-4 py-8">
      <div className="mb-6 space-y-1.5">
        <h1 className="font-heading text-2xl font-bold">AI Tool</h1>
        <p className="text-sm text-muted-foreground">
          Two standalone AI tools: turn medical records into an equipment needs report, or get a usage guide for any device.
        </p>
      </div>

      <Tabs defaultValue="analyzer">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="analyzer" className="gap-2">
            <FileSearch className="h-4 w-4" />
            Record Analyzer
          </TabsTrigger>
          <TabsTrigger value="guide" className="gap-2">
            <BookOpenText className="h-4 w-4" />
            Usage Guide
          </TabsTrigger>
        </TabsList>
        <TabsContent value="analyzer" className="mt-6">
          <RecordAnalyzer />
        </TabsContent>
        <TabsContent value="guide" className="mt-6">
          <UsageGuideTool />
        </TabsContent>
      </Tabs>

      <p className="mt-8 text-center text-[11px] text-muted-foreground">
        AI output is informational only and not a substitute for professional medical advice.
      </p>
    </div>
  );
}
