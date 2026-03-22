// ── src/modules/phishing/components/ResultPopup.jsx ──────────────────────

export default function ResultPopup({
  correct, healthChange, xpGained, explanation,
  redFlags, realWorldStat, level,
  onNext, onRetry, onExit,
  isLastLevel, submitting, serverMsg,
}) {
  const color   = correct ? "#39ff14"                     : "#ff2d55";
  const bgColor = correct ? "rgba(57,255,20,.06)"         : "rgba(255,45,85,.06)";
  const verdict = correct ? "✓ THREAT NEUTRALIZED"        : "✗ SECURITY BREACH";
  const subtext = correct
    ? isLastLevel
      ? "Module complete! You've mastered phishing detection."
      : "Correct — advance to the next scenario."
    : "You fell for it. Study the red flags and retry.";

  return (
    <div className="result-backdrop">
      <div className="result-popup" style={{ border: `3px solid ${color}`, boxShadow: `0 0 40px ${color}44` }}>

        {/* Verdict */}
        <div className="result-popup__header" style={{ background: bgColor, borderBottom: `1px solid ${color}44` }}>
          <div className="result-popup__verdict" style={{ color, textShadow: `0 0 12px ${color}` }}>
            {verdict}
          </div>
          <div className="result-popup__sub">{subtext}</div>
        </div>

        {/* Stats */}
        <div className="result-popup__stats">
          {[
            { label: "HEALTH",    val: `${healthChange > 0 ? "+" : ""}${healthChange} HP`, color },
            { label: "XP EARNED", val: `+${xpGained}`,                                     color: "#ffd700" },
            { label: "SCENARIO",  val: `${level?.level ?? "-"} / 5`,                        color: level?.difficultyColor ?? "#00f5ff" },
          ].map((s) => (
            <div key={s.label} className="result-popup__stat">
              <div className="result-popup__stat-label">{s.label}</div>
              <div className="result-popup__stat-value" style={{ color: s.color, textShadow: `0 0 8px ${s.color}` }}>
                {s.val}
              </div>
            </div>
          ))}
        </div>

        <div className="result-popup__body">

          {/* Explanation */}
          <div>
            <div className="result-popup__section-title">// ATTACK ANALYSIS</div>
            <div className="result-popup__explanation">{explanation}</div>
          </div>

          {/* Red flags */}
          {redFlags?.length > 0 && (
            <div>
              <div className="result-popup__section-title">// RED FLAGS IN THIS EMAIL</div>
              <div className="result-popup__flags">
                {redFlags.map((flag, i) => (
                  <div key={i} className="result-popup__flag">
                    <span>⚠</span> {flag}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Real-world stat */}
          {realWorldStat && (
            <div className="result-popup__stat-box">
              <span className="result-popup__stat-icon">📊</span>
              <div className="result-popup__stat-text">
                <span style={{ color: "#ffd700" }}>REAL WORLD: </span>
                {realWorldStat}
              </div>
            </div>
          )}

          {/* Server note (already done today, etc.) */}
          {serverMsg && (
            <div style={{
              fontFamily: "var(--pixel)", fontSize: "5px",
              color: "#ffd700", background: "rgba(255,215,0,.06)",
              border: "1px solid rgba(255,215,0,.2)",
              padding: "8px 10px", lineHeight: "1.8",
            }}>
              ⚠ NOTE: {serverMsg}
            </div>
          )}

        </div>

        {/* Actions */}
        <div className="result-popup__actions">
          {correct && !isLastLevel && (
            <button onClick={onNext} disabled={submitting} style={{
              flex: 1, fontFamily: "var(--pixel)", fontSize: "7px",
              color: "#0a0e1a", background: submitting ? "#555" : "#39ff14",
              border: `2px solid ${submitting ? "#555" : "#39ff14"}`,
              padding: "13px",
              cursor: submitting ? "not-allowed" : "pointer",
              boxShadow: submitting ? "none" : "0 0 20px rgba(57,255,20,.5)",
            }}>
              {submitting ? "SAVING..." : "NEXT SCENARIO ▶"}
            </button>
          )}

          {correct && isLastLevel && (
            <button onClick={onExit} style={{
              flex: 1, fontFamily: "var(--pixel)", fontSize: "7px",
              color: "#0a0e1a", background: "#ffd700",
              border: "2px solid #ffd700", padding: "13px",
              boxShadow: "0 0 20px rgba(255,215,0,.5)", cursor: "pointer",
            }}>
              🏆 MODULE COMPLETE — RETURN TO BASE
            </button>
          )}

          {!correct && (
            <button onClick={onRetry} style={{
              flex: 1, fontFamily: "var(--pixel)", fontSize: "7px",
              color: "#00f5ff", background: "transparent",
              border: "2px solid #00f5ff", padding: "13px", cursor: "pointer",
            }}>
              ↺ RETRY SCENARIO
            </button>
          )}

          <button onClick={onExit} style={{
            fontFamily: "var(--pixel)", fontSize: "6px",
            color: "#555", background: "transparent",
            border: "2px solid #333", padding: "13px 16px", cursor: "pointer",
          }}>
            ← EXIT
          </button>
        </div>

      </div>
    </div>
  );
}
