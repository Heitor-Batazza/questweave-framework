// Navigation structure types.
// Purely structural: no pedagogical content, no exercise text, no answers.
// Hierarchy: App -> StudyArea -> Trail (exactly one per area) -> Activity.

export type ActivityState =
  | "locked"
  | "available"
  | "unlocked"
  | "in_progress"
  | "completed";

export type ActivityKind =
  // Structural node kinds only — no pedagogical meaning attached here.
  | "standard"
  | "checkpoint"
  | "boss"
  | "reward"
  | "chest"
  | "secret";

/**
 * Requirement that must be satisfied for an activity to move from
 * `locked` to `available`. Kept purely structural: it references other
 * activity ids and/or numeric thresholds — never content.
 */
export type UnlockRequirement =
  | { type: "none" }
  | { type: "activity_completed"; activityId: string }
  | { type: "all_of"; requirements: UnlockRequirement[] }
  | { type: "any_of"; requirements: UnlockRequirement[] }
  | { type: "min_completed_in_trail"; trailId: string; count: number }
  | { type: "trail_completed"; trailId: string }
  | { type: "study_area_completed"; studyAreaId: string };

export interface ActivityFlags {
  /** Visually highlighted on the trail map (e.g. current focus). */
  highlight?: boolean;
  /** Grants a reward when completed. */
  hasReward?: boolean;
  /** Contains a chest to open. */
  hasChest?: boolean;
  /** Hidden from the map until discovered / unlocked. */
  hidden?: boolean;
  /** Optional / not required to complete the trail. */
  optional?: boolean;
  /** Milestone node (e.g. end of a section). */
  milestone?: boolean;
}

export interface ActivityNode {
  id: string;
  trailId: string;
  studyAreaId: string;
  /** Position within the trail (1-based). */
  order: number;
  kind: ActivityKind;
  state: ActivityState;
  flags: ActivityFlags;
  /** Requirements that gate this node. */
  unlock: UnlockRequirement;
  /** Ids of activities reachable from this node (branching supported). */
  nextActivityIds: string[];
}

export interface Trail {
  id: string;
  studyAreaId: string;
  order: number;
  /** Ordered list of activity node ids composing the trail. */
  activityIds: string[];
  /** Id of the trail's entry activity. */
  startActivityId: string;
  /** Id of the trail's terminal activity. */
  endActivityId: string;
}

export interface StudyArea {
  id: string;
  order: number;
  /** Exactly one trail per study area. */
  trailId: string;
  /** Unlock requirement for the study area itself. */
  unlock: UnlockRequirement;
}

export interface NavigationStructure {
  studyAreas: StudyArea[];
  trails: Trail[];
  activities: ActivityNode[];
}