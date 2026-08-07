import { Link } from "@tanstack/react-router";
import { Check, Lock, Play } from "lucide-react";
import type { ActivityNode } from "@/lib/navigation/types";
import { getActivityPresentation } from "@/lib/navigation/activity-presentation";
import { cn } from "@/lib/utils";

interface Props {
  activities: ActivityNode[];
  accent: string;
}

export function TrailPath({ activities, accent }: Props) {
  const currentIndex = activities.findIndex(
    (a) =>
      a.state === "available" ||
      a.state === "unlocked" ||
      a.state === "in_progress",
  );

  return (
    <ol
      className="relative flex flex-col"
      style={{ ["--trail-accent" as string]: accent }}
    >
      {activities.map((activity, i) => {
        const p = getActivityPresentation(activity);
        const locked = activity.state === "locked";
        const completed = activity.state === "completed";
        const isCurrent = i === currentIndex;

        const card = (
          <div
            className={cn(
              "relative rounded-3xl border p-4 transition-all duration-200",
              locked
                ? "border-border bg-card/50"
                : "border-border bg-card group-hover:-translate-y-0.5",
            )}
            style={{
              boxShadow: locked ? undefined : "var(--shadow-card)",
              borderColor: isCurrent
                ? "color-mix(in oklab, var(--trail-accent) 55%, transparent)"
                : undefined,
              background: isCurrent
                ? "color-mix(in oklab, var(--trail-accent) 10%, var(--card))"
                : undefined,
            }}
          >
            <div className="flex items-start gap-3">
              <span
                className={cn(
                  "grid h-12 w-12 shrink-0 place-items-center rounded-2xl text-xl",
                  locked && "grayscale opacity-60",
                )}
                style={{
                  background: completed
                    ? "color-mix(in oklab, var(--success) 22%, transparent)"
                    : "color-mix(in oklab, var(--trail-accent) 18%, transparent)",
                  border: `1px solid ${
                    completed
                      ? "color-mix(in oklab, var(--success) 45%, transparent)"
                      : "color-mix(in oklab, var(--trail-accent) 40%, transparent)"
                  }`,
                }}
                aria-hidden
              >
                {p.emoji}
              </span>

              <div className="min-w-0 flex-1">
                <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                  {p.subtitle}
                </p>
                <h3
                  className={cn(
                    "mt-0.5 text-base leading-tight font-semibold text-balance",
                    locked && "text-muted-foreground",
                  )}
                >
                  {p.name}
                </h3>
              </div>

              <span
                className="grid h-8 w-8 shrink-0 place-items-center rounded-full"
                style={{
                  background: locked
                    ? "var(--secondary)"
                    : completed
                      ? "var(--success)"
                      : "var(--trail-accent)",
                  color: locked ? undefined : "var(--background)",
                }}
              >
                {locked ? (
                  <Lock className="h-4 w-4 text-muted-foreground" />
                ) : completed ? (
                  <Check className="h-4 w-4" strokeWidth={3} />
                ) : (
                  <Play className="h-3.5 w-3.5 fill-current" />
                )}
              </span>
            </div>

            {isCurrent && (
              <span
                className="mt-3 inline-flex items-center rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-background"
                style={{ background: "var(--trail-accent)" }}
              >
                Continue here
              </span>
            )}
          </div>
        );

        return (
          <li key={activity.id} className="relative pl-9">
            {/* spine */}
            <span
              aria-hidden
              className="absolute left-[13px] top-0 w-[3px] rounded-full"
              style={{
                height: i === activities.length - 1 ? "34px" : "100%",
                background: completed
                  ? "color-mix(in oklab, var(--success) 60%, transparent)"
                  : "var(--secondary)",
              }}
            />
            <span
              aria-hidden
              className="absolute left-[7px] top-[26px] h-4 w-4 rounded-full border-[3px] border-background"
              style={{
                background: locked
                  ? "var(--secondary)"
                  : completed
                    ? "var(--success)"
                    : "var(--trail-accent)",
              }}
            />
            <div className="pb-4">
              {locked ? (
                <div className="cursor-not-allowed opacity-70">{card}</div>
              ) : (
                <Link
                  to="/activity/$activityId"
                  params={{ activityId: activity.id }}
                  className="group block focus-visible:outline-none"
                  aria-label={`Open ${p.name}`}
                >
                  {card}
                </Link>
              )}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
