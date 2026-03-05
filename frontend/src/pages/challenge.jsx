import { useState, useEffect, useRef } from "react";

// ── Pixel SVG Icons ────────────────────────────────────────────────────────
const ShieldIcon = ({ size = 32, color = "#4CAF50", glow = false }) => (
  <svg width={size} height={size} viewBox="0 0 32 32" style={{ imageRendering: "pixelated", filter: glow ? `drop-shadow(0 0 6px ${color})` : "none" }}>
    <rect x="8" y="2" width="16" height="2" fill={color} />
    <rect x="6" y="4" width="20" height="2" fill={color} />
    <rect x="4" y="6" width="24" height="14" fill={color} />
    <rect x="6" y="20" width="20" height="2" fill={color} />
    <rect x="8" y="22" width="16" height="2" fill={color} />
    <rect x="10" y="24" width="12" height="2" fill={color} />
    <rect x="12" y="26" width="8" height="2" fill={color} />
    <rect x="14" y="28" width="4" height="2" fill={color} />
    <rect x="12" y="10" width="8" height="2" fill="#003049" />
    <rect x="10" y="12" width="12" height="2" fill="#003049" />
    <rect x="12" y="14" width="8" height="2" fill="#003049" />
  </svg>
);

const EmailIcon = ({ size = 32, color = "#6EC6FF", alert = false }) => (
  <svg width={size} height={size} viewBox="0 0 32 32" style={{ imageRendering: "pixelated", filter: alert ? "drop-shadow(0 0 4px #FF4D4D)" : "none" }}>
    <rect x="2" y="6" width="28" height="2" fill={color} />
    <rect x="2" y="8" width="2" height="18" fill={color} />
    <rect x="28" y="8" width="2" height="18" fill={color} />
    <rect x="2" y="26" width="28" height="2" fill={color} />
    <rect x="4" y="8" width="4" height="2" fill={color} />
    <rect x="8" y="10" width="4" height="2" fill={color} />
    <rect x="12" y="12" width="4" height="2" fill={color} />
    <rect x="16" y="12" width="4" height="2" fill={color} />
    <rect x="20" y="10" width="4" height="2" fill={color} />
    <rect x="24" y="8" width="4" height="2" fill={color} />
    {alert && <rect x="24" y="4" width="6" height="6" fill="#FF4D4D" />}
  </svg>
);

const WarningIcon = ({ size = 32 }) => (
  <svg width={size} height={size} viewBox="0 0 32 32" style={{ imageRendering: "pixelated" }}>
    <rect x="14" y="2" width="4" height="2" fill="#FFD700" />
    <rect x="12" y="4" width="8" height="2" fill="#FFD700" />
    <rect x="10" y="6" width="12" height="2" fill="#FFD700" />
    <rect x="8" y="8" width="16" height="2" fill="#FFD700" />
    <rect x="6" y="10" width="20" height="2" fill="#FFD700" />
    <rect x="4" y="12" width="24" height="2" fill="#FFD700" />
    <rect x="2" y="14" width="28" height="2" fill="#FFD700" />
    <rect x="2" y="16" width="28" height="2" fill="#FFD700" />
    <rect x="2" y="18" width="28" height="2" fill="#FFD700" />
    <rect x="2" y="20" width="28" height="2" fill="#FFD700" />
    <rect x="2" y="22" width="28" height="2" fill="#FFD700" />
    <rect x="2" y="24" width="28" height="2" fill="#FFD700" />
    <rect x="14" y="10" width="4" height="8" fill="#003049" />
    <rect x="14" y="20" width="4" height="4" fill="#003049" />
  </svg>
);

const BugIcon = ({ size = 32 }) => (
  <svg width={size} height={size} viewBox="0 0 32 32" style={{ imageRendering: "pixelated" }}>
    <rect x="10" y="6" width="12" height="2" fill="#FF4D4D" />
    <rect x="8" y="8" width="16" height="2" fill="#FF4D4D" />
    <rect x="6" y="10" width="20" height="12" fill="#FF4D4D" />
    <rect x="8" y="22" width="16" height="2" fill="#FF4D4D" />
    <rect x="10" y="24" width="12" height="2" fill="#FF4D4D" />
    <rect x="10" y="8" width="4" height="2" fill="#FFD700" />
    <rect x="18" y="8" width="4" height="2" fill="#FFD700" />
    <rect x="4" y="12" width="2" height="2" fill="#FF4D4D" /><rect x="2" y="10" width="2" height="2" fill="#FF4D4D" />
    <rect x="26" y="12" width="2" height="2" fill="#FF4D4D" /><rect x="28" y="10" width="2" height="2" fill="#FF4D4D" />
    <rect x="4" y="18" width="2" height="2" fill="#FF4D4D" /><rect x="2" y="20" width="2" height="2" fill="#FF4D4D" />
    <rect x="26" y="18" width="2" height="2" fill="#FF4D4D" /><rect x="28" y="20" width="2" height="2" fill="#FF4D4D" />
    <rect x="12" y="14" width="4" height="4" fill="#003049" />
    <rect x="18" y="14" width="4" height="4" fill="#003049" />
  </svg>
);

