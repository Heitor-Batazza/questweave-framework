import type {
  ActivityNode,
  NavigationStructure,
  StudyArea,
  Trail,
} from "./types";

// -------- Study Area 1 (unlocked from the start) --------
const A1: ActivityNode[] = [
  {
    id: "a1-01",
    trailId: "t1",
    studyAreaId: "sa1",
    order: 1,
    kind: "standard",
    state: "available",
    flags: { highlight: true },
    unlock: { type: "none" },
    nextActivityIds: ["a1-02"],
  },
  {
    id: "a1-02",
    trailId: "t1",
    studyAreaId: "sa1",
    order: 2,
    kind: "standard",
    state: "locked",
    flags: {},
    unlock: { type: "activity_completed", activityId: "a1-01" },
    nextActivityIds: ["a1-03"],
  },
  {
    id: "a1-03",
    trailId: "t1",
    studyAreaId: "sa1",
    order: 3,
    kind: "chest",
    state: "locked",
    flags: { hasChest: true, optional: true },
    unlock: { type: "activity_completed", activityId: "a1-02" },
    nextActivityIds: ["a1-04"],
  },
  {
    id: "a1-04",
    trailId: "t1",
    studyAreaId: "sa1",
    order: 4,
    kind: "checkpoint",
    state: "locked",
    flags: { milestone: true },
    unlock: { type: "activity_completed", activityId: "a1-02" },
    nextActivityIds: ["a1-05"],
  },
  {
    id: "a1-05",
    trailId: "t1",
    studyAreaId: "sa1",
    order: 5,
    kind: "boss",
    state: "locked",
    flags: { hasReward: true, milestone: true },
    unlock: {
      type: "all_of",
      requirements: [
        { type: "activity_completed", activityId: "a1-04" },
        { type: "min_completed_in_trail", trailId: "t1", count: 3 },
      ],
    },
    nextActivityIds: [],
  },
];

// -------- Study Area 2 (unlocked by completing SA1) --------
const A2: ActivityNode[] = [
  {
    id: "a2-01",
    trailId: "t2",
    studyAreaId: "sa2",
    order: 1,
    kind: "standard",
    state: "locked",
    flags: {},
    unlock: { type: "study_area_completed", studyAreaId: "sa1" },
    nextActivityIds: ["a2-02a", "a2-02b"],
  },
  {
    id: "a2-02a",
    trailId: "t2",
    studyAreaId: "sa2",
    order: 2,
    kind: "standard",
    state: "locked",
    flags: {},
    unlock: { type: "activity_completed", activityId: "a2-01" },
    nextActivityIds: ["a2-03"],
  },
  {
    id: "a2-02b",
    trailId: "t2",
    studyAreaId: "sa2",
    order: 2,
    kind: "reward",
    state: "locked",
    flags: { hasReward: true, optional: true },
    unlock: { type: "activity_completed", activityId: "a2-01" },
    nextActivityIds: ["a2-03"],
  },
  {
    id: "a2-03",
    trailId: "t2",
    studyAreaId: "sa2",
    order: 3,
    kind: "checkpoint",
    state: "locked",
    flags: { milestone: true },
    unlock: {
      type: "any_of",
      requirements: [
        { type: "activity_completed", activityId: "a2-02a" },
        { type: "activity_completed", activityId: "a2-02b" },
      ],
    },
    nextActivityIds: ["a2-04", "a2-05"],
  },
  {
    id: "a2-04",
    trailId: "t2",
    studyAreaId: "sa2",
    order: 4,
    kind: "secret",
    state: "locked",
    flags: { hidden: true, optional: true, hasChest: true },
    unlock: { type: "activity_completed", activityId: "a2-03" },
    nextActivityIds: ["a2-06"],
  },
  {
    id: "a2-05",
    trailId: "t2",
    studyAreaId: "sa2",
    order: 5,
    kind: "standard",
    state: "locked",
    flags: {},
    unlock: { type: "activity_completed", activityId: "a2-03" },
    nextActivityIds: ["a2-06"],
  },
  {
    id: "a2-06",
    trailId: "t2",
    studyAreaId: "sa2",
    order: 6,
    kind: "boss",
    state: "locked",
    flags: { hasReward: true, milestone: true },
    unlock: { type: "activity_completed", activityId: "a2-05" },
    nextActivityIds: [],
  },
];

