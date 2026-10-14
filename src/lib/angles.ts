import type { AngleKey } from "../types/workout";

export interface AngleMeta {
  key: AngleKey;
  label: string;
  /** Joints highlighted on the SVG skeleton */
  joints: string[];
}

export const ANGLE_META: AngleMeta[] = [
  { key: "angle_1", label: "Right shoulder", joints: ["rightShoulder", "rightElbow", "leftShoulder"] },
  { key: "angle_2", label: "Left shoulder", joints: ["leftShoulder", "leftElbow", "rightShoulder"] },
  { key: "angle_3", label: "Right elbow", joints: ["rightShoulder", "rightElbow", "rightWrist"] },
  { key: "angle_4", label: "Left elbow", joints: ["leftShoulder", "leftElbow", "leftWrist"] },
  { key: "angle_5", label: "Right armpit", joints: ["rightElbow", "rightShoulder", "rightHip"] },
  { key: "angle_6", label: "Left armpit", joints: ["leftElbow", "leftShoulder", "leftHip"] },
  { key: "angle_7", label: "Right above hip", joints: ["rightKnee", "rightHip", "rightShoulder"] },
  { key: "angle_8", label: "Left above hip", joints: ["leftKnee", "leftHip", "leftShoulder"] },
  { key: "angle_9", label: "Right below hip", joints: ["rightKnee", "rightHip", "leftHip"] },
  { key: "angle_10", label: "Left below hip", joints: ["leftKnee", "leftHip", "rightHip"] },
  { key: "angle_11", label: "Right knee", joints: ["rightHip", "rightKnee", "rightAnkle"] },
  { key: "angle_12", label: "Left knee", joints: ["leftHip", "leftKnee", "leftAnkle"] },
];

export const ANGLE_KEYS = ANGLE_META.map((m) => m.key);

export const STAGE_LABELS: Record<string, string> = {
  starting: "Starting",
  exercise: "Exercise",
  partial: "Partial rep",
  full: "Full rep",
};
