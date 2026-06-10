import { createFileRoute } from "@tanstack/react-router";
import { convertToModelMessages, streamText, type UIMessage } from "ai";
import {
  createLovableAiGatewayProvider,
  getLovableAiGatewayResponseHeaders,
  getLovableAiGatewayRunId,
  withLovableAiGatewayRunIdHeader,
  LOVABLE_AIG_RUN_ID_HEADER,
} from "@/lib/ai-gateway.server";
import { buildCatalogContext } from "@/lib/marketplace/catalog-context";

type ChatRequestBody = { messages?: unknown };

const SYSTEM_PROMPT = `You are the MediFind AI Shopping Assistant — a friendly, knowledgeable guide for a medical equipment marketplace.

Your job:
- Help shoppers (patients, caregivers, physiotherapists, hospitals) find the right health and medical equipment.
- Interpret described symptoms, conditions, or doctor recommendations and map them to suitable equipment from the catalog below.
- Answer questions about how to use equipment safely.
- Compare products, explain trade-offs (price, rating, condition, seller type).

Rules:
- Recommend ONLY products from the catalog below. Link them as markdown: [Product Name](/product/<id>) using the product id.
- When recommending, give 2–3 options at different price points when possible, with a one-line reason each.
- If a product is out of stock, mention it and suggest an alternative.
- You are NOT a doctor. Never diagnose. For anything serious, advise consulting a healthcare professional — briefly, without being preachy.
- If the user uploads a medical record or photo, extract relevant needs and recommend matching equipment. Remind them the full Record Analyzer lives on the AI Tool page (/ai-tool).
- Keep answers concise and well-formatted with short paragraphs, bold product names, and bullet lists.

${buildCatalogContext()}`;

export const Route = createFileRoute("/api/chat")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const { messages } = (await request.json()) as ChatRequestBody;
        if (!Array.isArray(messages)) {
          return new Response("Messages are required", { status: 400 });
        }

        const key = process.env.LOVABLE_API_KEY;
        if (!key) {
          return new Response("Missing LOVABLE_API_KEY", { status: 500 });
        }

        const initialRunId = getLovableAiGatewayRunId(request);
        const gateway = createLovableAiGatewayProvider(key, initialRunId);
        const model = gateway("google/gemini-3-flash-preview");

        const result = streamText({
          model,
          system: SYSTEM_PROMPT,
          messages: await convertToModelMessages(messages as UIMessage[]),
        });

        const response = result.toUIMessageStreamResponse({
          originalMessages: messages as UIMessage[],
          headers: getLovableAiGatewayResponseHeaders(undefined, {
            ...(initialRunId ? { [LOVABLE_AIG_RUN_ID_HEADER]: initialRunId } : {}),
          }),
        });

        return withLovableAiGatewayRunIdHeader(response, gateway);
      },
    },
  },
});
