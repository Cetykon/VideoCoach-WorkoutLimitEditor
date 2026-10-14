import { ANGLE_META } from "../lib/angles";
import type { AngleKey, LimitPair, LimitStage, WorkoutConfig } from "../types/workout";

type JointId =
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

type Point = { x: number; y: number };

const BASE: Record<JointId, Point> = {
  head: { x: 200, y: 48 },
  neck: { x: 200, y: 78 },
  leftShoulder: { x: 155, y: 95 },
  rightShoulder: { x: 245, y: 95 },
  leftElbow: { x: 130, y: 155 },
  rightElbow: { x: 270, y: 155 },
  leftWrist: { x: 115, y: 215 },
  rightWrist: { x: 285, y: 215 },
  leftHip: { x: 170, y: 210 },
  rightHip: { x: 230, y: 210 },
  leftKnee: { x: 165, y: 290 },
  rightKnee: { x: 235, y: 290 },
  leftAnkle: { x: 160, y: 370 },
  rightAnkle: { x: 240, y: 370 },
};

const BONES: [JointId, JointId][] = [
  ["head", "neck"],
  ["neck", "leftShoulder"],
  ["neck", "rightShoulder"],
  ["leftShoulder", "rightShoulder"],
  ["leftShoulder", "leftElbow"],
  ["leftElbow", "leftWrist"],
  ["rightShoulder", "rightElbow"],
  ["rightElbow", "rightWrist"],
  ["leftShoulder", "leftHip"],
  ["rightShoulder", "rightHip"],
  ["leftHip", "rightHip"],
  ["leftHip", "leftKnee"],
  ["leftKnee", "leftAnkle"],
  ["rightHip", "rightKnee"],
  ["rightKnee", "rightAnkle"],
];

function rotateAround(origin: Point, point: Point, degrees: number): Point {
  const rad = (degrees * Math.PI) / 180;
  const cos = Math.cos(rad);
  const sin = Math.sin(rad);
  const dx = point.x - origin.x;
  const dy = point.y - origin.y;
  return {
    x: origin.x + dx * cos - dy * sin,
    y: origin.y + dx * sin + dy * cos,
  };
}

/** Nudge limbs using midpoint of stretch/contract for the selected bilateral-ish angles. */
function poseFromLimits(
  workout: WorkoutConfig,
  stage: LimitStage,
  selectedAngle: AngleKey,
): Record<JointId, Point> {
  const joints = structuredClone(BASE);
  const pair = workout.limits[stage][Number(selectedAngle.split("_")[1]) - 1] as LimitPair;
  const enabled = !(pair[0] === 0 && pair[1] === 0);
  const mid = enabled ? (pair[0] + pair[1]) / 2 : 90;

  // Map a few common angles to visible pose changes
  if (selectedAngle === "angle_3" || selectedAngle === "angle_4") {
    // Elbow bend: smaller angle => more bent
    const bend = 180 - mid;
    if (selectedAngle === "angle_3") {
      joints.rightWrist = rotateAround(joints.rightElbow, joints.rightWrist, -bend * 0.6);
    } else {
      joints.leftWrist = rotateAround(joints.leftElbow, joints.leftWrist, bend * 0.6);
    }
  } else if (selectedAngle === "angle_5" || selectedAngle === "angle_6") {
    // Armpit: raise arm as angle grows (approx)
    const raise = mid - 30;
    if (selectedAngle === "angle_5") {
      joints.rightElbow = rotateAround(joints.rightShoulder, joints.rightElbow, -raise * 0.5);
      joints.rightWrist = rotateAround(joints.rightShoulder, joints.rightWrist, -raise * 0.5);
    } else {
      joints.leftElbow = rotateAround(joints.leftShoulder, joints.leftElbow, raise * 0.5);
      joints.leftWrist = rotateAround(joints.leftShoulder, joints.leftWrist, raise * 0.5);
    }
  } else if (selectedAngle === "angle_11" || selectedAngle === "angle_12") {
    const bend = 180 - mid;
    if (selectedAngle === "angle_11") {
      joints.rightAnkle = rotateAround(joints.rightKnee, joints.rightAnkle, bend * 0.35);
    } else {
      joints.leftAnkle = rotateAround(joints.leftKnee, joints.leftAnkle, -bend * 0.35);
    }
  }

  return joints;
}

interface SkeletonSvgProps {
  workout: WorkoutConfig;
  stage: LimitStage;
  selectedAngle: AngleKey;
  onSelectAngle: (key: AngleKey) => void;
}

export function SkeletonSvg({ workout, stage, selectedAngle, onSelectAngle }: SkeletonSvgProps) {
  const joints = poseFromLimits(workout, stage, selectedAngle);
  const highlighted = new Set(
    ANGLE_META.find((m) => m.key === selectedAngle)?.joints ?? [],
  );

  return (
    <svg className="skeleton" viewBox="0 0 400 420" role="img" aria-label="Body skeleton">
      {BONES.map(([a, b]) => {
        const active = highlighted.has(a) && highlighted.has(b);
        return (
          <line
            key={`${a}-${b}`}
            x1={joints[a].x}
            y1={joints[a].y}
            x2={joints[b].x}
            y2={joints[b].y}
            className={active ? "bone bone-active" : "bone"}
          />
        );
      })}
      {(Object.keys(joints) as JointId[]).map((id) => (
        <circle
          key={id}
          cx={joints[id].x}
          cy={joints[id].y}
          r={id === "head" ? 16 : 7}
          className={highlighted.has(id) ? "joint joint-active" : "joint"}
        />
      ))}
      {ANGLE_META.map((meta) => {
        const anchor = meta.joints[1] as JointId;
        const p = joints[anchor];
        return (
          <text
            key={meta.key}
            x={p.x + (meta.key.includes("left") || meta.key.endsWith("_2") || meta.key.endsWith("_4") || meta.key.endsWith("_6") || meta.key.endsWith("_8") || meta.key.endsWith("_10") || meta.key.endsWith("_12") ? -28 : 10)}
            y={p.y - 10}
            className={meta.key === selectedAngle ? "angle-label angle-label-active" : "angle-label"}
            onClick={() => onSelectAngle(meta.key)}
          >
            {meta.key.replace("angle_", "a")}
          </text>
        );
      })}
    </svg>
  );
}
