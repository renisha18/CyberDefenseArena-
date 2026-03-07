import { useAuth } from "../context/AuthContext";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Scanlines from "../components/Scanlines";
import MatrixRain from "../components/MatrixRain";
import Navbar from "../components/Navbar";
import PixelButton from "../components/PixelButton";
import { ShieldIcon, BugIcon, EmailIcon } from "../components/PixelIcons";
import "../styles/components.css";

// ── Game data ────────────────────────────────────────────────────────────
const INVESTIGATIONS = [
  {
    id: "sender", label: "Check Sender", icon: "🔍", color: "#00f5ff",
    reveal: { title: "⚠ DOMAIN MISMATCH", type: "warning", xp: 5,
      body: "Sender: ceo-support@company-helpdesk.com\nOfficial: ceo@company.com\n\n[!] Domain does NOT match." },
  },
  {
    id: "link", label: "Hover Link", icon: "🔗", color: "#ffd700",
    reveal: { title: "⚠ SUSPICIOUS URL", type: "warning", xp: 5,
      body: "Resolves to:\nhttp://secure-payment-update.ru\n\n[!] External domain. Possible credential harvester." },
  },
  {
    id: "attach", label: "Open Attachment", icon: "📎", color: "#ff2d55",
    reveal: { title: "💀 MALWARE EXECUTED", type: "danger", hp: -10,
      body: "invoice.pdf contained an embedded macro.\nTrojan deployed. Keylogger active.\n\n[-10 HP — System compromised]" },
  },
  {
    id: "reply", label: "Reply to Email", icon: "↩", color: "#ff8c00",
    reveal: { title: "⚠ SOCIAL ENGINEERING", type: "warning", hp: -5,
      body: 'Scammer: "Send your banking credentials\nand network password to finalize."\n\n[-5 HP — Attacker escalating]' },
  },
];

const RESULT_DATA = {
  success: {
    title: "🛡 ATTACK BLOCKED!", sub: "Business Email Compromise Neutralized", color: "#39ff14",
    badge: "PHISHING HUNTER",
    lessons: [
      "Urgency is a manipulation tactic — slow down",
      "Verify sender domain against company records",
      "Report suspicious emails to your IT team",
      "Attachments from strangers carry malware",
    ],
  },
  fail: {
    title: "💀 BREACH DETECTED", sub: "Malware executed via malicious attachment", color: "#ff2d55",
    badge: "LESSON LEARNED",
    lessons: [
      "PDFs can embed executable code",
      "Urgency tactics force hasty decisions",
      "Always verify sender before opening attachments",
      "Report to IT — never investigate alone",
    ],
  },
};

// ── XP Popup ────────────────────────────────────────────────────────────
function XPPopup({ amount, onDone }) {
  useEffect(() => { const t = setTimeout(onDone, 1200); return () => clearTimeout(t); }, []);
  return (
    <div className="xp-popup" style={{ color: amount > 0 ? "#39ff14" : "#ff2d55", textShadow: `0 0 14px ${amount > 0 ? "#39ff14" : "#ff2d55"}` }}>
      {amount > 0 ? `+${amount} XP` : `${amount} HP`}
    </div>
  );
}

// ── Inbox screen ─────────────────────────────────────────────────────────
function InboxScreen({ onOpen }) {
  const [blink, setBlink] = useState(true);
  useEffect(() => { const iv = setInterval(() => setBlink((p) => !p), 700); return () => clearInterval(iv); }, []);
  return (
    <div className="inbox">
      <div className="inbox__briefing">
        <div className="inbox__briefing-label">// SYSTEM BRIEFING</div>
        <div className="inbox__briefing-body">
          You are monitoring the company's internal email system.<br />
          A message arrives marked as{" "}
          <span style={{ color: "#ff2d55" }}>URGENT</span>. Investigate before acting.
        </div>
      </div>
      <div className="inbox__panel">
        <div className="inbox__panel-header">
          <EmailIcon size={16} />
          <span className="inbox__panel-title">INBOX — 1 NEW MESSAGE</span>
        </div>
        <div
          className="inbox__row"
          onClick={onOpen}
          style={{ background: blink ? "#001e36" : "#001530" }}
        >
          <EmailIcon size={22} alert />
          <div style={{ flex: 1 }}>
            <div className="inbox__row-from">[URGENT] ceo-support@company-helpdesk.com</div>
            <div className="inbox__row-subject">Need Payment Processed Immediately</div>
          </div>
          <div style={{ animation: "blink 1s infinite", fontSize: "20px" }}>⚠</div>
        </div>
      </div>
      <div className="inbox__cta">▶ CLICK EMAIL TO OPEN</div>
    </div>
  );
}