const ITIcon = ({ size = 32 }) => (
  <svg width={size} height={size} viewBox="0 0 32 32" style={{ imageRendering: "pixelated" }}>
    <rect x="12" y="2" width="8" height="8" fill="#6EC6FF" />
    <rect x="10" y="4" width="12" height="6" fill="#6EC6FF" />
    <rect x="8" y="10" width="16" height="14" fill="#4CAF50" />
    <rect x="6" y="12" width="20" height="10" fill="#4CAF50" />
    <rect x="4" y="24" width="24" height="4" fill="#003049" />
    <rect x="12" y="10" width="4" height="4" fill="#6EC6FF" />
    <rect x="18" y="10" width="4" height="4" fill="#6EC6FF" />
    <rect x="10" y="16" width="12" height="2" fill="#6EC6FF" />
  </svg>
);

const AttachIcon = ({ size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 32 32" style={{ imageRendering: "pixelated" }}>
    <rect x="8" y="2" width="12" height="2" fill="#FFD700" />
    <rect x="6" y="4" width="16" height="2" fill="#FFD700" />
    <rect x="6" y="6" width="16" height="18" fill="#FFD700" />
    <rect x="6" y="24" width="16" height="2" fill="#FFD700" />
    <rect x="8" y="26" width="12" height="2" fill="#FFD700" />
    <rect x="8" y="10" width="12" height="2" fill="#FF4D4D" />
    <rect x="8" y="14" width="12" height="2" fill="#FF4D4D" />
    <rect x="8" y="18" width="8" height="2" fill="#FF4D4D" />
    <rect x="18" y="4" width="4" height="4" fill="#FF4D4D" />
  </svg>
);

// ── Scanline Overlay ──────────────────────────────────────────────────────
const Scanlines = () => (
  <div style={{
    position: "fixed", inset: 0, pointerEvents: "none", zIndex: 9999,
    background: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.08) 2px, rgba(0,0,0,0.08) 4px)"
  }} />
);

// ── CRT Flicker ───────────────────────────────────────────────────────────
const crtStyle = `
  @import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap');

  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: #000; }

  @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }
  @keyframes flicker { 0%{opacity:.98} 50%{opacity:1} 100%{opacity:.97} }
  @keyframes slideIn { from{transform:translateY(-20px);opacity:0} to{transform:translateY(0);opacity:1} }
  @keyframes malwareSpread {
    0%{transform:scale(1) rotate(0deg); filter:drop-shadow(0 0 4px #FF4D4D)}
    25%{transform:scale(1.3) rotate(-10deg); filter:drop-shadow(0 0 12px #FF4D4D)}
    50%{transform:scale(0.9) rotate(10deg); filter:drop-shadow(0 0 20px #FF4D4D)}
    75%{transform:scale(1.2) rotate(-5deg); filter:drop-shadow(0 0 12px #FF4D4D)}
    100%{transform:scale(1) rotate(0deg); filter:drop-shadow(0 0 4px #FF4D4D)}
  }
  @keyframes shieldPop {
    0%{transform:scale(0) rotate(-20deg); opacity:0}
    60%{transform:scale(1.3) rotate(5deg); opacity:1}
    100%{transform:scale(1) rotate(0deg); opacity:1}
  }
  @keyframes pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.7;transform:scale(1.05)} }
  @keyframes scanPan { from{background-position:0 0} to{background-position:0 100%} }
  @keyframes glitch {
    0%,100%{clip-path:inset(0 0 100% 0)} 10%{clip-path:inset(10% 0 85% 0)} 20%{clip-path:inset(40% 0 55% 0)}
    30%{clip-path:inset(70% 0 20% 0)} 40%{clip-path:inset(90% 0 5% 0)} 50%{clip-path:inset(0 0 100% 0)}
  }
  @keyframes typewriter { from{width:0} to{width:100%} }
  @keyframes healthPulse { 0%,100%{box-shadow:0 0 4px #4CAF50} 50%{box-shadow:0 0 12px #4CAF50} }
  @keyframes alertPulse { 0%,100%{box-shadow:0 0 4px #FF4D4D} 50%{box-shadow:0 0 16px #FF4D4D} }
  @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-6px)} }
  @keyframes xpPop { 0%{transform:translateY(0);opacity:1} 100%{transform:translateY(-40px);opacity:0} }
  @keyframes matrixRain { from{transform:translateY(-100%)} to{transform:translateY(100vh)} }
`;

