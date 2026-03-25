// ── src/components/GameStateSyncer.jsx ───────────────────────────────────
// Previously bridged AuthContext → GameStateContext via SYNC_FROM_AUTH.
// Room state is now driven purely by SCENARIO_RESULT dispatches from
// useScenarioResult, so this component is intentionally a no-op.
// Kept as a placeholder in case future cross-context sync is needed.

export default function GameStateSyncer() {
  return null;
}
