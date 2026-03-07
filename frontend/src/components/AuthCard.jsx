// ── src/components/AuthCard.jsx ───────────────────────────────────────────
// Pixel-styled container card for login / signup forms.

import { LogoShield } from "./PixelIcons";

export default function AuthCard({ title, subtitle, children }) {
  return (
    <div style={{
      width: "100%", maxWidth: "400px", padding: "0 20px",
      display: "flex", flexDirection: "column", alignItems: "center", gap: "22px",
    }}>
      {/* Logo */}
      <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
        <LogoShield />
        <div>
          <div style={{
            fontFamily: "'Press Start 2P', monospace",
            fontSize: "10px", color: "#00f5ff",
            textShadow: "0 0 10px #00f5ff", marginBottom: "4px",
          }}>
            CYBERDEFENSE
          </div>
          <div style={{
            fontFamily: "'Press Start 2P', monospace",
            fontSize: "14px", color: "#fff",
            textShadow: "0 0 20px rgba(0,245,255,.3)",
          }}>
            ARENA
          </div>
        </div>
      </div>

      {/* Card */}
      <div style={{
        width: "100%", background: "#0d1b2e",
        border: "2px solid rgba(0,245,255,.25)",
        boxShadow: "0 0 40px rgba(0,245,255,.07), inset 0 0 20px rgba(0,0,0,.3)",
      }}>
        {/* Card header */}
        <div style={{
          padding: "12px 20px",
          borderBottom: "1px solid rgba(0,245,255,.15)",
          background: "rgba(0,0,0,.3)",
        }}>
          <div style={{
            fontFamily: "'Press Start 2P', monospace",
            fontSize: "8px", color: "#00f5ff",
            textShadow: "0 0 8px #00f5ff",
          }}>
            {title}
          </div>
          {subtitle && (
            <div style={{
              fontFamily: "'Press Start 2P', monospace",
              fontSize: "5px", color: "rgba(0,245,255,.45)",
              marginTop: "6px",
            }}>
              {subtitle}
            </div>
          )}
        </div>

        {/* Card body */}
        <div style={{ padding: "20px" }}>
          {children}
        </div>
      </div>
    </div>
  );
}
