// ── src/pages/ScenarioRouter.jsx ─────────────────────────────────────────
// Route: /scenario/next
// Only used when the player clicks "DAILY CHALLENGE" on the Dashboard.
// Reads completed scenario IDs from localStorage, picks the next random
// scenario via the engine, and immediately redirects to the module page.
//
// The player never sees this page — it shows for ~16ms then redirects.
// Training page uses /challenge/phishing/1 etc directly — not this page.

import { useEffect }         from "react";
import { useNavigate }       from "react-router-dom";
import { useAuth }           from "../context/AuthContext";
import { getNextScenario }   from "../services/scenarioEngine";

const STORAGE_KEY = "cda_completed_ids";

export function loadCompletedIds() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

export function markScenarioComplete(id) {
  try {
    const ids = loadCompletedIds();
    if (!ids.includes(id)) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify([...ids, id]));
    }
  } catch { /* ignore */ }
}

export default function ScenarioRouter() {
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    const completedIds = loadCompletedIds();
    const streak       = user?.streak ?? 0;
    const scenario     = getNextScenario(completedIds, streak);

    if (!scenario) {
      // All 20 done — go to training page
      navigate("/training", { replace: true });
      return;
    }

    navigate(scenario.route, { replace: true });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div style={{
      width: "100vw", height: "100vh", background: "#0a0e1a",
      display: "flex", alignItems: "center", justifyContent: "center",
    }}>
      <span style={{
        fontFamily: "'Press Start 2P', monospace",
        fontSize: "8px", color: "#00f5ff",
        animation: "blink 0.5s infinite",
        textShadow: "0 0 8px #00f5ff",
      }}>
        SELECTING SCENARIO...
      </span>
    </div>
  );
}
