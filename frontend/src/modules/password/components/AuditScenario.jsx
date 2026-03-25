// ── src/modules/password/components/AuditScenario.jsx ───────────────────
// Renders the account audit table for level 4.
// Player flags accounts they think violate security policy.

import { useState } from "react";

const RISK_COLORS  = { critical: "#ff2d55", high: "#ff8c00", medium: "#ffd700", low: "#39ff14" };
const RISK_LABELS  = { critical: "CRITICAL",  high: "HIGH",     medium: "MEDIUM",  low: "LOW" };

export default function AuditScenario({ level, onSubmit, disabled }) {
  const [flagged,  setFlagged]  = useState(new Set());
  const [revealed, setRevealed] = useState(false);

  function toggleFlag(id) {
    if (disabled || revealed) return;
    setFlagged((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  function handleSubmit() {
    if (revealed) return;
    setRevealed(true);
    const correct    = new Set(level.flaggedIds);
    const allCorrect = [...correct].every((id) => flagged.has(id)) &&
                       [...flagged].every((id)  => correct.has(id));
    onSubmit(allCorrect, [...flagged]);
  }

  function rowClass(account) {
    if (!revealed) return flagged.has(account.id) ? "pwd-audit-row pwd-audit-row--flagged" : "pwd-audit-row";
    const shouldFlag = level.flaggedIds.includes(account.id);
    const didFlag    = flagged.has(account.id);
    if (shouldFlag  && didFlag)  return "pwd-audit-row pwd-audit-row--correct  pwd-audit-row--disabled";
    if (shouldFlag  && !didFlag) return "pwd-audit-row pwd-audit-row--missed   pwd-audit-row--disabled";
    if (!shouldFlag && didFlag)  return "pwd-audit-row pwd-audit-row--wrong    pwd-audit-row--disabled";
    return "pwd-audit-row pwd-audit-row--disabled";
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>

      {/* Column headers */}
      <div style={{
        display: "flex", gap: "10px", padding: "6px 14px",
        fontFamily: "var(--pixel)", fontSize: "4px",
        color: "rgba(0,245,255,.4)", letterSpacing: "1px",
        borderBottom: "1px solid rgba(0,245,255,.1)",
      }}>
        <span style={{ minWidth: "20px" }}>FLAG</span>
        <span style={{ minWidth: "100px" }}>USERNAME</span>
        <span style={{ flex: 1 }}>PASSWORD</span>
        <span>MFA</span>
        <span style={{ minWidth: "90px", textAlign: "right" }}>LAST CHANGED</span>
        <span style={{ minWidth: "55px", textAlign: "right" }}>RISK</span>
      </div>

      {/* Account rows */}
      <div className="pwd-audit">
        {level.accounts.map((account) => (
          <div key={account.id} className={rowClass(account)} onClick={() => toggleFlag(account.id)}>
            <span className="pwd-audit-row__flag">
              {flagged.has(account.id) ? "⚑" : "○"}
            </span>
            <span className="pwd-audit-row__username">{account.username}</span>
            <div style={{ flex: 1 }}>
              <div className="pwd-audit-row__password">{account.password}</div>
              {revealed && (
                <div style={{
                  fontFamily: "var(--pixel)", fontSize: "4.5px",
                  color: level.flaggedIds.includes(account.id) ? "#ff2d55" : "#39ff14",
                  marginTop: "4px", lineHeight: "1.7",
                }}>
                  {account.reason}
                </div>
              )}
            </div>
            <div className="pwd-audit-row__meta">
              <span style={{ fontFamily: "var(--pixel)", fontSize: "4px", color: revealed ? (account.mfa ? "#39ff14" : "#ff2d55") : "rgba(0,245,255,.6)" }}>
                {account.mfa ? "MFA ✓" : "NO MFA"}
              </span>
              <span style={{ fontFamily: "var(--pixel)", fontSize: "4px", color: "rgba(0,245,255,.4)" }}>
                {account.lastChanged}
              </span>
              <span className="pwd-audit-row__risk" style={{
                color:        revealed ? RISK_COLORS[account.risk] : "rgba(0,245,255,.4)",
                borderColor:  revealed ? RISK_COLORS[account.risk] : "rgba(0,245,255,.2)",
              }}>
                {revealed ? RISK_LABELS[account.risk] : "???"}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Instructions */}
      {!revealed && (
        <div style={{
          fontFamily: "var(--pixel)", fontSize: "5px",
          color: "rgba(0,245,255,.4)", padding: "8px 10px",
          border: "1px dashed rgba(0,245,255,.15)", lineHeight: "1.8",
        }}>
          Click rows to flag accounts that violate security policy. Flag all that apply, then submit.
        </div>
      )}

      {!revealed && (
        <button
          className="pwd-submit"
          onClick={handleSubmit}
          disabled={flagged.size === 0 || disabled}
        >
          ▶ SUBMIT AUDIT ({flagged.size} flagged)
        </button>
      )}
    </div>
  );
}
