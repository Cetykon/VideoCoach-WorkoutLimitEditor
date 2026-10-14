import type { AngleKey } from "../types/workout";

export type JointId =
  | "head"
  | "neck"
  | "leftShoulder"
  | "rightShoulder"
  | "leftElbow"
  | "rightElbow"
  | "leftWrist"
  | "rightWrist"
  | "leftHip"
  | "rightHip"
  | "leftKnee"
  | "rightKnee"
  | "leftAnkle"
  | "rightAnkle";

export interface AngleMeta {
  key: AngleKey;
  label: string;
  /** Compact label for the skeleton overlay */
  shortLabel: string;
  /** Angle vertex (matches BodyAngles middle landmark) */
  vertex: JointId;
  /** Joints highlighted on the SVG skeleton */
  joints: JointId[];
  /** Place skeleton label on the left side of the joint */
  labelLeft?: boolean;
  /** Extra pixel offset so overlapping vertices stay readable */
  labelOffset?: { x?: number; y?: number };
}

/**
 * Label placement uses `vertex` (where the angle is measured).
 * Shoulder (1–2) and armpit (5–6) share the shoulder joint; armpit is
 * offset downward into the armpit/torso region so labels do not stack.
 */
export const ANGLE_META: AngleMeta[] = [
  {
    key: "angle_1",
    label: "Right shoulder",
    shortLabel: "R shoulder",
    vertex: "rightShoulder",
    joints: ["rightElbow", "rightShoulder", "leftShoulder"],
    labelOffset: { x: 12, y: -16 },
  },
  {
    key: "angle_2",
    label: "Left shoulder",
    shortLabel: "L shoulder",
    vertex: "leftShoulder",
    joints: ["leftElbow", "leftShoulder", "rightShoulder"],
    labelLeft: true,
    labelOffset: { x: -12, y: -16 },
  },
  {
    key: "angle_3",
    label: "Right elbow",
    shortLabel: "R elbow",
    vertex: "rightElbow",
    joints: ["rightShoulder", "rightElbow", "rightWrist"],
    labelOffset: { x: 12, y: 4 },
  },
  {
    key: "angle_4",
    label: "Left elbow",
    shortLabel: "L elbow",
    vertex: "leftElbow",
    joints: ["leftShoulder", "leftElbow", "leftWrist"],
    labelLeft: true,
    labelOffset: { x: -12, y: 4 },
  },
  {
    key: "angle_5",
    label: "Right armpit",
    shortLabel: "R armpit",
    vertex: "rightShoulder",
    joints: ["rightElbow", "rightShoulder", "rightHip"],
    labelOffset: { x: 14, y: 22 },
  },
  {
    key: "angle_6",
    label: "Left armpit",
    shortLabel: "L armpit",
    vertex: "leftShoulder",
    joints: ["leftElbow", "leftShoulder", "leftHip"],
    labelLeft: true,
    labelOffset: { x: -14, y: 22 },
  },
  {
    key: "angle_7",
    label: "Right above hip",
    shortLabel: "R above hip",
    vertex: "rightHip",
    joints: ["rightKnee", "rightHip", "rightShoulder"],
    labelOffset: { x: 12, y: -10 },
  },
  {
    key: "angle_8",
    label: "Left above hip",
    shortLabel: "L above hip",
    vertex: "leftHip",
    joints: ["leftKnee", "leftHip", "leftShoulder"],
    labelLeft: true,
    labelOffset: { x: -12, y: -10 },
  },
  {
    key: "angle_9",
    label: "Right below hip",
    shortLabel: "R below hip",
    vertex: "rightHip",
    joints: ["rightKnee", "rightHip", "leftHip"],
    labelOffset: { x: 12, y: 16 },
  },
  {
    key: "angle_10",
    label: "Left below hip",
    shortLabel: "L below hip",
    vertex: "leftHip",
    joints: ["leftKnee", "leftHip", "rightHip"],
    labelLeft: true,
    labelOffset: { x: -12, y: 16 },
  },
  {
    key: "angle_11",
    label: "Right knee",
    shortLabel: "R knee",
    vertex: "rightKnee",
    joints: ["rightHip", "rightKnee", "rightAnkle"],
    labelOffset: { x: 12, y: 4 },
  },
  {
    key: "angle_12",
    label: "Left knee",
    shortLabel: "L knee",
    vertex: "leftKnee",
    joints: ["leftHip", "leftKnee", "leftAnkle"],
    labelLeft: true,
    labelOffset: { x: -12, y: 4 },
  },
];

export const ANGLE_KEYS = ANGLE_META.map((m) => m.key);

export function angleLabel(key: AngleKey): string {
  return ANGLE_META.find((m) => m.key === key)?.label ?? key;
}

export const STAGE_LABELS: Record<string, string> = {
  starting: "Starting",
  exercise: "Exercise",
  partial: "Partial rep",
  full: "Full rep",
};
