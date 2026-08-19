import { useEffect, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Check, Lock } from "lucide-react";
import type { ActivityNode } from "@/lib/navigation/types";
import { getActivityPresentation } from "@/lib/navigation/activity-presentation";
import { cn } from "@/lib/utils";

interface Props {
  activities: ActivityNode[];
  accent: string;
}

/** Geometry of the squared, winding path (in SVG user units = px). */
const ROW = 124;
const PAD_TOP = 52;
const NODE = 56;
const CORNER = 14;
const STROKE = 16;
/** Horizontal lane positions, cycled to build the zig-zag. */
const LANES = [0.5, 0.86, 0.86, 0.5, 0.14, 0.14];

/** Orthogonal polyline with slightly rounded (but still square-ish) corners. */
function squarePath(pts: { x: number; y: number }[], r: number) {
  if (pts.length < 2) return "";
  let d = `M ${pts[0].x} ${pts[0].y}`;
  for (let i = 1; i < pts.length - 1; i++) {
    const prev = pts[i - 1];
    const cur = pts[i];
    const next = pts[i + 1];
    const inLen = Math.hypot(cur.x - prev.x, cur.y - prev.y);
    const outLen = Math.hypot(next.x - cur.x, next.y - cur.y);
    const rr = Math.min(r, inLen / 2, outLen / 2);
    const a = {
      x: cur.x + ((prev.x - cur.x) / (inLen || 1)) * rr,
      y: cur.y + ((prev.y - cur.y) / (inLen || 1)) * rr,
    };
    const b = {
      x: cur.x + ((next.x - cur.x) / (outLen || 1)) * rr,
      y: cur.y + ((next.y - cur.y) / (outLen || 1)) * rr,
    };
    d += ` L ${a.x} ${a.y} Q ${cur.x} ${cur.y} ${b.x} ${b.y}`;
  }
  const last = pts[pts.length - 1];
  d += ` L ${last.x} ${last.y}`;
  return d;
}

export function TrailPath({ activities, accent }: Props) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(320);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      setWidth(Math.round(entry.contentRect.width));
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const laneX = (i: number) =>
    Math.round(
      Math.min(
        width - NODE / 2 - 8,
        Math.max(NODE / 2 + 8, LANES[i % LANES.length] * width),
      ),
    );

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
    const pts =
      p.x === n.x
        ? [p, n]
        : [p, { x: p.x, y: midY }, { x: n.x, y: midY }, n];
    return {
      d: squarePath(pts, CORNER),
      done: activities[i].state === "completed",
    };
  });

  return (
    <div
      ref={wrapRef}
      className="relative w-full"
      style={{
        height,
        ["--trail-accent" as string]: accent,
      }}
    >
      <svg
        aria-hidden
        className="absolute inset-0"
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
      >
        {segments.map((s, i) => (
          <g key={i}>
            <path
              d={s.d}
              fill="none"
              strokeWidth={STROKE + 6}
              strokeLinecap="butt"
              stroke="var(--background)"
            />
            <path
              d={s.d}
              fill="none"
              strokeWidth={STROKE}
              strokeLinecap="butt"
              stroke={
                s.done
                  ? "color-mix(in oklab, var(--success) 30%, var(--background))"
                  : "var(--surface-2)"
              }
            />
            <path
              d={s.d}
              fill="none"
              strokeWidth={2}
              strokeDasharray="2 10"
              strokeLinecap="round"
              stroke="color-mix(in oklab, var(--foreground) 14%, transparent)"
            />
          </g>
        ))}
      </svg>

      <ol className="absolute inset-0">
        {activities.map((activity, i) => {
          const p = getActivityPresentation(activity);
          const locked = activity.state === "locked";
          const completed = activity.state === "completed";
          const isCurrent = i === currentIndex;
          const { x, y } = points[i];
          const labelLeft = x > width / 2;

          const Icon = p.icon;
          const node = (
            <span
              className={cn(
                "grid place-items-center rounded-[16px] border-2 transition-transform duration-150",
                locked ? "opacity-70 grayscale" : "group-hover:-translate-y-0.5",
              )}
              style={{
                width: NODE,
                height: NODE,
                background: locked
                  ? "var(--secondary)"
                  : completed
                    ? "color-mix(in oklab, var(--success) 12%, var(--card))"
                    : "color-mix(in oklab, var(--trail-accent) 10%, var(--card))",
                borderColor: locked
                  ? "var(--border)"
                  : completed
                    ? "color-mix(in oklab, var(--success) 65%, transparent)"
                    : "color-mix(in oklab, var(--trail-accent) 75%, transparent)",
                boxShadow: locked
                  ? undefined
                  : `0 4px 0 0 ${
                      completed
                        ? "var(--success)"
                        : "color-mix(in oklab, var(--trail-accent) 100%, transparent)"
                    }`,
              }}
            >
              {locked ? (
                <Lock className="h-5 w-5 text-muted-foreground" />
              ) : (
                <Icon
                  className="h-6 w-6"
                  strokeWidth={2}
                  style={{
                    color: completed
                      ? "var(--success)"
                      : "var(--trail-accent)",
                  }}
                />
              )}
              {completed && (
                <span
                  className="absolute -right-1.5 -top-1.5 grid h-5 w-5 place-items-center rounded-[6px] text-on-accent"
                  style={{ background: "var(--success)" }}
                >
                  <Check className="h-3 w-3" strokeWidth={3} />
                </span>
              )}
              {isCurrent && (
                <span
                  className="pointer-events-none absolute -inset-1.5 rounded-[20px] border-2"
                  style={{
                    borderColor:
                      "color-mix(in oklab, var(--trail-accent) 45%, transparent)",
                  }}
                />
              )}
            </span>
          );

          const label = (
            <span
              className={cn(
                "pointer-events-none absolute top-1/2 w-[132px] -translate-y-1/2 leading-tight",
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
