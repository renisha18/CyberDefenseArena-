// ── src/pages/ScenarioRouter.jsx ─────────────────────────────────────────
// Route: /scenario/next
// Only used when the player clicks "DAILY CHALLENGE" on the Dashboard.
// Fetches completed scenario IDs from the backend (DB is source of truth),
// picks the next random scenario via the engine, and redirects.
//
// The player never sees this page — it shows for ~16ms then redirects.

import { useEffect, useState } from "react";
import { useNavigate }         from "react-router-dom";
import { useAuth }             from "../context/AuthContext";
import { getNextScenario }     from "../services/scenarioEngine";
import api                     from "../services/api";

export default function ScenarioRouter() {
  const navigate      = useNavigate();
  const { user }      = useAuth();
  const [error, setError] = useState(null);

  useEffect(() => {
    async function pickScenario() {
      try {
        const { data } = await api.get("/user/completed-scenarios");
        const completedIds = data.completedIds ?? [];
        const streak       = user?.streak ?? 0;
        const scenario     = getNextScenario(completedIds, streak);

        if (!scenario) {
          // All scenarios done — go to training page
          navigate("/training", { replace: true });
          return;
        }

        navigate(scenario.route, { replace: true });
      } catch {
        setError(true);
        // Fallback: navigate to training if we can't fetch
        setTimeout(() => navigate("/training", { replace: true }), 2000);
      }
    }

    pickScenario();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div style={{
      width: "100vw", height: "100vh", background: "#0a0e1a",
      display: "flex", alignItems: "center", justifyContent: "center",
      flexDirection: "column", gap: "16px",
    }}>
      <span style={{
        fontFamily: "'Press Start 2P', monospace",
        fontSize: "8px", color: error ? "#ff2d55" : "#00f5ff",
        animation: "blink 0.5s infinite",
        textShadow: `0 0 8px ${error ? "#ff2d55" : "#00f5ff"}`,
      }}>
        {error ? "CONNECTION ERROR — REDIRECTING..." : "SELECTING SCENARIO..."}
      </span>
    </div>
  );
}
