// ── src/modules/phishing/components/ActionButtons.jsx ────────────────────
// Decision panel: Report Phishing, Open Link/Download, Inspect.
// Red flag hints are revealed one-by-one as the player clicks "Inspect".
// Button colors are neutral until the player has answered.

import { useState } from "react";

export default function ActionButtons({ level, onAction, onInspect, disabled, result }) {
  const [revealedFlags, setRevealedFlags] = useState([]);

  function revealNextFlag() {
    if (revealedFlags.length < level.redFlags.length) {
      setRevealedFlags((prev) => [...prev, prev.length]);
    }
    onInspect();
  }

  const hasLink       = !!level.link;
  const hasAttachment = !!level.attachment;
  const actionLabel   = hasAttachment ? "⬇ Download & Open Attachment" : "🔗 Click The Link";

  // Only apply correct/wrong colors after the player has answered
  const reportClass = result
    ? `action-btn ${result.correct ? "action-btn--correct" : "action-btn--neutral"}`
    : "action-btn action-btn--neutral";

  const clickClass = result
    ? `action-btn ${!result.correct ? "action-btn--wrong" : "action-btn--neutral"}`
    : "action-btn action-btn--neutral";

  return (
    <div className="action-panel">
      <div className="action-panel__header">⚡ WHAT DO YOU DO?</div>
      <div className="action-panel__body">

        {/* Hint: Inspect */}
        <button className="action-panel__inspect-btn" onClick={revealNextFlag} disabled={disabled}>
          🔍 INSPECT{" "}
          {revealedFlags.length < level.redFlags.length
            ? `(${level.redFlags.length - revealedFlags.length} clue${level.redFlags.length - revealedFlags.length !== 1 ? "s" : ""} hidden)`
            : "(all clues revealed)"}
        </button>

        {/* Red flags revealed so far */}
        {revealedFlags.length > 0 && (
          <div className="red-flags">
            {revealedFlags.map((i) => (
              <div key={i} className="red-flag red-flag--revealed">
                ⚠ {level.redFlags[i]}
              </div>
            ))}
          </div>
        )}

        <div style={{
          fontFamily: "var(--pixel)", fontSize: "5px",
          color: "rgba(0,245,255,.3)", borderTop: "1px solid rgba(0,245,255,.1)",
          paddingTop: "10px",
        }}>
          CHOOSE YOUR ACTION:
        </div>

        {/* Report button */}
        <button
          className={reportClass}
          onClick={() => onAction("report")}
          disabled={disabled}
        >
          <span style={{ fontSize: "16px" }}>🛡</span>
          REPORT MAIL
        </button>

        {/* Click/Download button */}
        {(hasLink || hasAttachment) && (
          <button
            className={clickClass}
            onClick={() => onAction("click")}
            disabled={disabled}
          >
            <span style={{ fontSize: "16px" }}>{hasAttachment ? "📎" : "🔗"}</span>
            {actionLabel}
          </button>
        )}

        {/* Difficulty badge */}
        <div style={{
          fontFamily: "var(--pixel)", fontSize: "5px",
          color: level.difficultyColor, border: `1px solid ${level.difficultyColor}`,
          padding: "5px 8px", textAlign: "center",
          boxShadow: `0 0 6px ${level.difficultyColor}44`,
        }}>
          DIFFICULTY: {level.difficulty}
        </div>

      </div>
    </div>
  );
}
