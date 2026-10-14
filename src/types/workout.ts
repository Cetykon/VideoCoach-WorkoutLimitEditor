export type AngleKey =
  | "angle_1"
  | "angle_2"
  | "angle_3"
  | "angle_4"
  | "angle_5"
  | "angle_6"
  | "angle_7"
  | "angle_8"
  | "angle_9"
  | "angle_10"
  | "angle_11"
  | "angle_12";

export type LimitPair = [number, number]; // [stretch, contract]

export type LimitStage = "starting" | "exercise" | "partial" | "full";

export interface WorkoutLimits {
  starting: LimitPair[];
  exercise: LimitPair[];
  partial: LimitPair[];
  full: LimitPair[];
}

export interface WorkoutConfig {
  name: string;
  left_angle: AngleKey;
  right_angle: AngleKey;
  bilateral_angle: AngleKey;
  stage_down_angle: number;
  stage_up_angle: number;
  limits: WorkoutLimits;
}

export interface WorkoutListItem {
  slug: string;
  name: string;
}
