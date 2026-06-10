import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Loader2 } from "lucide-react";
import { generateUsageGuide } from "@/lib/ai.functions";
import { PRODUCTS } from "@/lib/marketplace/data";
import { MessageResponse } from "@/components/ai-elements/message";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

const POPULAR = ["Blood pressure monitor", "Pulse oximeter", "CPAP machine", "Walker", "TENS unit", "Nebulizer"];

export function UsageGuideTool() {
  const generate = useServerFn(generateUsageGuide);
  const [equipment, setEquipment] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [guide, setGuide] = useState<string | null>(null);
  const [guideFor, setGuideFor] = useState<string>("");

  const run = async (name: string) => {
    const value = name.trim();
    if (value.length < 2 || loading) return;
    setLoading(true);
    setError(null);
    setGuide(null);
    setGuideFor(value);
    try {
      const result = await generate({ data: { equipment: value } });
      setGuide(result.guide);
    } catch (e) {
      const msg = e instanceof Error ? e.message : "";
      if (msg.includes("429")) setError("Rate limit reached — please wait a moment and try again.");
      else if (msg.includes("402")) setError("AI credits are exhausted. Please add credits to continue.");
      else setError(msg || "Could not generate the guide. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-5">
      <Card>
        <CardHeader>
          <CardTitle className="font-heading text-base">Get a usage guide</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <form
            className="flex gap-2"
            onSubmit={(e) => {
              e.preventDefault();
              void run(equipment);
            }}
          >
            <Input
              value={equipment}
              onChange={(e) => setEquipment(e.target.value)}
              placeholder="Type any equipment, e.g. wheelchair, glucose meter…"
              list="equipment-options"
              maxLength={200}
            />
            <datalist id="equipment-options">
              {PRODUCTS.map((p) => (
                <option key={p.id} value={p.name} />
              ))}
            </datalist>
            <Button type="submit" disabled={equipment.trim().length < 2 || loading}>
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Generate"}
            </Button>
          </form>
          <div className="flex flex-wrap gap-1.5">
            {POPULAR.map((name) => (
              <button
                key={name}
                type="button"
                disabled={loading}
                onClick={() => {
                  setEquipment(name);
                  void run(name);
                }}
                className="rounded-full border bg-card px-3 py-1 text-xs transition-colors hover:border-primary/40 hover:bg-primary/5 disabled:opacity-50"
              >
                {name}
              </button>
            ))}
          </div>
          {error && (
            <p className="rounded-lg border border-destructive/30 bg-destructive/5 px-3 py-2 text-xs text-destructive">{error}</p>
          )}
        </CardContent>
      </Card>

      {loading && (
        <Card>
          <CardContent className="flex items-center gap-2 pt-5 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            Writing the guide for {guideFor}…
          </CardContent>
        </Card>
      )}

      {guide && (
        <Card>
          <CardHeader>
            <CardTitle className="font-heading text-base">How to use: {guideFor}</CardTitle>
          </CardHeader>
          <CardContent>
            <MessageResponse>{guide}</MessageResponse>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
