import { createServerFn } from "@tanstack/react-start";
import { generateText } from "ai";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { createLovableAiGatewayProvider } from "@/lib/ai-gateway.server";
import { buildCatalogContext } from "@/lib/marketplace/catalog-context";

const MAX_DATA_URL_LENGTH = 14_000_000; // ~10MB file as base64

const AnalyzeInput = z.object({
  fileDataUrl: z.string().min(30).max(MAX_DATA_URL_LENGTH).startsWith("data:"),
  mediaType: z.string().min(3).max(100),
  notes: z.string().max(2000).optional(),
});

const ReportSchema = z.object({
  summary: z.string(),
  conditions: z.array(z.string()),
  recommendations: z.array(
    z.object({
      equipment: z.string(),
      reason: z.string(),
      priority: z.string(),
      searchTerms: z.array(z.string()),
    }),
  ),
});

export type RecordReport = z.infer<typeof ReportSchema>;

export const analyzeMedicalRecord = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => AnalyzeInput.parse(input))
  .handler(async ({ data }) => {
    const key = process.env.LOVABLE_API_KEY;
    if (!key) throw new Error("AI is not configured on the server.");

    const allowed = ["image/png", "image/jpeg", "image/webp", "application/pdf"];
    if (!allowed.includes(data.mediaType)) {
      throw new Error("Unsupported file type. Upload a PNG, JPG, WEBP, or PDF.");
    }

    const gateway = createLovableAiGatewayProvider(key);

    const instruction = `Analyze this medical record/document. Extract the patient's equipment-relevant needs and produce a structured equipment needs report.
You are not diagnosing — only mapping documented findings to equipment categories.${data.notes ? `\n\nUser notes: ${data.notes}` : ""}

Respond with ONLY a valid JSON object (no markdown, no code fences) with EXACTLY this shape:
{
  "summary": "2-3 sentence plain-language summary of what the record shows (no PII like names or IDs)",
  "conditions": ["condition or issue relevant to equipment needs", ...],
  "recommendations": [
    {
      "equipment": "equipment type name",
      "reason": "why it would help",
      "priority": "high" | "medium" | "low",
      "searchTerms": ["1-3 short search phrases like 'blood pressure monitor'"]
    }
  ]
}`;

    const filePart = data.mediaType.startsWith("image/")
      ? ({ type: "image", image: data.fileDataUrl } as const)
      : ({ type: "file", data: data.fileDataUrl, mediaType: data.mediaType } as const);

    const { text } = await generateText({
      model: gateway("google/gemini-3-flash-preview"),
      messages: [
        {
          role: "user",
          content: [{ type: "text", text: instruction }, filePart],
        },
      ],
    });

    const cleaned = text.replace(/^```(?:json)?\s*/i, "").replace(/```\s*$/, "").trim();
    const start = cleaned.indexOf("{");
    const end = cleaned.lastIndexOf("}");
    if (start === -1 || end === -1) throw new Error("The AI returned an unexpected response. Please try again.");

    let parsed: unknown;
    try {
      parsed = JSON.parse(cleaned.slice(start, end + 1));
    } catch {
      throw new Error("The AI returned an unexpected response. Please try again.");
    }

    const result = ReportSchema.safeParse(parsed);
    if (!result.success) throw new Error("The AI report was incomplete. Please try again.");
    return result.data;
  });

const GuideInput = z.object({
  equipment: z.string().min(2).max(200),
});

export const generateUsageGuide = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => GuideInput.parse(input))
  .handler(async ({ data }) => {
    const key = process.env.LOVABLE_API_KEY;
    if (!key) throw new Error("AI is not configured on the server.");

    const gateway = createLovableAiGatewayProvider(key);

    const { text } = await generateText({
      model: gateway("google/gemini-3-flash-preview"),
      system: `You write clear, safety-first usage guides for health and medical equipment, for a general audience. Use markdown with these sections: a one-line intro, "## Before you start", "## Step-by-step usage" (numbered), "## Safety tips", "## Care & maintenance", "## When to ask a professional". Keep it practical and concise. You are not a doctor; do not give medical diagnoses.

If helpful, you may reference related products available on MediFind. Catalog for context:
${buildCatalogContext()}
Link products as [Name](/product/<id>) only if directly relevant.`,
      prompt: `Write a usage guide for: ${data.equipment}`,
    });

    return { guide: text };
  });
