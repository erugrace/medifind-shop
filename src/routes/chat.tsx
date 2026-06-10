import { createFileRoute } from "@tanstack/react-router";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, type UIMessage } from "ai";
import { useEffect, useState } from "react";
import { RotateCcw } from "lucide-react";
import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
} from "@/components/ai-elements/conversation";
import { Message, MessageContent, MessageResponse } from "@/components/ai-elements/message";
import {
  PromptInput,
  PromptInputFooter,
  PromptInputSubmit,
  PromptInputTextarea,
  type PromptInputMessage,
} from "@/components/ai-elements/prompt-input";
import { Shimmer } from "@/components/ai-elements/shimmer";
import { Button } from "@/components/ui/button";
import assistantLogo from "@/assets/ai-assistant-logo.png";

const STORAGE_KEY = "medifind-chat-v1";

export const Route = createFileRoute("/chat")({
  head: () => ({
    meta: [
      { title: "AI Shopping Assistant — MediFind" },
      { name: "description", content: "Chat with an AI assistant that recommends the right medical equipment for your needs." },
      { property: "og:title", content: "AI Shopping Assistant — MediFind" },
      { property: "og:description", content: "AI assistant that recommends the right medical equipment." },
    ],
  }),
  component: ChatPage,
});

const SUGGESTIONS = [
  "I need a blood pressure monitor under $80",
  "My dad just had knee surgery — what should we get for recovery?",
  "What's the best walker for a small apartment?",
  "How do I use a pulse oximeter correctly?",
];

function ChatPage() {
  const [initialMessages, setInitialMessages] = useState<UIMessage[] | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      setInitialMessages(raw ? (JSON.parse(raw) as UIMessage[]) : []);
    } catch {
      setInitialMessages([]);
    }
  }, []);

  if (initialMessages === null) {
    return <div className="flex h-[calc(100dvh-3.5rem)] items-center justify-center" />;
  }

  return <ChatWindow initialMessages={initialMessages} />;
}

function ChatWindow({ initialMessages }: { initialMessages: UIMessage[] }) {
  const [errorText, setErrorText] = useState<string | null>(null);

  const { messages, sendMessage, status, setMessages } = useChat({
    id: "medifind-main",
    messages: initialMessages,
    transport: new DefaultChatTransport({ api: "/api/chat" }),
    onError: (error) => {
      const msg = error.message ?? "";
      if (msg.includes("429")) setErrorText("Rate limit reached — please wait a moment and try again.");
      else if (msg.includes("402")) setErrorText("AI credits are exhausted. Please add credits to continue.");
      else setErrorText("Something went wrong talking to the assistant. Please try again.");
    },
  });

  // Persist the single conversation in this browser
  useEffect(() => {
    if (status === "streaming") return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    } catch {
      // storage full or unavailable — ignore
    }
  }, [messages, status]);

  // Keep the composer focused
  useEffect(() => {
    if (status === "ready") {
      document.getElementById("chat-input")?.focus();
    }
  }, [status]);

  const isLoading = status === "submitted" || status === "streaming";

  const handleSubmit = (message: PromptInputMessage) => {
    const text = message.text?.trim();
    if (!text || isLoading) return;
    setErrorText(null);
    void sendMessage({ text });
  };

  const startNewConversation = () => {
    setMessages([]);
    setErrorText(null);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
    document.getElementById("chat-input")?.focus();
  };

  return (
    <div className="mx-auto flex h-[calc(100dvh-3.5rem)] max-w-3xl flex-col px-4">
      <div className="flex items-center justify-between gap-2 py-3">
        <div className="flex items-center gap-2.5">
          <img src={assistantLogo} alt="MediFind AI assistant" width={512} height={512} className="h-8 w-8" loading="lazy" />
          <div>
            <h1 className="font-heading text-sm font-semibold leading-tight">AI Shopping Assistant</h1>
            <p className="text-xs text-muted-foreground">Finds the right equipment for your needs</p>
          </div>
        </div>
        {messages.length > 0 && (
          <Button variant="ghost" size="sm" onClick={startNewConversation} className="text-muted-foreground">
            <RotateCcw className="h-3.5 w-3.5" />
            New conversation
          </Button>
        )}
      </div>

      <Conversation className="flex-1">
        <ConversationContent className="pb-4">
          {messages.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center gap-6 py-16 text-center">
              <img src={assistantLogo} alt="" width={512} height={512} className="h-20 w-20" loading="lazy" />
              <div className="space-y-1.5">
                <h2 className="font-heading text-xl font-semibold">How can I help you today?</h2>
                <p className="mx-auto max-w-sm text-sm text-muted-foreground">
                  Describe a need, condition, or budget — I'll recommend the right equipment from our marketplace.
                </p>
              </div>
              <div className="flex flex-wrap justify-center gap-2">
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => {
                      setErrorText(null);
                      void sendMessage({ text: s });
                    }}
                    className="rounded-full border bg-card px-3.5 py-1.5 text-xs text-foreground transition-colors hover:border-primary/40 hover:bg-primary/5"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            messages.map((message) => (
              <Message from={message.role} key={message.id}>
                <MessageContent
                  className={
                    message.role === "assistant"
                      ? "bg-transparent p-0 text-foreground"
                      : "bg-primary text-primary-foreground"
                  }
                >
                  {message.parts.map((part, i) =>
                    part.type === "text" ? <MessageResponse key={i}>{part.text}</MessageResponse> : null,
                  )}
                </MessageContent>
              </Message>
            ))
          )}
          {status === "submitted" && (
            <div className="flex items-center gap-2 py-2">
              <img src={assistantLogo} alt="" width={512} height={512} className="h-5 w-5" loading="lazy" />
              <Shimmer className="text-sm">Thinking...</Shimmer>
            </div>
          )}
        </ConversationContent>
        <ConversationScrollButton />
      </Conversation>

      {errorText && (
        <div className="mb-2 rounded-lg border border-destructive/30 bg-destructive/5 px-3 py-2 text-xs text-destructive">
          {errorText}
        </div>
      )}

      <div className="pb-4">
        <PromptInput onSubmit={handleSubmit}>
          <PromptInputTextarea id="chat-input" autoFocus placeholder="Ask about equipment, conditions, or budgets…" />
          <PromptInputFooter className="justify-end">
            <PromptInputSubmit status={status} disabled={isLoading} />
          </PromptInputFooter>
        </PromptInput>
        <p className="mt-1.5 text-center text-[11px] text-muted-foreground">
          AI guidance is informational and not medical advice.
        </p>
      </div>
    </div>
  );
}
