// ── src/pages/TrainingPage.jsx ────────────────────────────────────────────
// Module hub — shows all training modules with live status from the backend.
// Completed = green, unlocked = playable, locked = greyed out.

import { useState, useEffect } from "react";
import { useNavigate }         from "react-router-dom";
import { useAuth }             from "../context/AuthContext";
import api                     from "../services/api";
import Scanlines               from "../components/Scanlines";
import MatrixRain              from "../components/MatrixRain";
import { SmallLogo }           from "../components/PixelIcons";

// Static module registry — extend as new modules are built
const MODULE_REGISTRY = [
  {
    id:          1,
    dbId:        1,       // challenges.id in DB
    title:       "PHISHING DETECTION",
    subtitle:    "Identify and report malicious emails",
    icon:        "📧",
    color:       "#00f5ff",
    route:       "/challenge/phishing/1",
    scenarios:   5,
    category:    "phishing",
    topics:      ["BEC attacks", "Lookalike domains", "Malicious attachments", "Spear phishing", "AiTM / MFA bypass"],
  },
  {
    id:          2,
    dbId:        4,       // "Password Security" in DB (level 4)
    title:       "PASSWORD SECURITY",
    subtitle:    "Audit, strengthen, and protect credentials",
    icon:        "🔐",
    color:       "#ffd700",
    route:       "/challenge/password/1",
    scenarios:   5,
    category:    "password",
    topics:      ["Strong passwords", "Credential stuffing", "Password managers", "Account audit", "MFA fatigue"],
  },
  {
    id:          3,
    dbId:        2,
    title:       "SOCIAL ENGINEERING",
    subtitle:    "Resist manipulation and pretexting",
    icon:        "🎭",
    color:       "#ff8c00",
    route:       "/challenge/social/1",
    scenarios:   5,
    category:    "social_engineering",
    topics:      ["Vishing", "Baiting (USB)", "Impersonation", "Tailgating", "Multi-vector attack"],
  },
  {
    id:          4,
    dbId:        3,
    title:       "MALWARE RECOGNITION",
    subtitle:    "Detect, isolate, and neutralise threats",
    icon:        "🦠",
    color:       "#ff2d55",
    route:       "/challenge/malware/1",
    scenarios:   5,
    category:    "malware",
    topics:      ["Process masquerading", "SIEM analysis", "Ransomware response", "C2 beacon detection", "IR sequencing"],
  },
  {
    id:          5,
    dbId:        5,
    title:       "NETWORK INTRUSION",
    subtitle:    "Monitor, detect, and block network attacks",
    icon:        "🌐",
    color:       "#39ff14",
    route:       "/challenge/network/1",
    scenarios:   5,
    category:    "network",
    topics:      ["Port scanning", "Man-in-the-middle", "DNS poisoning", "DDoS response", "Lateral movement"],
    comingSoon:  true,
  },
];

