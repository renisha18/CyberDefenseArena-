// Top navigation bar — used in ChallengePage
import PixelButton from "./PixelButton";

// Inline health bar widget
function HealthBar({ health }) {
  const color = health > 60 ? "#39ff14" : health > 30 ? "#ffd700" : "#ff2d55";
  return (
    <div className="healthbar">
      <div className="healthbar__labels" style={{ color }}>
        <span>COMPANY HEALTH</span>
        <span>{health}/100</span>
      </div>
      <div
        className="healthbar__track"
        style={{ border: `2px solid ${color}` }}
      >
        <div
          className="healthbar__fill"
          style={{ width: `${health}%`, background: color }}
        />
      </div>
    </div>
  );
}

export default function Navbar({ onBack, health, xp, title = "CHALLENGE 1 — PHISHING DETECTION" }) {
  return (
    <div className="navbar">
      <div className="navbar__brand">
        <PixelButton text="◀ BASE" onClick={onBack} type="back" />
        <span className="navbar__title">{title}</span>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
        <HealthBar health={health} />
        <div className="navbar__xp">XP: {xp}</div>
      </div>
    </div>
  );
}
