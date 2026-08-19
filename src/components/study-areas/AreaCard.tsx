import { Link } from "@tanstack/react-router";
import { ChevronRight, ListChecks } from "lucide-react";
import type { StudyArea } from "@/lib/navigation/types";
import {
  AREA_ACCENT_VAR,
  getAreaActivityCount,
  getAreaPresentation,
} from "@/lib/navigation/presentation";

export function AreaCard({ area }: { area: StudyArea }) {
  const p = getAreaPresentation(area.id);
  const count = getAreaActivityCount(area.id);
  const accent = AREA_ACCENT_VAR[p.accent];
  const progress = p.progress;

  return (
    <article
      className="group relative overflow-hidden rounded-3xl border border-border bg-card p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-[color-mix(in_oklab,var(--card-accent)_45%,transparent)]"
      style={
        {
          "--card-accent": accent,
          boxShadow: "var(--shadow-card)",
        } as React.CSSProperties
      }
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full blur-3xl transition-opacity duration-300"
        style={{
          background:
            "color-mix(in oklab, var(--card-accent) 55%, transparent)",
          opacity: 0.22,
        }}
      />

      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3">
        <div className="min-w-0">
          <span
            aria-hidden
            className="mb-2 block h-1 w-10 rounded-full"
            style={{ background: "var(--card-accent)" }}
          />
          <h3 className="text-base leading-tight font-semibold text-balance sm:text-lg">
            {p.name}
          </h3>
          <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
            {p.description}
          </p>
        </div>

        <span className="inline-flex shrink-0 items-center rounded-full bg-secondary px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
          Open
        </span>
      </div>

      <div className="mt-4">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1.5">
            <ListChecks className="h-3.5 w-3.5" />
            {count} activities
          </span>
          <span className="font-semibold text-foreground">{progress}%</span>
        </div>
        <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-secondary">
          <div
            className="h-full rounded-full transition-[width] duration-700"
            style={{
              width: `${progress}%`,
              background:
                "linear-gradient(90deg, color-mix(in oklab, var(--card-accent) 70%, transparent), var(--card-accent))",
            }}
          />
        </div>
      </div>

      <div className="mt-4">
        <Link
          to="/trail/$trailId"
          params={{ trailId: area.trailId }}
          className="inline-flex w-full items-center justify-center gap-1.5 rounded-xl px-4 py-2.5 text-sm font-semibold text-on-accent transition-transform duration-200 active:scale-[0.98]"
          style={{ background: "var(--card-accent)" }}
        >
          Enter trail
          <ChevronRight className="h-4 w-4" />
        </Link>
      </div>
    </article>
  );
}