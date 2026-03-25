// ── src/hooks/useModuleSubmit.js ──────────────────────────────────────────
// Shared submission hook used by all 4 module pages.
// Submits every level (1–5) to /api/challenges/submit.
// Handles: DB update, office map, crisis dispatch, chain attack info.

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth }      from "../context/AuthContext";
import { useGameState } from "../context/GameStateContext";
import api              from "../services/api";

/**
 * @param {string} module        - "phishing"|"password"|"social"|"malware"
 * @param {number} dbChallengeId - challenge id in DB
 */
export function useModuleSubmit(module, dbChallengeId) {
  const navigate                   = useNavigate();
  const { updateStats }            = useAuth();
  const { dispatch: gameDispatch } = useGameState();

  const [submitting,  setSubmitting]  = useState(false);
  const [wrongStreak, setWrongStreak] = useState(0);

  /**
   * Submit a scenario answer to the backend.
   * @param {boolean} isCorrect
   * @param {number}  uiLevel     - 1–5
   * @param {object}  levelData   - local level config (for fallback values)
   * @returns {object}  result object for the UI
   */
  async function submit(isCorrect, uiLevel, levelData) {
    setSubmitting(true);
    try {
      const { data } = await api.post("/challenges/submit", {
        challengeId: dbChallengeId,
        uiLevel,
        correct:     isCorrect,
        wrongStreak,
      });

      if (!isCorrect) setWrongStreak((w) => w + 1);
      else            setWrongStreak(0);

      if (data.updatedPlayer) updateStats(data.updatedPlayer);

      gameDispatch({ type: "SCENARIO_RESULT", payload: { module, correct: isCorrect } });

      if (data.crisis) {
        gameDispatch({ type: "CRISIS", payload: data.crisis });
      }

      return {
        correct:          isCorrect,
        healthChange:     data.healthChange,
        xpGained:         data.xpGained,
        streakMultiplier: data.streakMultiplier,
        chainAttack:      data.chainAttack ?? null,
        crisis:           data.crisis      ?? null,
      };
    } catch {
      // Network fallback — show local values so player isn't blocked
      return {
        correct:      isCorrect,
        healthChange: isCorrect ? levelData.healthReward : -levelData.healthPenalty,
        xpGained:     isCorrect ? levelData.xpReward : 0,
        chainAttack:  null,
        crisis:       null,
        offline:      true,
      };
    } finally {
      setSubmitting(false);
    }
  }

  function resetWrongStreak() { setWrongStreak(0); }

  return { submit, submitting, wrongStreak, resetWrongStreak };
}
