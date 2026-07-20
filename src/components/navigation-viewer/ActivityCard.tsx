import type { ActivityNode } from "@/lib/navigation/types";
import { cn } from "@/lib/utils";
import {
  Circle,
  Flag,
  Gift,
  Lock,
  Package,
  Skull,
  Sparkles,
  Check,
  Play,
  EyeOff,
} from "lucide-react";

const KIND_ICON = {
  standard: Circle,
  checkpoint: Flag,
  boss: Skull,
  reward: Gift,
  chest: Package,
  secret: Sparkles,
} as const;

const STATE_STYLES: Record<
  ActivityNode["state"],
  { border: string; bg: string; text: string; label: string }
> = {
  locked: {
    border: "border-border",
    bg: "bg-muted/40",
    text: "text-muted-foreground",
    label: "Locked",
  },
  available: {
    border: "border-primary/60",
    bg: "bg-primary/5",
    text: "text-foreground",
    label: "Available",
  },
  unlocked: {
    border: "border-primary",
    bg: "bg-primary/10",
    text: "text-foreground",
    label: "Unlocked",
  },
  in_progress: {
    border: "border-primary",
    bg: "bg-primary/15",
    text: "text-foreground",
    label: "In progress",
  },
  completed: {
    border: "border-emerald-500/60",
    bg: "bg-emerald-500/10",
    text: "text-foreground",
    label: "Completed",
  },
};

export function ActivityCard({ activity }: { activity: ActivityNode }) {
  const Icon = KIND_ICON[activity.kind];
  const s = STATE_STYLES[activity.state];
  const flags = activity.flags;

  return (
    <div
      className={cn(
        "rounded-md border px-2.5 py-2 shadow-sm transition-shadow",
        s.border,
        s.bg,
        flags.highlight && "ring-2 ring-primary ring-offset-2 ring-offset-background",
      )}
    >
      <div className="flex items-center gap-2">
        <Icon className={cn("h-4 w-4 shrink-0", s.text)} />
        <span className={cn("truncate font-mono text-xs", s.text)}>
          {activity.id}
        </span>
        {activity.state === "locked" && (
          <Lock className="ml-auto h-3 w-3 text-muted-foreground" />
        )}
        {activity.state === "completed" && (
          <Check className="ml-auto h-3 w-3 text-emerald-600" />
        )}
        {activity.state === "in_progress" && (
          <Play className="ml-auto h-3 w-3 fill-current text-primary" />
        )}
      </div>
      <div className="mt-1 text-[10px] uppercase tracking-wide text-muted-foreground">
        {activity.kind} · #{activity.order} · {s.label}
      </div>
      {(flags.hasReward ||
        flags.hasChest ||
        flags.milestone ||
        flags.optional ||
        flags.hidden) && (
        <div className="mt-1.5 flex flex-wrap gap-1">
          {flags.hasReward && <Badge>reward</Badge>}
          {flags.hasChest && <Badge>chest</Badge>}
          {flags.milestone && <Badge>milestone</Badge>}
          {flags.optional && <Badge>optional</Badge>}
          {flags.hidden && (
            <Badge>
              <EyeOff className="mr-0.5 h-2.5 w-2.5" />
              hidden
            </Badge>
          )}
        </div>
      )}
    </div>
  );
}

function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-sm bg-background/70 px-1.5 py-0.5 text-[9px] font-medium uppercase tracking-wide text-muted-foreground ring-1 ring-inset ring-border">
      {children}
    </span>
  );
}