// ── Matrix Rain Background ────────────────────────────────────────────────
const MatrixRain = () => {
  const cols = 20;
  const chars = "01アイウエオカキクケコサシスセソタチツテトナニヌネノ";
  return (
    <div style={{ position: "fixed", inset: 0, overflow: "hidden", pointerEvents: "none", zIndex: 0, opacity: 0.07 }}>
      {Array.from({ length: cols }).map((_, i) => (
        <div key={i} style={{
          position: "absolute", left: `${(i / cols) * 100}%`, top: 0,
          fontFamily: "'Press Start 2P', monospace", fontSize: "10px", color: "#4CAF50",
          animation: `matrixRain ${3 + (i % 5)}s linear ${(i * 0.3) % 3}s infinite`,
          whiteSpace: "nowrap", writingMode: "vertical-rl"
        }}>
          {Array.from({ length: 20 }).map((_, j) => chars[Math.floor(Math.random() * chars.length)]).join("")}
        </div>
      ))}
    </div>
  );
};

// ── XP Popup ─────────────────────────────────────────────────────────────
const XPPopup = ({ amount, onDone }) => {
  useEffect(() => { const t = setTimeout(onDone, 1200); return () => clearTimeout(t); }, []);
  return (
    <div style={{
      position: "fixed", top: "30%", left: "50%", transform: "translateX(-50%)",
      fontFamily: "'Press Start 2P', monospace", fontSize: "18px",
      color: amount > 0 ? "#4CAF50" : "#FF4D4D",
      animation: "xpPop 1.2s forwards", zIndex: 9998,
      textShadow: `0 0 12px ${amount > 0 ? "#4CAF50" : "#FF4D4D"}`
    }}>
      {amount > 0 ? `+${amount} XP` : `${amount} HP`}
    </div>
  );
};

