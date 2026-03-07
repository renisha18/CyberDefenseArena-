// Pixel SVG icon library — all game icons in one place

export function ShieldIcon({ size = 32, color = "#39ff14", glow = false }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32"
      style={{ imageRendering: "pixelated", filter: glow ? `drop-shadow(0 0 7px ${color})` : "none" }}>
      <rect x="8"  y="2"  width="16" height="2"  fill={color} />
      <rect x="6"  y="4"  width="20" height="2"  fill={color} />
      <rect x="4"  y="6"  width="24" height="14" fill={color} />
      <rect x="6"  y="20" width="20" height="2"  fill={color} />
      <rect x="8"  y="22" width="16" height="2"  fill={color} />
      <rect x="10" y="24" width="12" height="2"  fill={color} />
      <rect x="12" y="26" width="8"  height="2"  fill={color} />
      <rect x="14" y="28" width="4"  height="2"  fill={color} />
      <rect x="12" y="10" width="8"  height="2"  fill="#0a0e1a" />
      <rect x="10" y="12" width="12" height="2"  fill="#0a0e1a" />
      <rect x="12" y="14" width="8"  height="2"  fill="#0a0e1a" />
    </svg>
  );
}

export function BugIcon({ size = 32 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" style={{ imageRendering: "pixelated" }}>
      <rect x="10" y="6"  width="12" height="2"  fill="#ff2d55" />
      <rect x="8"  y="8"  width="16" height="2"  fill="#ff2d55" />
      <rect x="6"  y="10" width="20" height="12" fill="#ff2d55" />
      <rect x="8"  y="22" width="16" height="2"  fill="#ff2d55" />
      <rect x="10" y="24" width="12" height="2"  fill="#ff2d55" />
      <rect x="10" y="8"  width="4"  height="2"  fill="#ffd700" />
      <rect x="18" y="8"  width="4"  height="2"  fill="#ffd700" />
      <rect x="4"  y="12" width="2"  height="2"  fill="#ff2d55" />
      <rect x="2"  y="10" width="2"  height="2"  fill="#ff2d55" />
      <rect x="26" y="12" width="2"  height="2"  fill="#ff2d55" />
      <rect x="28" y="10" width="2"  height="2"  fill="#ff2d55" />
      <rect x="4"  y="18" width="2"  height="2"  fill="#ff2d55" />
      <rect x="2"  y="20" width="2"  height="2"  fill="#ff2d55" />
      <rect x="26" y="18" width="2"  height="2"  fill="#ff2d55" />
      <rect x="28" y="20" width="2"  height="2"  fill="#ff2d55" />
      <rect x="12" y="14" width="4"  height="4"  fill="#0a0e1a" />
      <rect x="18" y="14" width="4"  height="4"  fill="#0a0e1a" />
    </svg>
  );
}

export function EmailIcon({ size = 32, alert = false }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32"
      style={{ imageRendering: "pixelated", filter: alert ? "drop-shadow(0 0 4px #ff2d55)" : "none" }}>
      <rect x="2"  y="6"  width="28" height="2"  fill="#00f5ff" />
      <rect x="2"  y="8"  width="2"  height="18" fill="#00f5ff" />
      <rect x="28" y="8"  width="2"  height="18" fill="#00f5ff" />
      <rect x="2"  y="26" width="28" height="2"  fill="#00f5ff" />
      <rect x="4"  y="8"  width="4"  height="2"  fill="#00f5ff" />
      <rect x="8"  y="10" width="4"  height="2"  fill="#00f5ff" />
      <rect x="12" y="12" width="8"  height="2"  fill="#00f5ff" />
      <rect x="20" y="10" width="4"  height="2"  fill="#00f5ff" />
      <rect x="24" y="8"  width="4"  height="2"  fill="#00f5ff" />
      {alert && <rect x="24" y="4" width="6" height="6" fill="#ff2d55" />}
    </svg>
  );
}

export function LogoShield() {
  return (
    <svg width="70" height="78" viewBox="0 0 72 80" style={{ filter: "drop-shadow(0 0 14px #00f5ff)" }}>
      <polygon points="36,2 70,18 70,46 36,78 2,46 2,18" fill="#0a0e1a" stroke="#00f5ff" strokeWidth="3" />
      <polygon points="36,12 60,24 60,44 36,68 12,44 12,24" fill="none" stroke="#00f5ff" strokeWidth="1.5" strokeOpacity=".4" />
      <rect x="28" y="26" width="16" height="20" rx="2" fill="#00f5ff" opacity=".9" />
      <rect x="32" y="22" width="8"  height="10" rx="4" fill="none" stroke="#00f5ff" strokeWidth="2.5" />
    </svg>
  );
}

export function SmallLogo() {
  return (
    <svg width="20" height="22" viewBox="0 0 72 80" style={{ filter: "drop-shadow(0 0 6px #00f5ff)" }}>
      <polygon points="36,2 70,18 70,46 36,78 2,46 2,18" fill="#0a0e1a" stroke="#00f5ff" strokeWidth="4" />
      <rect x="28" y="26" width="16" height="20" rx="2" fill="#00f5ff" />
      <rect x="32" y="22" width="8"  height="10" rx="4" fill="none" stroke="#00f5ff" strokeWidth="3" />
    </svg>
  );
}
