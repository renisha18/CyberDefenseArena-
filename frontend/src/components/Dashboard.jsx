// ── src/pages/Dashboard.jsx ───────────────────────────────────────────────
// All values come from GameStateContext + AuthContext.
// No hardcoded streak, energy, or office data anywhere.

import { useNavigate }         from "react-router-dom";
import { useAuth }             from "../context/AuthContext";
import { useGameState }        from "../context/GameStateContext";
import { getProgress }         from "../services/scenarioEngine";
import Scanlines               from "../components/Scanlines";
import MatrixRain              from "../components/MatrixRain";
import PixelButton             from "../components/PixelButton";
import StatusPanel             from "../components/StatusPanel";
import StreakIndicator          from "../components/StreakIndicator";
import LeaderboardPreview      from "../components/LeaderboardPreview";
import OfficeMap               from "../components/OfficeMap";
import { SmallLogo }           from "../components/PixelIcons";
import "../styles/dashboard.css";

function roomHealthColor(h) {
  return h >= 75 ? "#39ff14" : h >= 45 ? "#ffd700" : "#ff2d55";
}

// Which module to launch when player clicks DEFEND on a room
const MODULE_ROUTES = {
  phishing: "/challenge/phishing/1",
  password: "/challenge/password/1",
  social:   "/challenge/social/1",
  malware:  "/challenge/malware/1",
  network:  "/challenge/phishing/1",
};

export default function Dashboard() {
  const navigate              = useNavigate();
  const { user, logout }      = useAuth();
  const { state, dispatch }   = useGameState();

  // All display values come from game state — zero hardcoding
  const { streak, health, xp, completedScenarioIds, officeRooms, sessionCorrect, sessionTotal } = state;
  const username   = user?.username ?? "";
  const progress   = getProgress(completedScenarioIds);
  const allDone    = progress.completed >= progress.total;

  async function handleLogout() {
    dispatch({ type: "RESET_SESSION" });
    await logout();
    navigate("/");
  }

  const NAV_BUTTONS = [
    {
      text:  allDone ? "🏆 ALL COMPLETE" : "⚡ NEXT CHALLENGE",
      color: allDone ? "#ffd700" : "#39ff14",
      route: "/scenario/next",
    },
    { text: "🏆 LEADERBOARD", color: "#ffd700", route: "/leaderboard" },
    { text: "📡 TRAINING",    color: "#00f5ff", route: "/training"    },
  ];

  return (
    <div className="dashboard">
      <MatrixRain opacity={0.04} />
      <Scanlines />

      {/* Top bar */}
      <div className="dashboard__topbar">
        <div className="dashboard__topbar-title">
          <SmallLogo />
          CYBERDEFENSE ARENA
          {username && (
            <span style={{
              fontFamily: "var(--pixel)", fontSize: "5px",
              color: "rgba(0,245,255,.5)", marginLeft: "10px",
            }}>
              // {username.toUpperCase()}
            </span>
          )}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          {/* Live progress pill */}
          <div style={{
            fontFamily: "var(--pixel)", fontSize: "5px", padding: "3px 8px",
            border: `1px solid ${allDone ? "#ffd700" : "#39ff14"}`,
            color:  allDone ? "#ffd700" : "#39ff14",
            boxShadow: `0 0 6px ${allDone ? "rgba(255,215,0,.3)" : "rgba(57,255,20,.3)"}`,
          }}>
            {progress.completed}/{progress.total} SCENARIOS
          </div>
          {/* Session score */}
          {sessionTotal > 0 && (
            <div style={{
              fontFamily: "var(--pixel)", fontSize: "5px", padding: "3px 8px",
              border: "1px solid rgba(0,245,255,.3)", color: "#00f5ff",
            }}>
              SESSION: {sessionCorrect}/{sessionTotal}
            </div>
          )}
          <div className="dashboard__topbar-live">NETWORK MONITOR — LIVE</div>
          <button onClick={handleLogout} style={{
            fontFamily: "var(--pixel)", fontSize: "5px", color: "#ff2d55",
            background: "transparent", border: "1px solid rgba(255,45,85,.3)",
            padding: "4px 8px", cursor: "pointer",
          }}
            onMouseEnter={e => e.target.style.borderColor = "#ff2d55"}
            onMouseLeave={e => e.target.style.borderColor = "rgba(255,45,85,.3)"}
          >
            LOGOUT
          </button>
        </div>
      </div>

      {/* Office map — reads from GameStateContext automatically */}
      <div className="dashboard__map-area">
        <OfficeMap onRoomClick={(room) => {
          navigate(MODULE_ROUTES[room.module] ?? "/scenario/next");
        }} />
      </div>

      {/* Overlays — all live values, no hardcoding */}
      <StreakIndicator streak={streak} />
      <LeaderboardPreview />
      <StatusPanel
        health={health}
        xp={xp}
        streak={streak}
        completedChallenges={progress.completed}
      />

      {/* Bottom nav */}
      <div className="dashboard__bottomnav">
        {NAV_BUTTONS.map((btn) => (
          <PixelButton key={btn.route} text={btn.text} type="primary"
            style={{ borderColor: btn.color, color: btn.color, boxShadow: `0 0 6px ${btn.color}44` }}
            onClick={() => navigate(btn.route)} />
        ))}
      </div>
    </div>
  );
}