// ── Main Game ─────────────────────────────────────────────────────────────
export default function CyberDefenseArena() {
  const [phase, setPhase] = useState("inbox"); // inbox | reading | result | complete
  const [health, setHealth] = useState(70);
  const [xp, setXp] = useState(0);
  const [investigated, setInvestigated] = useState([]);
  const [activeReveal, setActiveReveal] = useState(null);
  const [malwareActive, setMalwareActive] = useState(false);
  const [shieldActive, setShieldActive] = useState(false);
  const [challengeResult, setChallengeResult] = useState(null); // "success" | "fail"
  const [popup, setPopup] = useState(null); // {amount}
  const [emailAlert, setEmailAlert] = useState(true);
  const [terminalLines, setTerminalLines] = useState([]);

  // Blink email alert
  useEffect(() => {
    const iv = setInterval(() => setEmailAlert(p => !p), 700);
    return () => clearInterval(iv);
  }, []);

  const addTerminalLine = (line) => setTerminalLines(p => [...p.slice(-6), line]);

  const showPopup = (amount) => { setPopup({ amount }); };

  const clampHealth = (v) => Math.max(0, Math.min(100, v));

  const healthColor = health > 60 ? "#4CAF50" : health > 30 ? "#FFD700" : "#FF4D4D";
  const healthLabel = health > 60 ? "SECURE" : health > 30 ? "WARNING" : "BREACH";

  const investigations = [
    {
      id: "sender",
      label: "Check Sender",
      icon: "🔍",
      color: "#6EC6FF",
      reveal: {
        title: "⚠ DOMAIN MISMATCH DETECTED",
        body: "Sender: ceo-support@company-helpdesk.com\nOfficial: ceo@company.com\n\n[!] This domain does NOT match the company domain.",
        type: "warning",
        xp: 5
      }
    },
    {
      id: "link",
      label: "Hover Link",
      icon: "🔗",
      color: "#FFD700",
      reveal: {
        title: "⚠ SUSPICIOUS URL DETECTED",
        body: "Link resolves to:\nhttp://secure-payment-update.ru\n\n[!] External domain. Possible credential harvester.",
        type: "warning",
        xp: 5
      }
    },
    {
      id: "attachment",
      label: "Open Attachment",
      icon: "📎",
      color: "#FF4D4D",
      reveal: {
        title: "💀 MALWARE EXECUTED",
        body: "invoice.pdf contained an embedded macro.\nTrojan deployed. Keylogger active.\n\n[-10 HEALTH — Company data compromised]",
        type: "danger",
        hp: -10
      },
      terminal: "[ALERT] Malicious payload detected in invoice.pdf"
    },
    {
      id: "reply",
      label: "Reply to Email",
      icon: "↩",
      color: "#FF8C00",
      reveal: {
        title: "⚠ SOCIAL ENGINEERING ESCALATION",
        body: 'Scammer replies:\n"Great! Please send your banking credentials\nand network password to finalize."\n\n[-5 HEALTH — Attacker escalating]',
        type: "warning",
        hp: -5
      }
    }
  ];

  const handleInvestigate = (inv) => {
    if (investigated.includes(inv.id)) return;
    setInvestigated(p => [...p, inv.id]);
    setActiveReveal(inv.id);
    if (inv.reveal.xp) { setXp(p => p + inv.reveal.xp); showPopup(inv.reveal.xp); }
    if (inv.reveal.hp) {
      setHealth(p => clampHealth(p + inv.reveal.hp));
      showPopup(inv.reveal.hp);
    }
    if (inv.id === "attachment") {
      setMalwareActive(true);
      addTerminalLine("[CRITICAL] Malware payload executing...");
      addTerminalLine("[ALERT] Keylogger installed on WORKSTATION-07");
      setTimeout(() => { setChallengeResult("fail"); setPhase("result"); }, 2000);
    }
    if (inv.terminal) addTerminalLine(inv.terminal);
  };

  const handleReport = () => {
    setShieldActive(true);
    setMalwareActive(false);
    setHealth(p => clampHealth(p + 10));
    setXp(p => p + 20);
    showPopup(20);
    addTerminalLine("[SUCCESS] Phishing report filed. IT blocking sender...");
    addTerminalLine("[SUCCESS] Domain company-helpdesk.com blacklisted.");
    setTimeout(() => { setChallengeResult("success"); setPhase("result"); }, 1500);
  };

  const handleIgnore = () => {
    setHealth(p => clampHealth(p - 5));
    showPopup(-5);
    addTerminalLine("[WARN] Threat unaddressed. Risk window open.");
  };

  const resultData = challengeResult === "success"
    ? {
        title: "🛡 ATTACK BLOCKED!",
        subtitle: "Business Email Compromise (BEC) Neutralized",
        color: "#4CAF50",
        lessons: [
          "Urgency is a manipulation tactic — slow down",
          "Always verify sender domain against company records",
          "Attachments from unknown senders contain malware",
          "Report suspicious emails — your team can block threats"
        ],
        badge: "PHISHING HUNTER"
      }
    : {
        title: "💀 BREACH DETECTED",
        subtitle: "Malware executed via malicious attachment",
        color: "#FF4D4D",
        lessons: [
          "PDF files can embed executable code",
          "Urgency tactics force hasty decisions",
          "Always check sender before opening attachments",
          "Report to IT — never investigate alone"
        ],
        badge: "LESSON LEARNED"
      };

  return (
    <>
      <style>{crtStyle}</style>
      <Scanlines />
      {popup && <XPPopup amount={popup.amount} onDone={() => setPopup(null)} />}

      <div style={{
        minHeight: "100vh", background: "#001220",
        fontFamily: "'Press Start 2P', monospace",
        position: "relative", overflow: "hidden",
        animation: "flicker 8s infinite"
      }}>
        <MatrixRain />

        {/* ── TOP BAR ── */}
        <div style={{
          position: "relative", zIndex: 10,
          background: "linear-gradient(90deg, #001a2e 0%, #003049 50%, #001a2e 100%)",
          borderBottom: "3px solid #6EC6FF",
          boxShadow: "0 0 20px rgba(110,198,255,0.3)",
          padding: "10px 20px",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          flexWrap: "wrap", gap: "8px"
        }}>
          {/* Title */}
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <ShieldIcon size={28} glow />
            <div>
              <div style={{ color: "#6EC6FF", fontSize: "9px", letterSpacing: "2px", textShadow: "0 0 8px #6EC6FF" }}>
                CYBER
              </div>
              <div style={{ color: "#fff", fontSize: "7px", letterSpacing: "1px" }}>
                DEFENSE ARENA
              </div>
            </div>
          </div>

          {/* Health Bar */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "4px", minWidth: "180px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", width: "100%", fontSize: "6px", color: healthColor }}>
              <span>COMPANY HEALTH</span>
              <span style={{ textShadow: `0 0 6px ${healthColor}` }}>{healthLabel}</span>
            </div>
            <div style={{
              width: "100%", height: "12px", background: "#000",
              border: `2px solid ${healthColor}`,
              animation: health < 30 ? "alertPulse 1s infinite" : "healthPulse 2s infinite"
            }}>
              <div style={{
                width: `${health}%`, height: "100%",
                background: `linear-gradient(90deg, ${healthColor}88, ${healthColor})`,
                transition: "width 0.5s ease, background 0.5s ease"
              }} />
            </div>
            <div style={{ fontSize: "6px", color: healthColor }}>{health}/100 HP</div>
          </div>

          {/* XP + Level */}
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: "7px", color: "#FFD700", textShadow: "0 0 6px #FFD700" }}>
              LVL 01 — ROOKIE
            </div>
            <div style={{ fontSize: "8px", color: "#6EC6FF", marginTop: "2px" }}>
              XP: {xp}
            </div>
          </div>
        </div>

        {/* ── MAIN AREA ── */}
        {phase === "inbox" && (
          <div style={{ position: "relative", zIndex: 5, padding: "20px", display: "flex", flexDirection: "column", alignItems: "center", gap: "20px" }}>
            {/* Briefing */}
            <div style={{
              maxWidth: "680px", width: "100%",
              background: "#001a2e", border: "3px solid #6EC6FF",
              boxShadow: "0 0 20px rgba(110,198,255,0.2)", padding: "16px",
              animation: "slideIn 0.4s ease"
            }}>
              <div style={{ fontSize: "7px", color: "#6EC6FF", marginBottom: "8px", letterSpacing: "1px" }}>
                // SYSTEM BRIEFING
              </div>
              <div style={{ fontSize: "7px", color: "#a0c8e0", lineHeight: "1.8" }}>
                You are monitoring the company's internal email system.<br />
                A message arrives marked as <span style={{ color: "#FF4D4D" }}>URGENT</span>. Investigate before acting.
              </div>
            </div>

            {/* Inbox */}
            <div style={{
              maxWidth: "680px", width: "100%",
              background: "#001a2e", border: "3px solid #6EC6FF",
              boxShadow: "0 0 20px rgba(110,198,255,0.15)"
            }}>
              <div style={{
                padding: "10px 16px", borderBottom: "2px solid #6EC6FF",
                display: "flex", alignItems: "center", gap: "8px",
                background: "#002a44"
              }}>
                <EmailIcon size={18} />
                <span style={{ fontSize: "7px", color: "#6EC6FF" }}>INBOX — 1 NEW MESSAGE</span>
              </div>

              {/* Email Row */}
              <div
                onClick={() => setPhase("reading")}
                style={{
                  padding: "14px 16px", cursor: "pointer",
                  display: "flex", alignItems: "center", gap: "12px",
                  borderBottom: "2px solid #003049",
                  background: emailAlert ? "#001e36" : "#001830",
                  transition: "background 0.1s",
                  animation: "pulse 1.5s infinite"
                }}
              >
                <EmailIcon size={24} alert />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: "7px", color: "#FF4D4D", marginBottom: "4px" }}>
                    [URGENT] ceo-support@company-helpdesk.com
                  </div>
                  <div style={{ fontSize: "6px", color: "#6EC6FF" }}>
                    Need Payment Processed Immediately
                  </div>
                </div>
                <div style={{ animation: "blink 1s infinite" }}>
                  <WarningIcon size={20} />
                </div>
              </div>
            </div>

            <div style={{ fontSize: "6px", color: "#4CAF50", animation: "blink 1.2s infinite" }}>
              ▶ CLICK EMAIL TO OPEN
            </div>
          </div>
        )}

        {phase === "reading" && (
          <div style={{
            position: "relative", zIndex: 5, padding: "16px",
            display: "grid", gridTemplateColumns: "1fr 1fr",
            gap: "14px", maxWidth: "1100px", margin: "0 auto"
          }}>
            {/* LEFT — Email Content */}
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <div style={{
                background: "#001a2e", border: "3px solid #6EC6FF",
                boxShadow: "0 0 16px rgba(110,198,255,0.2)", animation: "slideIn 0.3s ease"
              }}>
                <div style={{
                  padding: "10px 14px", borderBottom: "2px solid #6EC6FF",
                  background: "#002a44", fontSize: "7px", color: "#6EC6FF",
                  display: "flex", alignItems: "center", gap: "6px"
                }}>
                  <EmailIcon size={14} alert /> EMAIL DETAILS
                </div>
                <div style={{ padding: "14px", fontSize: "6px", lineHeight: "2", color: "#a0c8e0" }}>
                  <div style={{ marginBottom: "8px" }}>
                    <span style={{ color: "#6EC6FF" }}>FROM: </span>
                    <span style={{ color: investigated.includes("sender") ? "#FF4D4D" : "#fff" }}>
                      ceo-support@company-helpdesk.com
                    </span>
                    {investigated.includes("sender") && (
                      <span style={{ color: "#FF4D4D", marginLeft: "6px", animation: "blink 0.8s infinite" }}>[⚠ MISMATCH]</span>
                    )}
                  </div>
                  <div style={{ marginBottom: "8px" }}>
                    <span style={{ color: "#6EC6FF" }}>SUBJECT: </span>
                    <span style={{ color: "#FFD700" }}>URGENT: Need Payment Processed Immediately</span>
                  </div>
                  <div style={{
                    marginTop: "12px", padding: "12px",
                    background: "#000d1a", border: "2px solid #003049",
                    lineHeight: "2.2", color: "#c8e0f0", fontSize: "6px"
                  }}>
                    <p>Hi,</p><br />
                    <p>We have a <span style={{ color: "#FF4D4D" }}>confidential deal closing in the next hour.</span></p><br />
                    <p>Please process a <span style={{ color: "#FF4D4D" }}>$50,000 transfer</span> to the account attached in the invoice.</p><br />
                    <p style={{ color: "#FF8C00" }}>Do not call me right now as I'm in a meeting.</p><br />
                    <p>Handle this ASAP.</p><br />
                    <p style={{ color: "#6EC6FF" }}>– CEO</p>
                  </div>

                  {/* Attachment */}
                  <div style={{
                    marginTop: "10px", padding: "8px 12px",
                    background: "#000d1a", border: "2px solid #FF8C00",
                    display: "flex", alignItems: "center", gap: "8px"
                  }}>
                    <AttachIcon size={20} />
                    <span style={{ color: "#FFD700", fontSize: "6px" }}>invoice.pdf</span>
                    <span style={{ color: "#FF4D4D", fontSize: "5px", marginLeft: "auto", animation: "blink 1s infinite" }}>
                      ⚠ UNVERIFIED
                    </span>
                  </div>

                  {/* Link */}
                  <div style={{
                    marginTop: "8px", padding: "6px 12px",
                    background: "#000d1a", border: "2px solid #003049",
                    fontSize: "5px"
                  }}>
                    <span style={{ color: "#6EC6FF" }}>EMBEDDED LINK: </span>
                    <span style={{ color: investigated.includes("link") ? "#FF4D4D" : "#4488aa" }}>
                      {investigated.includes("link") ? "http://secure-payment-update.ru" : "[hover to reveal]"}
                    </span>
                    {investigated.includes("link") && (
                      <span style={{ color: "#FF4D4D", marginLeft: "4px", animation: "blink 0.8s infinite" }}>[⚠ SUSPICIOUS]</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Terminal Log */}
              {terminalLines.length > 0 && (
                <div style={{
                  background: "#000", border: "2px solid #4CAF50",
                  padding: "10px", boxShadow: "0 0 10px rgba(76,175,80,0.3)"
                }}>
                  <div style={{ fontSize: "5px", color: "#4CAF50", marginBottom: "6px" }}>
                    SECURITY TERMINAL —
                  </div>
                  {terminalLines.map((l, i) => (
                    <div key={i} style={{
                      fontSize: "5px", color: l.includes("CRITICAL") || l.includes("ALERT") ? "#FF4D4D" : "#4CAF50",
                      lineHeight: "1.8"
                    }}>{l}</div>
                  ))}
                </div>
              )}
            </div>

            {/* RIGHT — Actions + Reveal */}
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {/* Malware / Shield animations */}
              {malwareActive && (
                <div style={{
                  background: "#1a0000", border: "3px solid #FF4D4D",
                  padding: "14px", textAlign: "center",
                  boxShadow: "0 0 30px rgba(255,77,77,0.6)", animation: "alertPulse 0.5s infinite"
                }}>
                  <div style={{ animation: "malwareSpread 0.8s infinite", display: "inline-block" }}>
                    <BugIcon size={40} />
                  </div>
                  <div style={{ fontSize: "7px", color: "#FF4D4D", marginTop: "8px" }}>MALWARE SPREADING</div>
                  <div style={{ fontSize: "5px", color: "#ff8888", marginTop: "4px" }}>SYSTEM COMPROMISED</div>
                </div>
              )}

              {shieldActive && (
                <div style={{
                  background: "#001a00", border: "3px solid #4CAF50",
                  padding: "14px", textAlign: "center",
                  boxShadow: "0 0 30px rgba(76,175,80,0.5)"
                }}>
                  <div style={{ animation: "shieldPop 0.6s ease forwards, float 2s ease-in-out infinite", display: "inline-block" }}>
                    <ShieldIcon size={48} glow />
                  </div>
                  <div style={{ fontSize: "7px", color: "#4CAF50", marginTop: "8px" }}>THREAT NEUTRALIZED</div>
                </div>
              )}

              {/* Investigation Buttons */}
              <div style={{
                background: "#001a2e", border: "3px solid #6EC6FF",
                boxShadow: "0 0 16px rgba(110,198,255,0.2)"
              }}>
                <div style={{
                  padding: "10px 14px", borderBottom: "2px solid #6EC6FF",
                  background: "#002a44", fontSize: "7px", color: "#6EC6FF"
                }}>
                  🔎 INVESTIGATE
                </div>
                <div style={{ padding: "12px", display: "flex", flexDirection: "column", gap: "8px" }}>
                  {investigations.map(inv => (
                    <button key={inv.id} onClick={() => handleInvestigate(inv)}
                      style={{
                        background: investigated.includes(inv.id) ? "#001a00" : "#000d1a",
                        border: `2px solid ${investigated.includes(inv.id) ? "#4CAF50" : inv.color}`,
                        color: investigated.includes(inv.id) ? "#4CAF50" : inv.color,
                        padding: "8px 12px", fontFamily: "'Press Start 2P', monospace",
                        fontSize: "6px", cursor: investigated.includes(inv.id) ? "default" : "pointer",
                        textAlign: "left", display: "flex", alignItems: "center", gap: "8px",
                        transition: "all 0.2s",
                        boxShadow: `0 0 6px ${inv.color}44`,
                        opacity: investigated.includes(inv.id) ? 0.7 : 1
                      }}>
                      <span style={{ fontSize: "12px" }}>{inv.icon}</span>
                      {investigated.includes(inv.id) ? "✓ " : ""}{inv.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Final Decision Buttons */}
              <div style={{
                background: "#001a2e", border: "3px solid #FFD700",
                boxShadow: "0 0 16px rgba(255,215,0,0.15)"
              }}>
                <div style={{
                  padding: "10px 14px", borderBottom: "2px solid #FFD700",
                  background: "#1a1000", fontSize: "7px", color: "#FFD700"
                }}>
                  ⚡ DECISION
                </div>
                <div style={{ padding: "12px", display: "flex", flexDirection: "column", gap: "8px" }}>
                  <button onClick={handleReport} style={{
                    background: "#001a00", border: "3px solid #4CAF50",
                    color: "#4CAF50", padding: "10px 14px",
                    fontFamily: "'Press Start 2P', monospace", fontSize: "6px",
                    cursor: "pointer", display: "flex", alignItems: "center", gap: "8px",
                    boxShadow: "0 0 10px rgba(76,175,80,0.4)", animation: "healthPulse 2s infinite"
                  }}>
                    <ITIcon size={20} /> REPORT TO IT +20XP
                  </button>
                  <button onClick={handleIgnore} style={{
                    background: "#0d0d00", border: "2px solid #888",
                    color: "#888", padding: "8px 12px",
                    fontFamily: "'Press Start 2P', monospace", fontSize: "6px",
                    cursor: "pointer"
                  }}>
                    👁 IGNORE EMAIL  -5HP
                  </button>
                </div>
              </div>

              {/* Reveal Panel */}
              {activeReveal && (() => {
                const inv = investigations.find(i => i.id === activeReveal);
                const r = inv?.reveal;
                if (!r) return null;
                const borderColor = r.type === "danger" ? "#FF4D4D" : r.type === "warning" ? "#FFD700" : "#4CAF50";
                return (
                  <div style={{
                    background: "#000d1a", border: `3px solid ${borderColor}`,
                    padding: "12px", animation: "slideIn 0.3s ease",
                    boxShadow: `0 0 16px ${borderColor}44`
                  }}>
                    <div style={{ fontSize: "7px", color: borderColor, marginBottom: "8px" }}>{r.title}</div>
                    <div style={{ fontSize: "5px", color: "#a0c8e0", whiteSpace: "pre-line", lineHeight: "2" }}>{r.body}</div>
                    {r.xp && <div style={{ marginTop: "8px", fontSize: "6px", color: "#4CAF50" }}>+{r.xp} XP EARNED</div>}
                  </div>
                );
              })()}
            </div>
          </div>
        )}

        {/* ── RESULT SCREEN ── */}
        {phase === "result" && (
          <div style={{
            position: "relative", zIndex: 5, padding: "30px 16px",
            display: "flex", flexDirection: "column", alignItems: "center", gap: "20px",
            animation: "slideIn 0.5s ease"
          }}>
            <div style={{
              maxWidth: "680px", width: "100%",
              background: "#001a2e", border: `4px solid ${resultData.color}`,
              boxShadow: `0 0 40px ${resultData.color}55`,
              padding: "24px", textAlign: "center"
            }}>
              {/* Result Header */}
              <div style={{ marginBottom: "16px" }}>
                {challengeResult === "success"
                  ? <div style={{ animation: "shieldPop 0.6s ease, float 2s infinite 0.6s", display: "inline-block" }}><ShieldIcon size={56} glow /></div>
                  : <div style={{ animation: "malwareSpread 1s infinite", display: "inline-block" }}><BugIcon size={56} /></div>
                }
              </div>

              <div style={{ fontSize: "11px", color: resultData.color, marginBottom: "8px", textShadow: `0 0 12px ${resultData.color}` }}>
                {resultData.title}
              </div>
              <div style={{ fontSize: "6px", color: "#a0c8e0", marginBottom: "20px" }}>
                {resultData.subtitle}
              </div>

              {/* Stats */}
              <div style={{
                display: "flex", justifyContent: "center", gap: "30px",
                marginBottom: "20px", flexWrap: "wrap"
              }}>
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontSize: "6px", color: "#6EC6FF", marginBottom: "4px" }}>FINAL XP</div>
                  <div style={{ fontSize: "14px", color: "#FFD700", textShadow: "0 0 8px #FFD700" }}>{xp}</div>
                </div>
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontSize: "6px", color: "#6EC6FF", marginBottom: "4px" }}>HEALTH</div>
                  <div style={{ fontSize: "14px", color: healthColor, textShadow: `0 0 8px ${healthColor}` }}>{health}%</div>
                </div>
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontSize: "6px", color: "#6EC6FF", marginBottom: "4px" }}>BADGE</div>
                  <div style={{ fontSize: "7px", color: resultData.color, border: `2px solid ${resultData.color}`, padding: "4px 8px" }}>
                    {resultData.badge}
                  </div>
                </div>
              </div>

              {/* Lessons */}
              <div style={{
                background: "#000d1a", border: "2px solid #003049",
                padding: "16px", textAlign: "left", marginBottom: "20px"
              }}>
                <div style={{ fontSize: "7px", color: "#6EC6FF", marginBottom: "12px" }}>
                  // SECURITY DEBRIEF
                </div>
                {resultData.lessons.map((l, i) => (
                  <div key={i} style={{
                    fontSize: "5px", color: "#a0c8e0", marginBottom: "8px",
                    display: "flex", gap: "8px", lineHeight: "1.8"
                  }}>
                    <span style={{ color: "#4CAF50" }}>▶</span> {l}
                  </div>
                ))}
              </div>

              {/* Attack Type */}
              <div style={{
                background: "#1a0a00", border: "2px solid #FF8C00",
                padding: "12px", marginBottom: "20px"
              }}>
                <div style={{ fontSize: "6px", color: "#FFD700", marginBottom: "6px" }}>ATTACK TYPE IDENTIFIED</div>
                <div style={{ fontSize: "8px", color: "#FF8C00" }}>BUSINESS EMAIL COMPROMISE (BEC)</div>
                <div style={{ fontSize: "5px", color: "#a0c8e0", marginTop: "6px", lineHeight: "1.8" }}>
                  Attackers impersonate executives to trick employees into urgent financial actions.
                </div>
              </div>

              <button
                onClick={() => { setPhase("inbox"); setHealth(70); setXp(0); setInvestigated([]); setActiveReveal(null); setMalwareActive(false); setShieldActive(false); setChallengeResult(null); setTerminalLines([]); }}
                style={{
                  background: "#001a00", border: "3px solid #4CAF50",
                  color: "#4CAF50", padding: "12px 24px",
                  fontFamily: "'Press Start 2P', monospace", fontSize: "7px",
                  cursor: "pointer", boxShadow: "0 0 14px rgba(76,175,80,0.5)",
                  animation: "healthPulse 1.5s infinite"
                }}>
                ▶ PLAY AGAIN
              </button>
            </div>
          </div>
        )}

        {/* ── BOTTOM STATUS BAR ── */}
        <div style={{
          position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 10,
          background: "#001220", borderTop: "2px solid #003049",
          padding: "6px 20px", display: "flex", justifyContent: "space-between", alignItems: "center"
        }}>
          <div style={{ fontSize: "5px", color: "#4CAF50", animation: "blink 2s infinite" }}>
            CYBER DEFENSE ARENA v1.0 — CHALLENGE 1: PHISHING DETECTION
          </div>
          <div style={{ fontSize: "5px", color: "#6EC6FF" }}>
            THREATS BLOCKED: {shieldActive ? 1 : 0} | BREACHES: {malwareActive ? 1 : 0}
          </div>
        </div>

      </div>
    </>
  );
}