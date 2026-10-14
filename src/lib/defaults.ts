import type { LimitPair, WorkoutConfig } from "../types/workout";

export function emptyLimits(): LimitPair[] {
  return Array.from({ length: 12 }, () => [0, 0] as LimitPair);
}

export function createEmptyWorkout(name = "new exercise"): WorkoutConfig {
  return {
    name,
    left_angle: "angle_4",
    right_angle: "angle_3",
    bilateral_angle: "angle_3",
    stage_down_angle: 160,
    stage_up_angle: 30,
    limits: {
      starting: emptyLimits(),
      exercise: emptyLimits(),
      partial: emptyLimits(),
      full: emptyLimits(),
    },
  };
}

export function cloneWorkout(workout: WorkoutConfig, newName: string): WorkoutConfig {
  return {
    ...structuredClone(workout),
    name: newName,
  };
}
