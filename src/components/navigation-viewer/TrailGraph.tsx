import { useLayoutEffect, useRef, useState } from "react";
import type { ActivityNode, Trail } from "@/lib/navigation/types";
import { ActivityCard } from "./ActivityCard";

interface Props {
  trail: Trail;
  activities: ActivityNode[];
}

interface Edge {
  from: string;
  to: string;
  d: string;
}

const COL_WIDTH = 200;
const ROW_HEIGHT = 120;
const PADDING_X = 24;
const PADDING_Y = 24;

export function TrailGraph({ trail, activities }: Props) {
  // Group activities by order → columns.
  const byOrder = new Map<number, ActivityNode[]>();
  for (const a of activities) {
    const list = byOrder.get(a.order) ?? [];
    list.push(a);
    byOrder.set(a.order, list);
  }
  const orders = [...byOrder.keys()].sort((a, b) => a - b);

  // Compute layout positions keyed by activity id.
  const positions = new Map<string, { x: number; y: number }>();
  let maxRow = 0;
  for (const [i, order] of orders.entries()) {
    const nodes = byOrder.get(order)!;
    nodes.forEach((n, rowIndex) => {
      positions.set(n.id, {
        x: PADDING_X + i * COL_WIDTH,
        y: PADDING_Y + rowIndex * ROW_HEIGHT,
      });
      if (rowIndex > maxRow) maxRow = rowIndex;
    });
  }

  const width = PADDING_X * 2 + Math.max(orders.length, 1) * COL_WIDTH;
  const height = PADDING_Y * 2 + (maxRow + 1) * ROW_HEIGHT;

  // Measured node sizes to draw edges from node edges.
  const containerRef = useRef<HTMLDivElement | null>(null);
  const nodeRefs = useRef(new Map<string, HTMLDivElement | null>());
  const [edges, setEdges] = useState<Edge[]>([]);

  useLayoutEffect(() => {
    const c = containerRef.current;
    if (!c) return;
    const cRect = c.getBoundingClientRect();
    const next: Edge[] = [];
    for (const a of activities) {
      const fromEl = nodeRefs.current.get(a.id);
      if (!fromEl) continue;
      const fRect = fromEl.getBoundingClientRect();
      const fx = fRect.right - cRect.left;
      const fy = fRect.top - cRect.top + fRect.height / 2;
      for (const toId of a.nextActivityIds) {
        const toEl = nodeRefs.current.get(toId);
        if (!toEl) continue;
        const tRect = toEl.getBoundingClientRect();
        const tx = tRect.left - cRect.left;
        const ty = tRect.top - cRect.top + tRect.height / 2;
        const mx = (fx + tx) / 2;
        const d = `M ${fx} ${fy} C ${mx} ${fy}, ${mx} ${ty}, ${tx} ${ty}`;
        next.push({ from: a.id, to: toId, d });
      }
    }
    setEdges(next);
  }, [activities]);

  return (
    <div
      ref={containerRef}
      className="relative overflow-x-auto rounded-lg border bg-card"
      style={{ minHeight: height }}
    >
      <div className="relative" style={{ width, height }}>
        <svg
          className="pointer-events-none absolute inset-0"
          width={width}
          height={height}
        >
          <defs>
            <marker
              id={`arrow-${trail.id}`}
              viewBox="0 0 10 10"
              refX="8"
              refY="5"
              markerWidth="6"
              markerHeight="6"
              orient="auto-start-reverse"
            >
              <path d="M 0 0 L 10 5 L 0 10 z" className="fill-muted-foreground" />
            </marker>
          </defs>
          {edges.map((e) => (
            <path
              key={`${e.from}->${e.to}`}
              d={e.d}
              className="stroke-muted-foreground/50"
              strokeWidth={1.5}
              fill="none"
              markerEnd={`url(#arrow-${trail.id})`}
            />
          ))}
        </svg>
        {activities.map((a) => {
          const p = positions.get(a.id)!;
          return (
            <div
              key={a.id}
              ref={(el) => {
                nodeRefs.current.set(a.id, el);
              }}
              className="absolute"
              style={{ left: p.x, top: p.y, width: COL_WIDTH - 40 }}
            >
              <ActivityCard activity={a} />
            </div>
          );
        })}
      </div>
    </div>
  );
}