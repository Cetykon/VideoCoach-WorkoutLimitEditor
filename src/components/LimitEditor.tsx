import { ANGLE_META } from "../lib/angles";
import type { AngleKey, LimitPair, LimitStage, WorkoutConfig } from "../types/workout";

interface LimitEditorProps {
  workout: WorkoutConfig;
  stage: LimitStage;
  selectedAngle: AngleKey;
  onSelectAngle: (key: AngleKey) => void;
  onChangePair: (angleIndex: number, pair: LimitPair) => void;
}

export function LimitEditor({
  workout,
  stage,
  selectedAngle,
  onSelectAngle,
  onChangePair,
}: LimitEditorProps) {
  const pairs = workout.limits[stage];

  return (
    <div className="limit-list">
      {ANGLE_META.map((meta, index) => {
        const [stretch, contract] = pairs[index];
        const enabled = !(stretch === 0 && contract === 0);
        const selected = meta.key === selectedAngle;

        return (
          <div
            key={meta.key}
            className={selected ? "limit-row selected" : "limit-row"}
            onClick={() => onSelectAngle(meta.key)}
          >
            <div className="limit-row-header">
              <label className="enable">
                <input
                  type="checkbox"
                  checked={enabled}
                  onChange={(e) => {
                    e.stopPropagation();
                    if (e.target.checked) {
                      onChangePair(index, [180, 90]);
                    } else {
                      onChangePair(index, [0, 0]);
                    }
                  }}
                  onClick={(e) => e.stopPropagation()}
                />
                <span>
                  {meta.key} — {meta.label}
                </span>
              </label>
            </div>
            {enabled && (
              <div className="sliders" onClick={(e) => e.stopPropagation()}>
                <label>
                  Stretch {stretch}°
                  <input
                    type="range"
                    min={0}
                    max={185}
                    value={stretch}
                    onChange={(e) =>
                      onChangePair(index, [Number(e.target.value), contract])
                    }
                  />
                </label>
                <label>
                  Contract {contract}°
                  <input
                    type="range"
                    min={0}
                    max={185}
                    value={contract}
                    onChange={(e) =>
                      onChangePair(index, [stretch, Number(e.target.value)])
                    }
                  />
                </label>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
