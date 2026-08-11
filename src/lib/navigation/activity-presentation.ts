// Presentation-only metadata for activities (names, icon, exercise type).
// No pedagogical content — just labels so the trail stops looking generic.
import type { LucideIcon } from "lucide-react";
import {
  BookOpenText,
  Compass,
  Headphones,
  PenLine,
  Sparkles,
  Trophy,
} from "lucide-react";
import type { ActivityNode } from "./types";

export type ExerciseType =
  | "grammar"
  | "listening"
  | "reading"
  | "review"
  | "bonus"
  | "challenge";

export interface ExerciseTypeMeta {
  label: string;
  icon: LucideIcon;
}

export const EXERCISE_TYPE_META: Record<ExerciseType, ExerciseTypeMeta> = {
  grammar: { label: "Grammar", icon: PenLine },
  listening: { label: "Listening", icon: Headphones },
  reading: { label: "Reading", icon: BookOpenText },
  review: { label: "Review", icon: Compass },
  bonus: { label: "Bonus", icon: Sparkles },
  challenge: { label: "Challenge", icon: Trophy },
};

const NAMES: Record<ExerciseType, string[]> = {
  grammar: [
    "Building simple sentences",
    "Questions and negatives",
    "Talking about the past",
    "Plans and the future",
    "Comparing things",
    "Conditionals in context",
  ],
  listening: [
    "Catching the main idea",
    "Numbers and schedules",
    "Everyday accents",
    "Short dialogues",
    "Announcements and messages",
    "Fast speech patterns",
  ],
  reading: [
    "Reading short notes",
    "Understanding an article",
    "Reading between the lines",
    "Signs and instructions",
    "Emails and messages",
    "Opinion and tone",
  ],
  review: [
    "Checkpoint review",
    "Putting it together",
    "Mixed practice",
  ],
  bonus: ["Bonus practice", "Extra round", "Side quest"],
  challenge: ["Area challenge", "Final challenge", "Mastery test"],
};

export function getExerciseType(activity: ActivityNode): ExerciseType {
  switch (activity.kind) {
    case "boss":
      return "challenge";
    case "checkpoint":
      return "review";
    case "chest":
    case "reward":
    case "secret":
      return "bonus";
    default: {
      const cycle: ExerciseType[] = ["grammar", "listening", "reading"];
      return cycle[(activity.order - 1) % cycle.length];
    }
  }
}

export interface ActivityPresentation {
  type: ExerciseType;
  label: string;
  icon: LucideIcon;
  name: string;
  subtitle: string;
}

export function getActivityPresentation(
  activity: ActivityNode,
): ActivityPresentation {
  const type = getExerciseType(activity);
  const meta = EXERCISE_TYPE_META[type];
  const pool = NAMES[type];
  const areaSeed = Number(activity.studyAreaId.replace(/\D/g, "")) || 1;
  const name = pool[(activity.order + areaSeed - 2 + pool.length) % pool.length];
  return {
    type,
    label: meta.label,
    icon: meta.icon,
    name,
    subtitle: `${meta.label} · Step ${activity.order}`,
  };
}