export default function TrainingPage() {
  const navigate             = useNavigate();
  const { user }             = useAuth();
  const [challenges, setChallenges] = useState([]);
  const [loading,    setLoading]    = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const { data } = await api.get("/challenges");
        setChallenges(data);
      } catch { /* use empty — modules still render with "locked" state */ }
      finally { setLoading(false); }
    }
    load();
  }, []);

  // Map DB challenge status → module status
  function getModuleStatus(mod) {
    if (mod.comingSoon) return "coming-soon";
    const dbEntry = challenges.find((c) => c.id === mod.dbId);
    if (!dbEntry) return "locked";
    return dbEntry.status; // "completed" | "unlocked" | "locked"
  }

  const STATUS_CONFIG = {
    completed:    { label: "COMPLETED",   icon: "✓",  labelColor: "#39ff14", playLabel: "REPLAY",       canPlay: true  },
    unlocked:     { label: "AVAILABLE",   icon: "▶",  labelColor: "#ffd700", playLabel: "START",         canPlay: true  },
    locked:       { label: "LOCKED",      icon: "🔒", labelColor: "#444",    playLabel: "LOCKED",        canPlay: false },
    "coming-soon":{ label: "COMING SOON", icon: "⏳", labelColor: "#555",    playLabel: "COMING SOON",  canPlay: false },
  };

  const completedCount = challenges.filter((c) => c.status === "completed").length;
  const totalModules   = MODULE_REGISTRY.filter((m) => !m.comingSoon).length;

  return (
    <div style={{
      width: "100vw", minHeight: "100vh", background: "#0a0e1a",
      position: "relative", overflow: "auto",
    }}>
      <MatrixRain opacity={0.04} />
      <Scanlines />

      {/* Top bar */}
      <div style={{
        position: "sticky", top: 0, zIndex: 30,
        background: "linear-gradient(90deg,#0a0e1a,#0d1b2e,#0a0e1a)",
        borderBottom: "2px solid rgba(0,245,255,.2)",
        padding: "8px 20px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <button onClick={() => navigate("/main")} style={{
            fontFamily: "var(--pixel)", fontSize: "6px", color: "#00f5ff",
            background: "transparent", border: "1px solid rgba(0,245,255,.3)",
            padding: "5px 10px", cursor: "pointer",
          }}>◀ BASE</button>
          <SmallLogo />
          <span style={{ fontFamily: "var(--pixel)", fontSize: "7px", color: "#00f5ff" }}>
            TRAINING ACADEMY
          </span>
        </div>
        <div style={{ fontFamily: "var(--pixel)", fontSize: "5px", color: "rgba(0,245,255,.4)" }}>
          {loading ? "LOADING..." : `${completedCount} / ${totalModules} MODULES COMPLETE`}
        </div>
      </div>

      <div style={{ maxWidth: "780px", margin: "0 auto", padding: "24px 16px", position: "relative", zIndex: 5 }}>

        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "28px" }}>
          <div style={{ fontFamily: "var(--pixel)", fontSize: "12px", color: "#00f5ff", textShadow: "0 0 16px #00f5ff", marginBottom: "8px" }}>
            📡 TRAINING MODULES
          </div>
          <div style={{ fontFamily: "var(--pixel)", fontSize: "5px", color: "rgba(0,245,255,.45)", lineHeight: "2" }}>
            Each module contains 5 real-world scenarios in increasing difficulty.<br />
            Complete modules in sequence to unlock the next challenge.
          </div>
        </div>

        {/* Overall progress bar */}
        {!loading && (
          <div style={{ marginBottom: "24px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontFamily: "var(--pixel)", fontSize: "5px", color: "rgba(0,245,255,.5)", marginBottom: "5px" }}>
              <span>OVERALL PROGRESS</span>
              <span style={{ color: "#39ff14" }}>{Math.round((completedCount / Math.max(totalModules, 1)) * 100)}%</span>
            </div>
            <div style={{ height: "8px", background: "#000", border: "1px solid rgba(0,245,255,.2)" }}>
              <div style={{
                height: "100%", background: "#39ff14",
                width: `${(completedCount / Math.max(totalModules, 1)) * 100}%`,
                transition: "width .5s", boxShadow: "0 0 6px #39ff14",
              }} />
            </div>
          </div>
        )}

        {/* Module cards */}
        <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          {MODULE_REGISTRY.map((mod) => {
            const status = getModuleStatus(mod);
            const cfg    = STATUS_CONFIG[status];

            return (
              <div key={mod.id} style={{
                background:  "#0d1b2e",
                border:      `2px solid ${status === "locked" || status === "coming-soon" ? "rgba(30,58,95,.6)" : mod.color}`,
                boxShadow:   status !== "locked" && status !== "coming-soon" ? `0 0 12px ${mod.color}22` : "none",
                opacity:     status === "locked" || status === "coming-soon" ? 0.55 : 1,
                transition:  "all .2s",
                animation:   "float-up .3s ease",
              }}>
                {/* Card header */}
                <div style={{
                  padding: "12px 16px",
                  borderBottom: "1px solid rgba(0,245,255,.1)",
                  background: "rgba(0,0,0,.3)",
                  display: "flex", alignItems: "center", gap: "12px",
                }}>
                  <span style={{ fontSize: "22px" }}>{mod.icon}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontFamily: "var(--pixel)", fontSize: "8px", color: mod.color, textShadow: `0 0 8px ${mod.color}` }}>
                      MODULE {mod.id}: {mod.title}
                    </div>
                    <div style={{ fontFamily: "var(--pixel)", fontSize: "5px", color: "rgba(0,245,255,.5)", marginTop: "4px" }}>
                      {mod.subtitle}
                    </div>
                  </div>
                  {/* Status badge */}
                  <div style={{
                    fontFamily: "var(--pixel)", fontSize: "5px",
                    color: cfg.labelColor, border: `1px solid ${cfg.labelColor}`,
                    padding: "4px 8px", letterSpacing: "1px",
                    boxShadow: cfg.labelColor !== "#444" && cfg.labelColor !== "#555"
                      ? `0 0 6px ${cfg.labelColor}44` : "none",
                  }}>
                    {cfg.icon} {cfg.label}
                  </div>
                </div>

                {/* Card body */}
                <div style={{ padding: "14px 16px", display: "flex", alignItems: "center", gap: "16px" }}>
                  {/* Topics */}
                  <div style={{ flex: 1, display: "flex", flexWrap: "wrap", gap: "5px" }}>
                    {mod.topics.map((topic, i) => (
                      <span key={i} style={{
                        fontFamily: "var(--pixel)", fontSize: "4px",
                        color: "rgba(0,245,255,.5)", border: "1px solid rgba(0,245,255,.15)",
                        padding: "3px 6px", letterSpacing: "1px",
                      }}>
                        {topic}
                      </span>
                    ))}
                  </div>

                  {/* Scenarios count + play button */}
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "8px" }}>
                    <div style={{ fontFamily: "var(--pixel)", fontSize: "5px", color: "rgba(0,245,255,.4)" }}>
                      {mod.scenarios} SCENARIOS
                    </div>
                    <button
                      onClick={() => cfg.canPlay && navigate(mod.route)}
                      disabled={!cfg.canPlay}
                      style={{
                        fontFamily: "var(--pixel)", fontSize: "6px",
                        color:      cfg.canPlay ? "#0a0e1a" : "#555",
                        background: cfg.canPlay ? mod.color  : "transparent",
                        border:     `2px solid ${cfg.canPlay ? mod.color : "#333"}`,
                        padding:    "9px 18px",
                        cursor:     cfg.canPlay ? "pointer" : "not-allowed",
                        boxShadow:  cfg.canPlay ? `0 0 12px ${mod.color}55` : "none",
                        transition: "all .15s", letterSpacing: "1px",
                      }}
                    >
                      {cfg.playLabel} {cfg.canPlay ? "▶" : ""}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Agent stats footer */}
        {user && (
          <div style={{
            marginTop: "28px", padding: "14px 18px",
            background: "rgba(13,27,46,.8)", border: "1px solid rgba(0,245,255,.15)",
            display: "flex", justifyContent: "space-around", flexWrap: "wrap", gap: "14px",
          }}>
            {[
              { label: "AGENT",   val: user.username?.toUpperCase(), color: "#00f5ff" },
              { label: "HP",      val: `${user.healthScore ?? 70}/100`, color: user.healthScore >= 70 ? "#39ff14" : "#ff2d55" },
              { label: "XP",      val: user.xp ?? 0,  color: "#ffd700" },
              { label: "STREAK",  val: `${user.streak ?? 0} DAYS`, color: "#ff8c00" },
            ].map((s) => (
              <div key={s.label} style={{ textAlign: "center" }}>
                <div style={{ fontFamily: "var(--pixel)", fontSize: "4px", color: "rgba(0,245,255,.4)", marginBottom: "4px" }}>{s.label}</div>
                <div style={{ fontFamily: "var(--pixel)", fontSize: "8px", color: s.color, textShadow: `0 0 6px ${s.color}` }}>{s.val}</div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
