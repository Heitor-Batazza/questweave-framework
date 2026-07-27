// Presentation-only metadata for the navigation structure.
// Provisional English-learning names/descriptions — no pedagogical content.
import { navigationStructure, getTrailActivities } from "./structure";

export interface AreaPresentation {
  id: string;
  name: string;
  description: string;
  /** 1-7, maps to the --color-area-N token. */
  accent: number;
  /** Placeholder progress (0-100). */
  progress: number;
  emoji: string;
}

const AREA_META: Omit<AreaPresentation, "id">[] = [
  {
    name: "Greetings & Basics",
    description: "Placeholder description for the first steps of the journey.",
    accent: 1,
    progress: 42,
    emoji: "👋",
  },
  {
    name: "Daily Conversations",
    description: "Placeholder description for everyday exchanges.",
    accent: 2,
    progress: 12,
    emoji: "💬",
  },
  {
    name: "Core Vocabulary",
    description: "Placeholder description for word-building blocks.",
    accent: 3,
    progress: 0,
    emoji: "🧩",
  },
  {
    name: "Grammar Foundations",
    description: "Placeholder description for structural patterns.",
    accent: 4,
    progress: 0,
    emoji: "🏗️",
  },
  {
    name: "Listening Practice",
    description: "Placeholder description for the listening track.",
    accent: 5,
    progress: 0,
    emoji: "🎧",
  },
  {
    name: "Travel English",
    description: "Placeholder description for the travel track.",
    accent: 6,
    progress: 0,
    emoji: "🧳",
  },
  {
    name: "Business English",
    description: "Placeholder description for the professional track.",
    accent: 7,
    progress: 0,
    emoji: "💼",
  },
];

export const AREA_ACCENT_CLASS: Record<number, string> = {
  1: "text-area-1",
  2: "text-area-2",
  3: "text-area-3",
  4: "text-area-4",
  5: "text-area-5",
  6: "text-area-6",
  7: "text-area-7",
};

export const AREA_ACCENT_VAR: Record<number, string> = {
  1: "var(--area-1)",
  2: "var(--area-2)",
  3: "var(--area-3)",
  4: "var(--area-4)",
  5: "var(--area-5)",
  6: "var(--area-6)",
  7: "var(--area-7)",
};

export function getAreaPresentation(areaId: string): AreaPresentation {
  const index = navigationStructure.studyAreas.findIndex((a) => a.id === areaId);
  const meta = AREA_META[index] ?? AREA_META[AREA_META.length - 1];
  return { id: areaId, ...meta };
}

/** Structural unlock state of a study area, derived from the structure only. */
export function isAreaUnlocked(areaId: string): boolean {
  const area = navigationStructure.studyAreas.find((a) => a.id === areaId);
  if (!area) return false;
  if (area.unlock.type === "none") return true;
  return getTrailActivities(area.trailId).some((a) => a.state !== "locked");
}

export function getAreaActivityCount(areaId: string): number {
  const area = navigationStructure.studyAreas.find((a) => a.id === areaId);
  return area ? getTrailActivities(area.trailId).length : 0;
}