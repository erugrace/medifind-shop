import { useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { FileUp, Loader2, X } from "lucide-react";
import { analyzeMedicalRecord, type RecordReport } from "@/lib/ai.functions";
import { PRODUCTS } from "@/lib/marketplace/data";
import type { Product } from "@/lib/marketplace/types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";

const MAX_FILE_BYTES = 10 * 1024 * 1024;
const ACCEPTED = ["image/png", "image/jpeg", "image/webp", "application/pdf"];

function matchProducts(terms: string[], limit = 2): Product[] {
  const words = terms.flatMap((t) => t.toLowerCase().split(/\s+/)).filter((w) => w.length > 2);
  if (words.length === 0) return [];
  const scored = PRODUCTS.map((p) => {
    const haystack = `${p.name} ${p.brand} ${p.subcategory} ${p.description}`.toLowerCase();
    const score = words.reduce((acc, w) => acc + (haystack.includes(w) ? 1 : 0), 0);
    return { p, score };
  })
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score || b.p.rating - a.p.rating);
  return scored.slice(0, limit).map((x) => x.p);
}

function priorityVariant(priority: string): "default" | "secondary" | "outline" {
  const v = priority.toLowerCase();
  if (v.includes("high")) return "default";
  if (v.includes("med")) return "secondary";
  return "outline";
}

export function RecordAnalyzer() {
  const analyze = useServerFn(analyzeMedicalRecord);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [report, setReport] = useState<RecordReport | null>(null);

  const onPickFile = (f: File | null) => {
    setError(null);
    setReport(null);
    if (!f) return setFile(null);
    if (!ACCEPTED.includes(f.type)) {
      setError("Unsupported file type. Upload a PNG, JPG, WEBP, or PDF.");
      return;
    }
    if (f.size > MAX_FILE_BYTES) {
      setError("File is too large — max 10MB.");
      return;
    }
    setFile(f);
  };

  const runAnalysis = async () => {
    if (!file || loading) return;
    setLoading(true);
    setError(null);
    setReport(null);
    try {
      const fileDataUrl = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = () => reject(new Error("Could not read file"));
        reader.readAsDataURL(file);
      });
      const result = await analyze({ data: { fileDataUrl, mediaType: file.type, notes: notes.trim() || undefined } });
      setReport(result);
    } catch (e) {
      const msg = e instanceof Error ? e.message : "";
      if (msg.includes("429")) setError("Rate limit reached — please wait a moment and try again.");
      else if (msg.includes("402")) setError("AI credits are exhausted. Please add credits to continue.");
      else setError(msg || "Analysis failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-5">
      <Card>
        <CardHeader>
          <CardTitle className="font-heading text-base">Upload a medical record</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <input
            ref={fileInputRef}
            type="file"
            accept={ACCEPTED.join(",")}
            className="hidden"
            onChange={(e) => onPickFile(e.target.files?.[0] ?? null)}
          />
          {file ? (
            <div className="flex items-center justify-between rounded-lg border bg-muted/40 px-3 py-2.5">
              <div className="flex min-w-0 items-center gap-2 text-sm">
                <FileUp className="h-4 w-4 shrink-0 text-primary" />
                <span className="truncate font-medium">{file.name}</span>
                <span className="shrink-0 text-xs text-muted-foreground">{(file.size / 1024 / 1024).toFixed(1)} MB</span>
              </div>
              <Button variant="ghost" size="icon-sm" onClick={() => onPickFile(null)} aria-label="Remove file">
                <X className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex w-full flex-col items-center gap-2 rounded-lg border-2 border-dashed px-4 py-8 text-center transition-colors hover:border-primary/40 hover:bg-primary/5"
            >
              <FileUp className="h-6 w-6 text-primary" />
              <span className="text-sm font-medium">Click to upload a record</span>
              <span className="text-xs text-muted-foreground">PNG, JPG, WEBP, or PDF — max 10MB. Processed privately, not stored.</span>
            </button>
          )}
          <Textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Optional notes — e.g. budget, living situation, what the doctor said…"
            rows={2}
            maxLength={2000}
          />
          <Button onClick={runAnalysis} disabled={!file || loading} className="w-full">
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Analyzing record…
              </>
            ) : (
              "Analyze record"
            )}
          </Button>
          {error && (
            <p className="rounded-lg border border-destructive/30 bg-destructive/5 px-3 py-2 text-xs text-destructive">{error}</p>
          )}
        </CardContent>
      </Card>

      {report && (
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="font-heading text-base">Equipment needs report</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm leading-relaxed">{report.summary}</p>
              {report.conditions.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {report.conditions.map((c) => (
                    <Badge key={c} variant="secondary">{c}</Badge>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {report.recommendations.map((rec, i) => {
            const matches = matchProducts(rec.searchTerms);
            return (
              <Card key={i}>
                <CardContent className="space-y-3 pt-5">
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="font-heading text-sm font-semibold">{rec.equipment}</h3>
                    <Badge variant={priorityVariant(rec.priority)} className="shrink-0 capitalize">{rec.priority} priority</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{rec.reason}</p>
                  {matches.length > 0 && (
                    <div className="space-y-1.5">
                      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Matching products</p>
                      {matches.map((p) => (
                        <Link
                          key={p.id}
                          to="/product/$productId"
                          params={{ productId: p.id }}
                          className="flex items-center justify-between rounded-lg border px-3 py-2 text-sm transition-colors hover:border-primary/40 hover:bg-primary/5"
                        >
                          <span className="min-w-0 truncate font-medium">{p.name}</span>
                          <span className="ml-3 shrink-0 text-primary">${p.price.toFixed(2)}</span>
                        </Link>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
