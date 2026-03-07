// ── src/pages/Dashboard.jsx ───────────────────────────────────────────────
import { useState }       from "react";
import { useNavigate }    from "react-router-dom";
import { useAuth }        from "../context/AuthContext";
import Scanlines          from "../components/Scanlines";
import MatrixRain         from "../components/MatrixRain";
import PixelButton        from "../components/PixelButton";
import StatusPanel        from "../components/StatusPanel";
import StreakIndicator    from "../components/StreakIndicator";
import LeaderboardPreview from "../components/LeaderboardPreview";
import OfficeMap          from "../components/OfficeMap";
import { SmallLogo }      from "../components/PixelIcons";
import api                from "../services/api";
import "../styles/dashboard.css";

function roomHealthColor(h) {
  if (h >= 80) return "#39ff14";
  if (h >= 55) return "#ffd700";
  return "#ff2d55";
}

export default function Dashboard() {
  const navigate            = useNavigate();
  const { user, logout }    = useAuth();
  const [selectedRoom, setSelectedRoom] = useState(null);

  const playerHealth = user?.healthScore ?? 70;
  const playerXP     = user?.xp          ?? 0;
  const streak       = user?.streak       ?? 0;
  const username     = user?.username     ?? "";

  async function handleLogout() {
    await logout();
    navigate("/");
  }

  const NAV_BUTTONS = [
    { text: "⚡ DAILY CHALLENGE", color: "#39ff14", route: "/challenge" },
    { text: "🏆 LEADERBOARD",     color: "#ffd700", route: "/leaderboard" },
    { text: "📡 TRAINING",         color: "#00f5ff", route: "/training" },
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

      {/* Office map */}
      <div className="dashboard__map-area">
        <OfficeMap onRoomClick={setSelectedRoom} />
      </div>

      {/* Overlays */}
      <StreakIndicator streak={streak} />
      <LeaderboardPreview />
      <StatusPanel health={playerHealth} xp={playerXP} streak={streak} username={username} />

      {/* Room popup */}
      {selectedRoom && (
        <div className="dashboard__room-popup" style={{
          border: `3px solid ${roomHealthColor(selectedRoom.health)}`,
          boxShadow: `0 0 40px ${roomHealthColor(selectedRoom.health)}55`,
        }}>
          <div className="dashboard__room-popup-title">{selectedRoom.label}</div>
          <div style={{ fontFamily: "var(--pixel)", fontSize: "5px", color: "rgba(0,245,255,.5)", marginBottom: "6px" }}>
            SYSTEM HEALTH
          </div>
          <div className="dashboard__room-popup-healthbar">
            <div style={{
              width: `${selectedRoom.health}%`, height: "100%",
              background: roomHealthColor(selectedRoom.health),
              boxShadow: `0 0 8px ${roomHealthColor(selectedRoom.health)}`,
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
              onClick={() => { setSelectedRoom(null); navigate("/challenge"); }}
              style={{ flex: 1 }} />
            <PixelButton text="✕" type="secondary" onClick={() => setSelectedRoom(null)} />
          </div>
        </div>
      )}

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
