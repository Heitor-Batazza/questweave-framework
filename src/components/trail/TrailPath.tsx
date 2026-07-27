import { useLayoutEffect, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Check, Flag, Gift, Lock, Package, Play, Skull, Sparkles, Star } from "lucide-react";
import type { ActivityNode } from "@/lib/navigation/types";
import { cn } from "@/lib/utils";

const KIND_ICON = {
  standard: Star,
  checkpoint: Flag,
  boss: Skull,
  reward: Gift,
  chest: Package,
  secret: Sparkles,
} as const;

const NODE = 68;
const ROW = 116;
const PAD_Y = 40;

interface Props {
  activities: ActivityNode[];
  accent: string;
}

export function TrailPath({ activities, accent }: Props) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [width, setWidth] = useState(340);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const update = () => setWidth(el.clientWidth || 340);
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const amplitude = Math.min(width / 2 - NODE / 2 - 12, 110);
  const centerX = width / 2;

  const points = activities.map((a, i) => ({
    activity: a,
    x: centerX + Math.sin(i * 0.95 + 0.4) * amplitude,
    y: PAD_Y + i * ROW,
  }));

  const height = PAD_Y * 2 + Math.max(points.length - 1, 0) * ROW + NODE;

  // Smooth vertical curve through the nodes.
  let d = "";
  points.forEach((p, i) => {
    if (i === 0) {
      d += `M ${p.x} ${p.y + NODE / 2}`;
      return;
    }
    const prev = points[i - 1];
    const y1 = prev.y + NODE / 2;
    const y2 = p.y + NODE / 2;
    const mid = (y1 + y2) / 2;
    d += ` C ${prev.x} ${mid}, ${p.x} ${mid}, ${p.x} ${y2}`;
  });

  const nextIndex = points.findIndex(
    (p) =>
      p.activity.state === "available" ||
      p.activity.state === "unlocked" ||
      p.activity.state === "in_progress",
  );

  return (
    <div ref={ref} className="relative w-full" style={{ height }}>
      <svg
        className="pointer-events-none absolute inset-0"
        width={width}
        height={height}
        aria-hidden
      >
        <path
          d={d}
          fill="none"
          strokeWidth={14}
          strokeLinecap="round"
          stroke="var(--secondary)"
        />
        <path
          d={d}
          fill="none"
          strokeWidth={4}
          strokeLinecap="round"
          strokeDasharray="2 16"
          stroke="color-mix(in oklab, var(--trail-accent) 70%, transparent)"
          style={{ ["--trail-accent" as string]: accent }}
        />
      </svg>

      {points.map((p, i) => {
        const a = p.activity;
        const Icon = KIND_ICON[a.kind];
        const isNext = i === nextIndex;
        const locked = a.state === "locked";
        const completed = a.state === "completed";
        const highlight = a.flags.highlight || a.state === "available";

        const content = (
          <>
            <span
              className={cn(
                "grid place-items-center rounded-full border-2 transition-transform duration-200",
                locked
                  ? "border-border bg-secondary text-muted-foreground"
                  : "text-background",
                !locked && "group-active:translate-y-0.5",
              )}
              style={{
                width: NODE,
                height: NODE,
                background: locked
                  ? undefined
                  : completed
                    ? "var(--success)"
                    : "var(--trail-accent)",
                borderColor: locked
                  ? undefined
                  : "color-mix(in oklab, black 25%, transparent)",
                boxShadow: locked ? undefined : "var(--shadow-node)",
                ["--trail-accent" as string]: accent,
              }}
            >
              {locked ? (
                <Lock className="h-6 w-6" />
              ) : completed ? (
                <Check className="h-7 w-7" strokeWidth={3} />
              ) : a.state === "in_progress" ? (
                <Play className="h-6 w-6 fill-current" />
              ) : (
                <Icon className="h-6 w-6" strokeWidth={2.4} />
              )}
            </span>
            <span className="mt-1.5 block text-center font-mono text-[10px] uppercase tracking-wide text-muted-foreground">
              {a.id}
            </span>
          </>
        );

        return (
          <div
            key={a.id}
            className="absolute"
            style={{ left: p.x - NODE / 2, top: p.y, width: NODE }}
          >
            {highlight && !locked && (
              <span
                aria-hidden
                className="absolute inset-0 animate-ping rounded-full"
                style={{
                  background:
                    "color-mix(in oklab, var(--ping-accent) 35%, transparent)",
                  ["--ping-accent" as string]: accent,
                  height: NODE,
                }}
              />
            )}
            {locked ? (
              <div className="group cursor-not-allowed opacity-70">{content}</div>
            ) : (
              <Link
                to="/activity/$activityId"
                params={{ activityId: a.id }}
                className="group relative block focus-visible:outline-none"
                aria-label={`Open activity ${a.id}`}
              >
                {content}
              </Link>
            )}
            {isNext && (
              <span
                className="absolute -top-7 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-background"
                style={{ background: accent }}
              >
                Next
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
}