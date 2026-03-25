// ── src/components/StreakIndicator.jsx ────────────────────────────────────
// Top-left streak badge. Receives real streak from Dashboard via props.
// Default changed from hardcoded 5 → 0 (new users start at 0).

export default function StreakIndicator({ streak = 0 }) {
  return (
    <div className="streak">
      <span className="streak__flame">🔥</span>
      <div>
        <div className="streak__label">DAILY STREAK</div>
        <div className="streak__value">{streak} DAY{streak !== 1 ? "S" : ""}</div>
      </div>
    </div>
  );
}
