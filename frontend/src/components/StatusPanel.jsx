// ── src/components/StatusPanel.jsx ───────────────────────────────────────
// Agent status panel on Dashboard.
// All values come from props (real DB data via AuthContext) — nothing hardcoded.

export default function StatusPanel({
  health = 50,
  xp = 0,
  streak = 0,
  completedChallenges = 0,
}) {
  const healthColor = health > 60 ? "#39ff14" : health > 30 ? "#ffd700" : "#ff2d55";

  const streakLabel =
    streak === 0 ? "NO STREAK"
    : streak === 1 ? "1 DAY"
    : `${streak} DAYS`;

  const rows = [
    { icon: "🛡", label: "SECURITY HEALTH", val: `${health}%`,          color: healthColor },
    { icon: "⚡", label: "DAILY STREAK",    val: streakLabel,            color: streak > 0 ? "#ff8c00" : "rgba(0,245,255,.4)" },
    { icon: "💀", label: "THREATS STOPPED", val: String(completedChallenges), color: "#ff2d55" },
    { icon: "🎖", label: "XP EARNED",       val: String(xp),             color: "#ffd700" },
  ];

  return (
    <div className="status-panel">
      <div className="status-panel__header">◈ AGENT STATUS</div>
      <div className="status-panel__body">
        {rows.map((row, i) => (
          <div key={i} className="status-panel__row">
            <span className="status-panel__icon">{row.icon}</span>
            <div style={{ flex: 1 }}>
              <div className="status-panel__label">{row.label}</div>
              <div
                className="status-panel__value"
                style={{ color: row.color, textShadow: `0 0 6px ${row.color}` }}
              >
                {row.val}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
