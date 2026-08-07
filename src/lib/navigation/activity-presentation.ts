// Presentation-only metadata for activities (names, emoji, exercise type).
// No pedagogical content — just labels so the trail stops looking generic.
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
  emoji: string;
}

export const EXERCISE_TYPE_META: Record<ExerciseType, ExerciseTypeMeta> = {
  grammar: { label: "Grammar", emoji: "📘" },
  listening: { label: "Listening", emoji: "🎧" },
  reading: { label: "Reading", emoji: "📖" },
  review: { label: "Review", emoji: "🧭" },
  bonus: { label: "Bonus", emoji: "🎁" },
  challenge: { label: "Challenge", emoji: "🏆" },
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
  emoji: string;
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
    emoji: meta.emoji,
    name,
    subtitle: `${meta.label} · Step ${activity.order}`,
  };
}