// ── Reading screen ────────────────────────────────────────────────────────
function ReadingScreen({ investigated, onInvestigate, malware, shield, onReport, onIgnore, activeReveal, termLog }) {
  const revealInv = INVESTIGATIONS.find((i) => i.id === activeReveal);
  const r = revealInv?.reveal;
  const borderColor = r?.type === "danger" ? "#ff2d55" : r?.type === "warning" ? "#ffd700" : "#39ff14";

  return (
    <div className="challenge__grid">
      {/* LEFT: email content */}
      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        <div className="challenge__panel" style={{ animation: "slideIn .3s ease" }}>
          <div className="challenge__panel-header">
            <EmailIcon size={14} alert /> EMAIL CONTENT
          </div>
          <div className="challenge__panel-body">
            <div style={{ marginBottom: "8px" }}>
              <span style={{ color: "#00f5ff" }}>FROM: </span>
              <span style={{ color: investigated.includes("sender") ? "#ff2d55" : "#fff" }}>
                ceo-support@company-helpdesk.com
              </span>
              {investigated.includes("sender") && (
                <span style={{ color: "#ff2d55", marginLeft: "4px", animation: "blink .8s infinite" }}>[⚠ MISMATCH]</span>
              )}
            </div>
            <div style={{ marginBottom: "10px" }}>
              <span style={{ color: "#00f5ff" }}>SUBJECT: </span>
              <span style={{ color: "#ffd700" }}>URGENT: Need Payment Processed Immediately</span>
            </div>
            <div className="challenge__email-body">
              <p>Hi,</p><br />
              <p>We have a <span style={{ color: "#ff2d55" }}>confidential deal closing in the next hour.</span></p><br />
              <p>Please process a <span style={{ color: "#ff2d55" }}>$50,000 transfer</span> to the account in the attached invoice.</p><br />
              <p style={{ color: "#ff8c00" }}>Do not call me — I'm in a meeting.</p><br />
              <p>Handle this ASAP.</p><br />
              <p style={{ color: "#00f5ff" }}>– CEO</p>
            </div>
            <div className="challenge__attachment">
              <span style={{ fontSize: "16px" }}>📎</span>
              <span style={{ color: "#ffd700", fontFamily: "var(--pixel)", fontSize: "6px" }}>invoice.pdf</span>
              <span style={{ color: "#ff2d55", fontFamily: "var(--pixel)", fontSize: "5px", marginLeft: "auto", animation: "blink 1s infinite" }}>⚠ UNVERIFIED</span>
            </div>
            <div className="challenge__link">
              <span style={{ color: "#00f5ff", fontFamily: "var(--pixel)", fontSize: "5px" }}>EMBEDDED LINK: </span>
              <span style={{ color: investigated.includes("link") ? "#ff2d55" : "#4488aa", fontFamily: "var(--pixel)", fontSize: "5px" }}>
                {investigated.includes("link") ? "http://secure-payment-update.ru" : "[hover to reveal]"}
              </span>
              {investigated.includes("link") && (
                <span style={{ color: "#ff2d55", fontFamily: "var(--pixel)", fontSize: "5px", marginLeft: "4px", animation: "blink .8s infinite" }}>[⚠ SUSPICIOUS]</span>
              )}
            </div>
          </div>
        </div>

        {/* Terminal log */}
        {termLog.length > 0 && (
          <div className="challenge__terminal">
            <div className="challenge__terminal-title">SECURITY TERMINAL</div>
            {termLog.map((line, i) => (
              <div key={i} className="challenge__terminal-line"
                style={{ color: line.includes("CRITICAL") || line.includes("ALERT") ? "#ff2d55" : "#39ff14" }}>
                {line}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* RIGHT: actions */}
      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        {/* Malware / Shield animations */}
        {malware && (
          <div className="challenge__malware">
            <div style={{ animation: "malwareSpread .8s infinite", display: "inline-block" }}>
              <BugIcon size={40} />
            </div>
            <div className="challenge__anim-label" style={{ color: "#ff2d55" }}>MALWARE SPREADING</div>
          </div>
        )}
        {shield && (
          <div className="challenge__shield">
            <div style={{ animation: "shieldPop .6s ease forwards, float 2s ease-in-out infinite", display: "inline-block" }}>
              <ShieldIcon size={48} glow />
            </div>
            <div className="challenge__anim-label" style={{ color: "#39ff14" }}>THREAT NEUTRALIZED</div>
          </div>
        )}

        {/* Investigate */}
        <div className="challenge__panel">
          <div className="challenge__panel-header">🔎 INVESTIGATE</div>
          <div style={{ padding: "10px", display: "flex", flexDirection: "column", gap: "7px" }}>
            {INVESTIGATIONS.map((inv) => {
              const done = investigated.includes(inv.id);
              return (
                <button key={inv.id} onClick={() => onInvestigate(inv)}
                  className={`challenge__inv-btn ${done ? "challenge__inv-btn--done" : ""}`}
                  style={{
                    border: `2px solid ${done ? "#39ff14" : inv.color}`,
                    color: done ? "#39ff14" : inv.color,
                    boxShadow: `0 0 5px ${inv.color}33`,
                  }}>
                  <span style={{ fontSize: "12px" }}>{inv.icon}</span>
                  {done ? "✓ " : ""}{inv.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Decision */}
        <div className="challenge__actions-panel">
          <div className="challenge__actions-header">⚡ DECISION</div>
          <div style={{ padding: "10px", display: "flex", flexDirection: "column", gap: "8px" }}>
            <button className="pixel-btn pixel-btn--report" onClick={onReport}>
              🛡 REPORT TO IT &nbsp;+20XP
            </button>
            <PixelButton text="👁 IGNORE EMAIL  −5HP" type="secondary" onClick={onIgnore} />
          </div>
        </div>

        {/* Reveal panel */}
        {r && (
          <div className="challenge__reveal" style={{ border: `3px solid ${borderColor}`, boxShadow: `0 0 14px ${borderColor}44` }}>
            <div className="challenge__reveal-title" style={{ color: borderColor }}>{r.title}</div>
            <div className="challenge__reveal-body">{r.body}</div>
            {r.xp && <div className="challenge__reveal-xp">+{r.xp} XP EARNED</div>}
          </div>
        )}
      </div>
    </div>
  );
}

// ── Result screen ─────────────────────────────────────────────────────────
function ResultScreen({ result, xp, health, onReturnToBase, onReplay }) {
  const data = RESULT_DATA[result];
  const healthColor = health > 60 ? "#39ff14" : health > 30 ? "#ffd700" : "#ff2d55";

  return (
    <div className="challenge__result">
      <div className="challenge__result-card"
        style={{ border: `4px solid ${data.color}`, boxShadow: `0 0 40px ${data.color}44` }}>
        {/* Icon */}
        <div style={{ marginBottom: "14px" }}>
          {result === "success"
            ? <div style={{ animation: "shieldPop .6s ease, float 2s infinite .6s", display: "inline-block" }}><ShieldIcon size={54} glow /></div>
            : <div style={{ animation: "malwareSpread 1s infinite", display: "inline-block" }}><BugIcon size={54} /></div>}
        </div>

        <div className="challenge__result-title" style={{ color: data.color, textShadow: `0 0 12px ${data.color}` }}>
          {data.title}
        </div>
        <div className="challenge__result-sub">{data.sub}</div>

        {/* Stats */}
        <div className="challenge__result-stats">
          {[
            { label: "FINAL XP", val: xp,        color: "#ffd700"   },
            { label: "HEALTH",   val: `${health}%`, color: healthColor },
            { label: "BADGE",    val: data.badge, color: data.color  },
          ].map((s) => (
            <div key={s.label} style={{ textAlign: "center" }}>
              <div className="challenge__result-stat-label">{s.label}</div>
              <div className="challenge__result-stat-val"
                style={{
                  color: s.color, textShadow: `0 0 8px ${s.color}`,
                  fontSize: s.label === "BADGE" ? "7px" : "13px",
                  border: s.label === "BADGE" ? `2px solid ${s.color}` : "none",
                  padding: s.label === "BADGE" ? "4px 8px" : 0,
                }}>
                {s.val}
              </div>
            </div>
          ))}
        </div>

        {/* Lessons */}
        <div className="challenge__debrief">
          <div className="challenge__debrief-title">// SECURITY DEBRIEF</div>
          {data.lessons.map((l, i) => (
            <div key={i} className="challenge__debrief-line">
              <span>▶</span>{l}
            </div>
          ))}
        </div>

        {/* Attack type */}
        <div className="challenge__attack-box">
          <div className="challenge__attack-label">ATTACK TYPE IDENTIFIED</div>
          <div className="challenge__attack-name">BUSINESS EMAIL COMPROMISE (BEC)</div>
          <div className="challenge__attack-desc">
            Attackers impersonate executives to force urgent financial actions.
          </div>
        </div>

        <div className="challenge__result-btns">
          <PixelButton
            text="✓ RETURN TO BASE"
            type="primary"
            style={{ background: "#39ff14", color: "#0a0e1a", boxShadow: "0 0 20px rgba(57,255,20,.6)" }}
            onClick={onReturnToBase}
          />
          <PixelButton text="↺ REPLAY" type="back" onClick={onReplay} />
        </div>
      </div>
    </div>
  );
}

// ── ChallengePage root ────────────────────────────────────────────────────
// CHALLENGE_ID = 1 → Phishing Detection (seeded in DB)
const CHALLENGE_ID = 1;

export default function ChallengePage() {
  const navigate           = useNavigate();
  const { user, updateStats } = useAuth();

  const [phase,        setPhase]        = useState("inbox");
  const [health,       setHealth]       = useState(user?.healthScore ?? 70);
  const [xp,           setXp]           = useState(user?.xp          ?? 0);
  const [investigated, setInvestigated] = useState([]);
  const [activeReveal, setActiveReveal] = useState(null);
  const [malware,      setMalware]      = useState(false);
  const [shield,       setShield]       = useState(false);
  const [result,       setResult]       = useState(null);
  const [popup,        setPopup]        = useState(null);
  const [termLog,      setTermLog]      = useState([]);
  const [backendMsg,   setBackendMsg]   = useState("");

  const clamp   = (v) => Math.max(0, Math.min(100, v));
  const showPop = (n) => setPopup({ n });
  const addLog  = (l) => setTermLog((p) => [...p.slice(-6), l]);

  const handleInvestigate = (inv) => {
    if (investigated.includes(inv.id)) return;
    setInvestigated((p) => [...p, inv.id]);
    setActiveReveal(inv.id);
    if (inv.reveal.xp) { setXp((p) => p + inv.reveal.xp); showPop(inv.reveal.xp); }
    if (inv.reveal.hp) { setHealth((p) => clamp(p + inv.reveal.hp)); showPop(inv.reveal.hp); }
    if (inv.id === "attach") {
      setMalware(true);
      addLog("[CRITICAL] Malware payload executing...");
      addLog("[ALERT] Keylogger installed on WORKSTATION-07");
      setTimeout(() => { setResult("fail"); setPhase("result"); }, 2000);
    }
  };

  // On "Report to IT" — tells the backend to persist the completion
  const handleReport = async () => {
    setShield(true);
    setMalware(false);
    addLog("[SUCCESS] Phishing report filed. Sender blacklisted.");

    try {
      const apiModule = await import("../services/api");
      const ax = apiModule.default;
      const { data } = await ax.post("/challenges/complete", { challengeId: CHALLENGE_ID });

      // Sync UI with backend-confirmed values
      setHealth(data.player.healthScore);
      setXp(data.player.xp);
      showPop(data.xpReward);
      addLog(`[DB] Saved ✓  Streak: ${data.streak} day${data.streak !== 1 ? "s" : ""}`);

      // Update the global auth context so Dashboard reflects new stats
      updateStats({
        healthScore: data.player.healthScore,
        xp:          data.player.xp,
        streak:      data.player.streak,
      });
    } catch (err) {
      // Graceful fallback — game still shows success locally
      setHealth((p) => clamp(p + 10));
      setXp((p) => p + 20);
      showPop(20);
      setBackendMsg(err.message || "");
    }

    setTimeout(() => { setResult("success"); setPhase("result"); }, 1500);
  };

  const handleIgnore = () => {
    setHealth((p) => clamp(p - 5));
    showPop(-5);
    addLog("[WARN] Threat ignored — risk unaddressed.");
  };

  const handleReturnToBase = () => navigate("/main");

  const handleReplay = () => {
    setPhase("inbox");
    setHealth(user?.healthScore ?? 70);
    setXp(user?.xp ?? 0);
    setInvestigated([]);
    setActiveReveal(null);
    setMalware(false);
    setShield(false);
    setResult(null);
    setTermLog([]);
    setBackendMsg("");
  };

  return (
    <div className="challenge">
      <MatrixRain opacity={0.05} />
      <Scanlines />
      {popup && <XPPopup amount={popup.n} onDone={() => setPopup(null)} />}

      <Navbar onBack={() => navigate("/main")} health={health} xp={xp} />

      {phase === "inbox" && <InboxScreen onOpen={() => setPhase("reading")} />}
      {phase === "reading" && (
        <ReadingScreen
          investigated={investigated}
          onInvestigate={handleInvestigate}
          malware={malware}
          shield={shield}
          onReport={handleReport}
          onIgnore={handleIgnore}
          activeReveal={activeReveal}
          termLog={termLog}
        />
      )}
      {phase === "result" && (
        <ResultScreen
          result={result}
          xp={xp}
          health={health}
          onReturnToBase={handleReturnToBase}
          onReplay={handleReplay}
        />
      )}

      <div className="challenge__bottombar">
        <div className="challenge__bottombar-label">
          CYBERDEFENSE ARENA — CHALLENGE 1: PHISHING DETECTION
        </div>
        <div className="challenge__bottombar-stats">
          THREATS BLOCKED: {shield ? 1 : 0} | BREACHES: {malware ? 1 : 0}
          {backendMsg && <span style={{ color: "#ffd700", marginLeft: "12px" }}>⚠ {backendMsg}</span>}
        </div>
      </div>
    </div>
  );
}
