import { Link } from "@tanstack/react-router";
import { ChevronRight, Lock, ListChecks, icons } from "lucide-react";
import type { StudyArea } from "@/lib/navigation/types";
import {
  AREA_ACCENT_VAR,
  getAreaActivityCount,
  getAreaPresentation,
  isAreaUnlocked,
} from "@/lib/navigation/presentation";
import { cn } from "@/lib/utils";

export function AreaCard({ area }: { area: StudyArea }) {
  const p = getAreaPresentation(area.id);
  const unlocked = isAreaUnlocked(area.id);
  const count = getAreaActivityCount(area.id);
  const accent = AREA_ACCENT_VAR[p.accent];
  const progress = unlocked ? p.progress : 0;
  const AreaIcon = icons[p.icon as keyof typeof icons] ?? ListChecks;

  return (
    <article
      className={cn(
        "group relative overflow-hidden rounded-3xl border border-border bg-card p-5 transition-all duration-300",
        unlocked
          ? "hover:-translate-y-0.5 hover:border-[color-mix(in_oklab,var(--card-accent)_45%,transparent)]"
          : "opacity-70",
      )}
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
          opacity: unlocked ? 0.22 : 0.08,
        }}
      />

      <div className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-start gap-3">
        <div
          className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl text-xl"
          style={{
            background:
              "color-mix(in oklab, var(--card-accent) 20%, transparent)",
            border:
              "1px solid color-mix(in oklab, var(--card-accent) 40%, transparent)",
          }}
        >
          <AreaIcon
            className="h-6 w-6"
            style={{ color: "var(--card-accent)" }}
            aria-hidden
          />
        </div>

        <div className="min-w-0">
          <h3 className="truncate text-base font-semibold sm:text-lg">
            {p.name}
          </h3>
          <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
            {p.description}
          </p>
        </div>

        <span
          className={cn(
            "inline-flex shrink-0 items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide",
            unlocked
              ? "bg-success/15 text-success"
              : "bg-muted text-muted-foreground",
          )}
        >
          {unlocked ? "Unlocked" : <Lock className="h-3 w-3" />}
          {!unlocked && "Locked"}
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
        {unlocked ? (
          <Link
            to="/trail/$trailId"
            params={{ trailId: area.trailId }}
            className="inline-flex w-full items-center justify-center gap-1.5 rounded-xl px-4 py-2.5 text-sm font-semibold text-background transition-transform duration-200 active:scale-[0.98]"
            style={{ background: "var(--card-accent)" }}
          >
            Enter trail
            <ChevronRight className="h-4 w-4" />
          </Link>
        ) : (
          <button
            type="button"
            disabled
            className="inline-flex w-full cursor-not-allowed items-center justify-center gap-1.5 rounded-xl border border-border bg-secondary px-4 py-2.5 text-sm font-semibold text-muted-foreground"
          >
            <Lock className="h-4 w-4" />
            Complete the previous area
          </button>
        )}
      </div>
    </article>
  );
}