// -------- Study Area 3 (unlocked by completing SA2) --------
const A3: ActivityNode[] = [
  {
    id: "a3-01",
    trailId: "t3",
    studyAreaId: "sa3",
    order: 1,
    kind: "standard",
    state: "locked",
    flags: {},
    unlock: { type: "study_area_completed", studyAreaId: "sa2" },
    nextActivityIds: ["a3-02"],
  },
  {
    id: "a3-02",
    trailId: "t3",
    studyAreaId: "sa3",
    order: 2,
    kind: "standard",
    state: "locked",
    flags: {},
    unlock: { type: "activity_completed", activityId: "a3-01" },
    nextActivityIds: ["a3-03"],
  },
  {
    id: "a3-03",
    trailId: "t3",
    studyAreaId: "sa3",
    order: 3,
    kind: "chest",
    state: "locked",
    flags: { hasChest: true, optional: true },
    unlock: { type: "activity_completed", activityId: "a3-02" },
    nextActivityIds: ["a3-04"],
  },
  {
    id: "a3-04",
    trailId: "t3",
    studyAreaId: "sa3",
    order: 4,
    kind: "checkpoint",
    state: "locked",
    flags: { milestone: true },
    unlock: { type: "activity_completed", activityId: "a3-02" },
    nextActivityIds: ["a3-05"],
  },
  {
    id: "a3-05",
    trailId: "t3",
    studyAreaId: "sa3",
    order: 5,
    kind: "standard",
    state: "locked",
    flags: {},
    unlock: { type: "activity_completed", activityId: "a3-04" },
    nextActivityIds: ["a3-06"],
  },
  {
    id: "a3-06",
    trailId: "t3",
    studyAreaId: "sa3",
    order: 6,
    kind: "boss",
    state: "locked",
    flags: { hasReward: true, milestone: true },
    unlock: {
      type: "all_of",
      requirements: [
        { type: "activity_completed", activityId: "a3-05" },
        { type: "min_completed_in_trail", trailId: "t3", count: 4 },
      ],
    },
    nextActivityIds: [],
  },
];

const trails: Trail[] = [
  {
    id: "t1",
    studyAreaId: "sa1",
    order: 1,
    activityIds: A1.map((a) => a.id),
    startActivityId: "a1-01",
    endActivityId: "a1-05",
  },
  {
    id: "t2",
    studyAreaId: "sa2",
    order: 1,
    activityIds: A2.map((a) => a.id),
    startActivityId: "a2-01",
    endActivityId: "a2-06",
  },
  {
    id: "t3",
    studyAreaId: "sa3",
    order: 1,
    activityIds: A3.map((a) => a.id),
    startActivityId: "a3-01",
    endActivityId: "a3-06",
  },
];

const studyAreas: StudyArea[] = [
  { id: "sa1", order: 1, trailId: "t1", unlock: { type: "none" } },
  {
    id: "sa2",
    order: 2,
    trailId: "t2",
    unlock: { type: "study_area_completed", studyAreaId: "sa1" },
  },
  {
    id: "sa3",
    order: 3,
    trailId: "t3",
    unlock: { type: "study_area_completed", studyAreaId: "sa2" },
  },
];

export const navigationStructure: NavigationStructure = {
  studyAreas,
  trails,
  activities: [...A1, ...A2, ...A3],
};

// -------- Lookup helpers (structural only) --------

export function getStudyArea(id: string): StudyArea | undefined {
  return navigationStructure.studyAreas.find((s) => s.id === id);
}

export function getTrail(id: string): Trail | undefined {
  return navigationStructure.trails.find((t) => t.id === id);
}

export function getActivity(id: string): ActivityNode | undefined {
  return navigationStructure.activities.find((a) => a.id === id);
}

export function getTrailActivities(trailId: string): ActivityNode[] {
  return navigationStructure.activities
    .filter((a) => a.trailId === trailId)
    .sort((a, b) => a.order - b.order);
}

export function getNextActivities(activityId: string): ActivityNode[] {
  const node = getActivity(activityId);
  if (!node) return [];
  return node.nextActivityIds
    .map((id) => getActivity(id))
    .filter((a): a is ActivityNode => Boolean(a));
}