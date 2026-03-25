// ── src/hooks/useScenarioResult.js ───────────────────────────────────────
// Used by ALL 4 module pages after a scenario answer.
// One import handles both:
//   1. Updating the office map (GameStateContext)
//   2. Updating the stats panel (AuthContext)
//
// Usage in any module page:
//   const reportResult = useScenarioResult();
//   // after backend responds:
//   reportResult({
//     module:      "phishing",
//     correct:     true,
//     healthScore: data.updatedPlayer.healthScore,
//     xp:          data.updatedPlayer.xp,
//     streak:      data.updatedPlayer.streak,
//   });

import { useGameState } from "../context/GameStateContext";
import { useAuth }      from "../context/AuthContext";

export function useScenarioResult() {
  const { dispatch }    = useGameState();
  const { updateStats } = useAuth();

  return function reportResult({ module, correct, healthScore, xp, streak }) {
    // Update office map rooms immediately (local — instant visual feedback)
    dispatch({ type: "SCENARIO_RESULT", payload: { module, correct } });

    // Update stats panel (if backend values provided)
    if (healthScore !== undefined && xp !== undefined && streak !== undefined) {
      updateStats({ healthScore, xp, streak });
    }
  };
}
