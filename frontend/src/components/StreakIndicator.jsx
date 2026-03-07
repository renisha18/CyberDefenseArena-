// Top-left daily streak badge

export default function StreakIndicator({ streak = 5 }) {
  return (
    <div className="streak">
      <span className="streak__flame">🔥</span>
      <div>
        <div className="streak__label">DAILY STREAK</div>
        <div className="streak__value">{streak} DAYS</div>
      </div>
    </div>
  );
}
