// ── src/modules/password/components/ChoiceScenario.jsx ───────────────────
// Renders a multiple-choice scenario for password levels 1, 2, 3, 5.

import { useState } from "react";

const RISK_COLORS = { critical: "#ff2d55", high: "#ff8c00", medium: "#ffd700", low: "#39ff14" };

export default function ChoiceScenario({ level, onSubmit, disabled }) {
  const [selected, setSelected] = useState(null);
  const [revealed, setRevealed] = useState(false);

  function handleSelect(optionId) {
    if (disabled || revealed) return;
    setSelected(optionId);
  }

  function handleSubmit() {
    if (!selected || revealed) return;
    setRevealed(true);
    const isCorrect = selected === level.correctId;
    onSubmit(isCorrect, selected);
  }

  function getOptionClass(opt) {
    if (!revealed) {
      return selected === opt.id ? "pwd-option pwd-option--selected" : "pwd-option";
    }
    // Only color the option the player actually selected, plus highlight correct
    if (opt.id === level.correctId && opt.id === selected) return "pwd-option pwd-option--correct pwd-option--reveal";
    if (opt.id === level.correctId) return "pwd-option pwd-option--reveal";
    if (opt.id === selected && selected !== level.correctId) return "pwd-option pwd-option--wrong";
    return "pwd-option";
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>

      {/* Options */}
      <div className="pwd-options">
        {level.options.map((opt) => (
          <button
            key={opt.id}
            className={getOptionClass(opt)}
            onClick={() => handleSelect(opt.id)}
            disabled={disabled || revealed}
          >
            <span className="pwd-option__key">{opt.id.toUpperCase()}.</span>
            <div style={{ flex: 1 }}>
              <div className="pwd-option__text" style={{ fontFamily: "var(--pixel)", fontSize: "6px" }}>
                {opt.label}
              </div>
              {/* Only show reason on selected option and the correct one */}
              {revealed && (opt.id === selected || opt.id === level.correctId) && (
                <div style={{
                  fontFamily: "var(--pixel)", fontSize: "5px",
                  color: opt.id === level.correctId ? "#39ff14" : "rgba(255,45,85,.8)",
                  marginTop: "5px", lineHeight: "1.8",
                }}>
                  {opt.id === level.correctId ? "✓ " : "✗ "}{opt.reason}
                </div>
              )}
            </div>
            {/* Only show badge on the option the player selected, or the correct one */}
            {revealed && (opt.id === selected || opt.id === level.correctId) && (
              <span className="pwd-option__badge" style={{
                color: opt.id === level.correctId ? "#39ff14" : "#ff2d55",
                borderColor: opt.id === level.correctId ? "#39ff14" : "#ff2d55",
              }}>
                {opt.id === level.correctId ? "CORRECT" : "WRONG"}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Submit */}
      {!revealed && (
        <button
          className="pwd-submit"
          onClick={handleSubmit}
          disabled={!selected || disabled}
        >
          ▶ CONFIRM DECISION
        </button>
      )}
    </div>
  );
}
