import type { WorkoutConfig, WorkoutListItem } from "../types/workout";
import { nameToSlug } from "./slug";

export async function listWorkouts(): Promise<WorkoutListItem[]> {
  const res = await fetch("/api/workouts");
  if (!res.ok) throw new Error("Failed to list workouts");
  return res.json();
}

export async function loadWorkout(slug: string): Promise<WorkoutConfig> {
  const res = await fetch(`/api/workouts/${encodeURIComponent(slug)}`);
  if (!res.ok) throw new Error(`Failed to load ${slug}`);
  return res.json();
}

export async function saveWorkout(workout: WorkoutConfig): Promise<{ slug: string; path: string }> {
  const slug = nameToSlug(workout.name);
  const res = await fetch("/api/workouts", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ slug, workout }),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || "Save failed");
  }
  return res.json();
}

export function downloadWorkout(workout: WorkoutConfig): void {
  const slug = nameToSlug(workout.name);
  const blob = new Blob([JSON.stringify(workout, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${slug}.json`;
  a.click();
  URL.revokeObjectURL(url);
}
