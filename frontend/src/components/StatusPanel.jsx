// Top-right agent status panel on Dashboard

export default function StatusPanel({ health = 70, xp = 0 }) {
  const healthColor = health > 60 ? "#39ff14" : health > 30 ? "#ffd700" : "#ff2d55";

  const rows = [
    { icon: "🛡", label: "SECURITY HEALTH", val: `${health}%`,  color: healthColor },
    { icon: "⚡", label: "DAILY STREAK",    val: "5 DAYS",      color: "#ff8c00"  },
    { icon: "💀", label: "THREATS STOPPED", val: "23",          color: "#ff2d55"  },
    { icon: "🎖", label: "XP EARNED",       val: `${xp}`,       color: "#ffd700"  },
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
