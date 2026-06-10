import { Link } from "@tanstack/react-router";
import type { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ComingSoonProps {
  icon: LucideIcon;
  title: string;
  description: string;
  phase: string;
  bullets: string[];
}

export function ComingSoon({ icon: Icon, title, description, phase, bullets }: ComingSoonProps) {
  return (
    <div className="flex min-h-[70vh] items-center justify-center p-6">
      <div className="w-full max-w-lg rounded-2xl border bg-card p-8 text-center shadow-sm">
        <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-2xl bg-accent text-accent-foreground">
          <Icon className="size-7" />
        </div>
        <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-primary">{phase}</p>
        <h1 className="mb-2 text-2xl font-bold">{title}</h1>
        <p className="mb-6 text-sm text-muted-foreground">{description}</p>
        <ul className="mb-8 space-y-2 text-left text-sm">
          {bullets.map((b) => (
            <li key={b} className="flex items-start gap-2">
              <span className="mt-1 size-1.5 shrink-0 rounded-full bg-primary" />
              <span className="text-muted-foreground">{b}</span>
            </li>
          ))}
        </ul>
        <Button asChild>
          <Link to="/">Browse the marketplace</Link>
        </Button>
      </div>
    </div>
  );
}
