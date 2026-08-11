import { Link } from "@tanstack/react-router";
import { Check, Lock, Star } from "lucide-react";
import type { ActivityNode } from "@/lib/navigation/types";
import { getActivityPresentation } from "@/lib/navigation/activity-presentation";
import { cn } from "@/lib/utils";

interface Props {
  activities: ActivityNode[];
  accent: string;
}

/** Geometry of the squared, winding path (in SVG user units = px). */
const WIDTH = 300;
const ROW = 116;
const PAD_TOP = 44;
const NODE = 58;
/** Horizontal lane positions, cycled to build the zig-zag. */
const LANES = [0.5, 0.78, 0.78, 0.5, 0.22, 0.22];

function laneX(i: number) {
  return Math.round(LANES[i % LANES.length] * WIDTH);
}

export function TrailPath({ activities, accent }: Props) {
  const currentIndex = activities.findIndex(
    (a) =>
      a.state === "available" ||
      a.state === "unlocked" ||
      a.state === "in_progress",
  );

  const points = activities.map((_, i) => ({
    x: laneX(i),
    y: PAD_TOP + i * ROW,
  }));
  const height = PAD_TOP * 2 + Math.max(0, activities.length - 1) * ROW;

  // Orthogonal (right-angle) polyline between consecutive nodes.
  const segments = points.slice(0, -1).map((p, i) => {
    const n = points[i + 1];
    const midY = (p.y + n.y) / 2;
    return {
      d:
        p.x === n.x
          ? `M ${p.x} ${p.y} L ${n.x} ${n.y}`
          : `M ${p.x} ${p.y} L ${p.x} ${midY} L ${n.x} ${midY} L ${n.x} ${n.y}`,
      done: activities[i].state === "completed",
    };
  });

  return (
    <div
      className="relative mx-auto"
      style={{
        width: WIDTH,
        height,
        ["--trail-accent" as string]: accent,
      }}
    >
      <svg
        aria-hidden
        className="absolute inset-0"
        width={WIDTH}
        height={height}
        viewBox={`0 0 ${WIDTH} ${height}`}
      >
        {segments.map((s, i) => (
          <path
            key={i}
            d={s.d}
            fill="none"
            strokeWidth={14}
            strokeLinecap="square"
            strokeLinejoin="miter"
            stroke={
              s.done
                ? "color-mix(in oklab, var(--success) 45%, transparent)"
                : "var(--secondary)"
            }
          />
        ))}
      </svg>

      <ol className="absolute inset-0">
        {activities.map((activity, i) => {
          const p = getActivityPresentation(activity);
          const locked = activity.state === "locked";
          const completed = activity.state === "completed";
          const isCurrent = i === currentIndex;
          const { x, y } = points[i];
          const labelLeft = x > WIDTH / 2;

          const node = (
            <span
              className={cn(
                "grid place-items-center rounded-[14px] border-2 text-xl transition-transform duration-150",
                locked ? "opacity-70 grayscale" : "group-hover:-translate-y-0.5",
              )}
              style={{
                width: NODE,
                height: NODE,
                background: locked
                  ? "var(--secondary)"
                  : completed
                    ? "color-mix(in oklab, var(--success) 26%, var(--card))"
                    : "color-mix(in oklab, var(--trail-accent) 26%, var(--card))",
                borderColor: locked
                  ? "var(--border)"
                  : completed
                    ? "color-mix(in oklab, var(--success) 65%, transparent)"
                    : "color-mix(in oklab, var(--trail-accent) 75%, transparent)",
                boxShadow: locked
                  ? undefined
                  : `0 4px 0 0 ${
                      completed
                        ? "color-mix(in oklab, var(--success) 55%, transparent)"
                        : "color-mix(in oklab, var(--trail-accent) 55%, transparent)"
                    }`,
              }}
            >
              {locked ? (
                <Lock className="h-5 w-5 text-muted-foreground" />
              ) : (
                <span aria-hidden>{p.emoji}</span>
              )}
              {completed && (
                <span
                  className="absolute -right-1.5 -top-1.5 grid h-5 w-5 place-items-center rounded-[6px] text-background"
                  style={{ background: "var(--success)" }}
                >
                  <Check className="h-3 w-3" strokeWidth={3} />
                </span>
              )}
              {isCurrent && (
                <span
                  className="absolute -right-1.5 -top-1.5 grid h-5 w-5 place-items-center rounded-[6px] text-background"
                  style={{ background: "var(--trail-accent)" }}
                >
                  <Star className="h-3 w-3 fill-current" />
                </span>
              )}
            </span>
          );

          const label = (
            <span
              className={cn(
                "pointer-events-none absolute top-1/2 w-[104px] -translate-y-1/2 leading-tight",
                labelLeft ? "right-full mr-3 text-right" : "left-full ml-3",
              )}
            >
              <span className="block text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                {p.label}
              </span>
              <span
                className={cn(
                  "block text-[12px] font-semibold text-balance",
                  locked && "text-muted-foreground",
                )}
              >
                {p.name}
              </span>
            </span>
          );

          return (
            <li
              key={activity.id}
              className="absolute"
              style={{
                left: x - NODE / 2,
                top: y - NODE / 2,
                width: NODE,
                height: NODE,
              }}
            >
              {locked ? (
                <div className="relative cursor-not-allowed">
                  {node}
                  {label}
                </div>
              ) : (
                <Link
                  to="/activity/$activityId"
                  params={{ activityId: activity.id }}
                  className="group relative block focus-visible:outline-none"
                  aria-label={`Open ${p.name}`}
                >
                  {node}
                  {label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </div>
  );
}
