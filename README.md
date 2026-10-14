# Workout Limit Editor

React + Vite tool for visually tuning CapStone exercise angle limits on an SVG skeleton and saving them as JSON configs.

## Requirements

- Node.js 20+
- CapStone repo layout: this project lives at `tools/workout-limit-editor` so the save API can write to `backend/exercises/workout_configs/`.

## Setup

```bash
cd tools/workout-limit-editor
npm install
npm run dev
```

Open the printed local URL (usually `http://localhost:5173`).

## Usage

1. **New** / **Load existing** / **Duplicate** an exercise.
2. Set name, left/right/bilateral angle keys (`angle_1`…`angle_12`).
3. Adjust **stage down** / **stage up** for rep counting.
4. Pick a limit stage tab: Starting, Exercise, Partial rep, Full rep.
5. Enable angles and drag stretch/contract sliders (0–185). Unchecked = `[0, 0]` (ignored by CapStone).
6. **Save** writes `backend/exercises/workout_configs/<slug>.json`.
7. **Download** exports the same JSON if the save API is unavailable.

## Config schema

```json
{
  "name": "pull up",
  "left_angle": "angle_6",
  "right_angle": "angle_5",
  "bilateral_angle": "angle_5",
  "stage_down_angle": 160,
  "stage_up_angle": 45,
  "limits": {
    "starting": [[0, 0], "...12 pairs"],
    "exercise": [],
    "partial": [],
    "full": []
  }
}
```

Each limits array has 12 `[stretch, contract]` pairs matching CapStone `BodyAngles` / `PositionLimits`.
