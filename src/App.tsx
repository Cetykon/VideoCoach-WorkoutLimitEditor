import { useCallback, useEffect, useState } from "react";
import { LimitEditor } from "./components/LimitEditor";
import { SkeletonSvg } from "./components/SkeletonSvg";
import { ANGLE_META, STAGE_LABELS } from "./lib/angles";
import { downloadWorkout, listWorkouts, loadWorkout, saveWorkout } from "./lib/api";
import { cloneWorkout, createEmptyWorkout } from "./lib/defaults";
import type { AngleKey, LimitPair, LimitStage, WorkoutConfig, WorkoutListItem } from "./types/workout";
import "./App.css";

const STAGES: LimitStage[] = ["starting", "exercise", "partial", "full"];

type TrackingRole = "left_angle" | "right_angle" | "bilateral_angle";

const TRACKING_ROLES: { key: TrackingRole; label: string }[] = [
  { key: "left_angle", label: "Left" },
  { key: "right_angle", label: "Right" },
  { key: "bilateral_angle", label: "Bilateral" },
];

function App() {
  const [workout, setWorkout] = useState<WorkoutConfig>(() => createEmptyWorkout());
  const [stage, setStage] = useState<LimitStage>("starting");
  const [trackingRole, setTrackingRole] = useState<TrackingRole>("bilateral_angle");
  const [selectedAngle, setSelectedAngle] = useState<AngleKey>("angle_3");
  const [catalog, setCatalog] = useState<WorkoutListItem[]>([]);
  const [status, setStatus] = useState<string>("");
  const [busy, setBusy] = useState(false);

  const refreshCatalog = useCallback(async () => {
    try {
      const items = await listWorkouts();
      setCatalog(items);
    } catch {
      setStatus("Could not list configs (is npm run dev running?)");
    }
  }, []);

  useEffect(() => {
    void refreshCatalog();
  }, [refreshCatalog]);

  const updateField = <K extends keyof WorkoutConfig>(key: K, value: WorkoutConfig[K]) => {
    setWorkout((w) => ({ ...w, [key]: value }));
  };

  const onChangePair = (angleIndex: number, pair: LimitPair) => {
    setWorkout((w) => {
      const next = structuredClone(w);
      next.limits[stage][angleIndex] = pair;
      return next;
    });
  };

  const assignTrackingAngle = (key: AngleKey) => {
    updateField(trackingRole, key);
    setSelectedAngle(key);
  };

  const handleSelectAngle = (key: AngleKey) => {
    setSelectedAngle(key);
    // Skeleton / list clicks also assign the active Left/Right/Bilateral role
    updateField(trackingRole, key);
  };

  const handleNew = () => {
    setWorkout(createEmptyWorkout());
    setStage("starting");
    setTrackingRole("bilateral_angle");
    setSelectedAngle("angle_3");
    setStatus("New exercise draft");
  };

  const handleDuplicate = () => {
    const name = `${workout.name} copy`;
    setWorkout(cloneWorkout(workout, name));
    setStatus(`Duplicated as "${name}"`);
  };

  const handleLoad = async (slug: string) => {
    if (!slug) return;
    setBusy(true);
    try {
      const loaded = await loadWorkout(slug);
      setWorkout(loaded);
      setTrackingRole("bilateral_angle");
      setSelectedAngle(loaded.bilateral_angle);
      setStatus(`Loaded ${loaded.name}`);
    } catch (err) {
      setStatus(err instanceof Error ? err.message : "Load failed");
    } finally {
      setBusy(false);
    }
  };

  const handleSave = async () => {
    setBusy(true);
    try {
      const result = await saveWorkout(workout);
      setStatus(`Saved ${result.slug}.json`);
      await refreshCatalog();
    } catch (err) {
      setStatus(err instanceof Error ? err.message : "Save failed");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="app">
      <header className="topbar">
        <div>
          <h1>Workout Limit Editor</h1>
          <p className="subtitle">Tune angle limits on a skeleton, save JSON for CapStone.</p>
        </div>
        <div className="actions">
          <button type="button" onClick={handleNew} disabled={busy}>
            New
          </button>
          <button type="button" onClick={handleDuplicate} disabled={busy}>
            Duplicate
          </button>
          <button type="button" onClick={() => downloadWorkout(workout)} disabled={busy}>
            Download
          </button>
          <button type="button" className="primary" onClick={() => void handleSave()} disabled={busy}>
            Save
          </button>
        </div>
      </header>

      {status && <div className="status">{status}</div>}

      <main className="layout">
        <section className="panel skeleton-panel">
          <SkeletonSvg
            workout={workout}
            stage={stage}
            selectedAngle={selectedAngle}
            onSelectAngle={handleSelectAngle}
          />
          <p className="hint">
            Click a skeleton label to assign it to the active tracking tab ({TRACKING_ROLES.find((r) => r.key === trackingRole)?.label}).
          </p>
        </section>

        <section className="panel form-panel">
          <div className="field-grid">
            <label>
              Load existing
              <select
                defaultValue=""
                onChange={(e) => {
                  void handleLoad(e.target.value);
                  e.target.value = "";
                }}
                disabled={busy}
              >
                <option value="">Select…</option>
                {catalog.map((item) => (
                  <option key={item.slug} value={item.slug}>
                    {item.name} ({item.slug})
                  </option>
                ))}
              </select>
            </label>

            <label>
              Exercise name
              <input
                type="text"
                value={workout.name}
                onChange={(e) => updateField("name", e.target.value)}
              />
            </label>

            <label>
              Stage down {workout.stage_down_angle}°
              <input
                type="range"
                min={0}
                max={185}
                value={workout.stage_down_angle}
                onChange={(e) => updateField("stage_down_angle", Number(e.target.value))}
              />
            </label>

            <label>
              Stage up {workout.stage_up_angle}°
              <input
                type="range"
                min={0}
                max={185}
                value={workout.stage_up_angle}
                onChange={(e) => updateField("stage_up_angle", Number(e.target.value))}
              />
            </label>
          </div>

          <h2 className="section-title">Rep tracking angles</h2>
          <div className="stage-tabs">
            {TRACKING_ROLES.map((role) => (
              <button
                key={role.key}
                type="button"
                className={role.key === trackingRole ? "tab active" : "tab"}
                onClick={() => {
                  setTrackingRole(role.key);
                  setSelectedAngle(workout[role.key]);
                }}
              >
                {role.label}
              </button>
            ))}
          </div>
          <p className="cluster-summary">
            {TRACKING_ROLES.find((r) => r.key === trackingRole)?.label}:{" "}
            {ANGLE_META.find((m) => m.key === workout[trackingRole])?.label ?? workout[trackingRole]}
          </p>
          <div className="tracking-pick-list">
            {ANGLE_META.map((meta) => {
              const assigned = workout[trackingRole] === meta.key;
              return (
                <button
                  key={meta.key}
                  type="button"
                  className={assigned ? "pick-row selected" : "pick-row"}
                  onClick={() => assignTrackingAngle(meta.key)}
                >
                  {meta.label}
                </button>
              );
            })}
          </div>

          <h2 className="section-title">Position limits</h2>
          <div className="stage-tabs">
            {STAGES.map((s) => (
              <button
                key={s}
                type="button"
                className={s === stage ? "tab active" : "tab"}
                onClick={() => setStage(s)}
              >
                {STAGE_LABELS[s]}
              </button>
            ))}
          </div>

          <LimitEditor
            workout={workout}
            stage={stage}
            selectedAngle={selectedAngle}
            onSelectAngle={setSelectedAngle}
            onChangePair={onChangePair}
          />
        </section>
      </main>
    </div>
  );
}

export default App;
