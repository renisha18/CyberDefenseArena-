// ── src/pages/Dashboard.jsx ───────────────────────────────────────────────
// All player stats (HP, XP, streak) come from AuthContext — real DB values.
// Office map room health comes from GameStateContext — reactive to play.
// On mount: syncs player's real HP into GameStateContext so rooms start right.

import { useState, useEffect }  from "react";
import { useNavigate }           from "react-router-dom";
import { useAuth }               from "../context/AuthContext";
import { useGameState }          from "../context/GameStateContext";
import api                       from "../services/api";
import Scanlines                 from "../components/Scanlines";
import MatrixRain                from "../components/MatrixRain";
import PixelButton               from "../components/PixelButton";
import StatusPanel               from "../components/StatusPanel";
import StreakIndicator            from "../components/StreakIndicator";
import LeaderboardPreview        from "../components/LeaderboardPreview";
import OfficeMap                 from "../components/OfficeMap";
import { SmallLogo }             from "../components/PixelIcons";
import "../styles/dashboard.css";

function roomHealthColor(h) {
  return h >= 75 ? "#39ff14" : h >= 45 ? "#ffd700" : "#ff2d55";
}

// Room click launches that module in training order
const MODULE_ROUTES = {
  phishing: "/challenge/phishing/1",
  password: "/challenge/password/1",
  social:   "/challenge/social/1",
  malware:  "/challenge/malware/1",
};

export default function Dashboard() {
  const navigate            = useNavigate();
  const { user, logout }    = useAuth();
  const { dispatch }        = useGameState();

  const [selectedRoom,   setSelectedRoom]   = useState(null);
  const [modulesToday,   setModulesToday]   = useState(0);
  const [checkingStatus, setCheckingStatus] = useState(true);

  // Real values from DB via AuthContext
  const hp        = user?.healthScore        ?? 50;
  const xp        = user?.xp                 ?? 0;
  const streak    = user?.streak             ?? 0;
  const username  = user?.username           ?? "";
  const completed = user?.completedChallenges ?? 0;

  // Fetch how many modules completed today for the status pill (0–4)
  useEffect(() => {
    api.get("/user/dashboard")
      .then(({ data }) => setModulesToday(data.modulesCompletedToday ?? 0))
      .catch(() => {})
      .finally(() => setCheckingStatus(false));
  }, []);

  async function handleLogout() {
    dispatch({ type: "RESET" });
    await logout();
    navigate("/");
  }

  const allDoneToday = modulesToday >= 4;

  const NAV_BUTTONS = [
    {
      text:     allDoneToday ? "✓ ALL 4 DONE TODAY" : "⚡ DAILY CHALLENGE",
      color:    allDoneToday ? "#39ff14" : "#ffd700",
      route:    "/scenario/next",   // random engine picks scenario
      disabled: allDoneToday,
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

          {/* Today's module progress pill — e.g. "2/4 MODULES TODAY" */}
          {!checkingStatus && (
            <div style={{
              fontFamily: "var(--pixel)", fontSize: "5px", padding: "3px 8px",
              border:    `1px solid ${allDoneToday ? "#39ff14" : "#ffd700"}`,
              color:      allDoneToday ? "#39ff14" : "#ffd700",
              boxShadow: `0 0 6px ${allDoneToday ? "rgba(57,255,20,.3)" : "rgba(255,215,0,.3)"}`,
              animation:  allDoneToday ? "none" : "blink 2s infinite",
            }}>
              {allDoneToday ? "✓ ALL DONE" : `${modulesToday}/4 MODULES TODAY`}
            </div>
          )}

          <div className="dashboard__topbar-live">NETWORK MONITOR — LIVE</div>
          <button onClick={handleLogout} style={{
            fontFamily: "var(--pixel)", fontSize: "5px", color: "#ff2d55",
            background: "transparent", border: "1px solid rgba(255,45,85,.3)",
            padding: "4px 8px", cursor: "pointer", transition: "all .15s",
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
        <OfficeMap onRoomClick={setSelectedRoom} />
      </div>

      {/* Overlays — all real values, zero hardcoding */}
      <StreakIndicator streak={streak} />
      <LeaderboardPreview />
      <StatusPanel
        health={hp}
        xp={xp}
        streak={streak}
        completedChallenges={completed}
      />

      {/* Room popup */}
      {selectedRoom && (
        <div className="dashboard__room-popup" style={{
          border:    `3px solid ${roomHealthColor(selectedRoom.health)}`,
          boxShadow: `0 0 40px ${roomHealthColor(selectedRoom.health)}55`,
        }}>
          <div className="dashboard__room-popup-title">{selectedRoom.label}</div>
          <div style={{
            fontFamily: "var(--pixel)", fontSize: "4px", marginBottom: "8px",
            color: "#00f5ff", border: "1px solid rgba(0,245,255,.25)",
            padding: "2px 6px", display: "inline-block", letterSpacing: "1px",
          }}>
            {selectedRoom.module?.toUpperCase()} MODULE
          </div>
          <div style={{
            fontFamily: "var(--pixel)", fontSize: "5px",
            color: "rgba(0,245,255,.5)", marginBottom: "6px",
          }}>
            SYSTEM HEALTH
          </div>
          <div className="dashboard__room-popup-healthbar">
            <div style={{
              width:      `${selectedRoom.health}%`,
              height:     "100%",
              background: roomHealthColor(selectedRoom.health),
              boxShadow:  `0 0 8px ${roomHealthColor(selectedRoom.health)}`,
              transition: "width .5s",
            }} />
          </div>
          <div style={{
            fontFamily: "var(--pixel)", fontSize: "6px", marginBottom: "14px",
            color: selectedRoom.threats > 0 ? "#ff2d55" : "#39ff14",
          }}>
            {selectedRoom.threats > 0
              ? `⚠ ${selectedRoom.threats} ACTIVE THREAT${selectedRoom.threats > 1 ? "S" : ""}`
              : "✓ ALL CLEAR"}
          </div>
          <div className="dashboard__room-popup-actions">
            <PixelButton text="▶ DEFEND" type="primary"
              onClick={() => {
                setSelectedRoom(null);
                navigate(MODULE_ROUTES[selectedRoom.module] ?? "/challenge/phishing/1");
              }}
              style={{ flex: 1 }}
            />
            <PixelButton text="✕" type="secondary"
              onClick={() => setSelectedRoom(null)} />
          </div>
        </div>
      )}

      {/* Bottom nav */}
      <div className="dashboard__bottomnav">
        {NAV_BUTTONS.map((btn) => (
          <PixelButton key={btn.route} text={btn.text} type="primary"
            style={{
              borderColor: btn.color,
              color:       btn.color,
              boxShadow:  `0 0 6px ${btn.color}44`,
              opacity:     btn.disabled ? 0.5 : 1,
              cursor:      btn.disabled ? "not-allowed" : "pointer",
            }}
            onClick={() => !btn.disabled && navigate(btn.route)}
          />
        ))}
      </div>
    </div>
  );
}
