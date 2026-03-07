// ── src/components/PixelInput.jsx ────────────────────────────────────────
// Reusable retro-styled input field for auth forms.

export default function PixelInput({
  label,
  name,
  type      = "text",
  value,
  onChange,
  onKeyDown,
  placeholder = "",
  error       = "",
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
      {label && (
        <label style={{
          fontFamily: "'Press Start 2P', monospace",
          fontSize: "5px", color: "rgba(0,245,255,.65)",
          letterSpacing: "1px",
        }}>
          {label}
        </label>
      )}
      <input
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        onKeyDown={onKeyDown}
        placeholder={placeholder}
        autoComplete={type === "password" ? "current-password" : "off"}
        style={{
          background:   "#000d1a",
          border:       `2px solid ${error ? "#ff2d55" : "rgba(0,245,255,.2)"}`,
          color:        "#fff",
          padding:      "10px 12px",
          fontFamily:   "'Press Start 2P', monospace",
          fontSize:     "6px",
          outline:      "none",
          width:        "100%",
          transition:   "border-color .15s",
          boxShadow:    error ? "0 0 6px rgba(255,45,85,.3)" : "none",
        }}
        onFocus={(e) => { if (!error) e.target.style.borderColor = "#00f5ff"; }}
        onBlur={(e)  => { if (!error) e.target.style.borderColor = "rgba(0,245,255,.2)"; }}
      />
      {error && (
        <span style={{
          fontFamily: "'Press Start 2P', monospace",
          fontSize: "5px", color: "#ff2d55", lineHeight: "1.8",
        }}>
          ⚠ {error}
        </span>
      )}
    </div>
  );
}
