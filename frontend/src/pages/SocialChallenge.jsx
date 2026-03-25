// ── src/modules/social/pages/SocialChallenge.jsx ─────────────────────────
// Route: /challenge/social/:level
// Renders different scenario types: call transcript, chat, physical, email-chain.
// DB submit fires once on level 5 correct answer.

import { useState, useEffect }    from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth }                from "../context/AuthContext";
import { useModuleSubmit }        from "../hooks/useModuleSubmit";
import Scanlines                  from "../components/Scanlines";
import MatrixRain                 from "../components/MatrixRain";
import { SmallLogo }              from "../components/PixelIcons";
import SOCIAL_LEVELS, {
  getLevelData,
  TOTAL_LEVELS,
  DB_CHALLENGE_ID,
} from "../modules/social/data/socialLevels";

const STATS = [
  "98% of cyber attacks rely on social engineering.",
  "The average social engineering attack costs $130,000.",
  "Vishing calls have a 47% success rate when targeting employees.",
  "Physical baiting attacks succeed 60% of the time in penetration tests.",
  "Executive impersonation fraud has grown 270% in three years.",
  "It takes an average of 196 days to identify a social engineering breach.",
];
const pickStat = () => STATS[Math.floor(Math.random() * STATS.length)];

// ── Scenario renderers ────────────────────────────────────────────────────

function CallScenario({ level }) {
  return (
    <div style={{
      background: "#0d1b2e", border: "2px solid rgba(0,245,255,.2)",
      animation: "float-up .4s ease",
    }}>
      {/* Phone chrome */}
      <div style={{
        padding: "10px 14px", background: "rgba(0,0,0,.4)",
        borderBottom: "1px solid rgba(0,245,255,.15)",
        display: "flex", alignItems: "center", gap: "10px",
      }}>
        <span style={{ fontSize: "18px" }}>📞</span>
        <div>
          <div style={{ fontFamily: "var(--pixel)", fontSize: "7px", color: "#39ff14" }}>INCOMING CALL</div>
          <div style={{ fontFamily: "var(--pixel)", fontSize: "5px", color: "rgba(0,245,255,.6)", marginTop: "3px" }}>
            {level.callerId}
          </div>
        </div>
        <div style={{ marginLeft: "auto", fontFamily: "var(--pixel)", fontSize: "5px", color: "#ff2d55", animation: "blink 1s infinite" }}>
          ● LIVE
        </div>
      </div>
      {/* Transcript */}
      <div style={{ padding: "14px", display: "flex", flexDirection: "column", gap: "10px", maxHeight: "340px", overflowY: "auto" }}>
        {level.transcript.map((line, i) => (
          <div key={i} style={{
            display: "flex", gap: "10px",
            justifyContent: line.speaker === "YOU" ? "flex-end" : "flex-start",
          }}>
            {line.speaker !== "YOU" && (
              <div style={{
                width: "28px", height: "28px", background: "#1e3a5f",
                border: "1px solid #00f5ff", borderRadius: "2px",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "14px", flexShrink: 0,
              }}>👤</div>
            )}
            <div style={{
              maxWidth: "70%", padding: "8px 12px",
              background: line.speaker === "YOU" ? "rgba(0,245,255,.08)" : "rgba(255,45,85,.06)",
              border: `1px solid ${line.speaker === "YOU" ? "rgba(0,245,255,.2)" : "rgba(255,45,85,.2)"}`,
            }}>
              <div style={{ fontFamily: "var(--pixel)", fontSize: "4px", color: line.speaker === "YOU" ? "#00f5ff" : "#ff8c00", marginBottom: "4px" }}>
                {line.speaker}
              </div>
              <div style={{ fontFamily: "var(--pixel)", fontSize: "5px", color: "#c8e0f0", lineHeight: "1.9" }}>
                {line.text}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ChatScenario({ level }) {
  return (
    <div style={{
      background: "#0d1b2e", border: "2px solid rgba(57,255,20,.2)",
      animation: "float-up .4s ease",
    }}>
      <div style={{
        padding: "10px 14px", background: "rgba(0,0,0,.4)",
        borderBottom: "1px solid rgba(57,255,20,.15)",
        display: "flex", alignItems: "center", gap: "10px",
      }}>
        <span style={{ fontSize: "18px" }}>💬</span>
        <div style={{ fontFamily: "var(--pixel)", fontSize: "6px", color: "#39ff14" }}>
          {level.chatFrom}
        </div>
        <div style={{ marginLeft: "auto", fontFamily: "var(--pixel)", fontSize: "4px", color: "#39ff14", animation: "blink 1s infinite" }}>
          ● ONLINE
        </div>
      </div>
      <div style={{ padding: "14px", display: "flex", flexDirection: "column", gap: "10px", maxHeight: "340px", overflowY: "auto" }}>
        {level.messages.map((msg, i) => (
          <div key={i} style={{
            display: "flex", gap: "8px",
            justifyContent: msg.speaker === "YOU" ? "flex-end" : "flex-start",
          }}>
            <div style={{
              maxWidth: "75%", padding: "8px 12px",
              background: msg.speaker === "YOU" ? "rgba(0,245,255,.08)" : "rgba(13,27,46,.8)",
              border: `1px solid ${msg.speaker === "YOU" ? "rgba(0,245,255,.2)" : "rgba(30,58,95,.6)"}`,
            }}>
              <div style={{ fontFamily: "var(--pixel)", fontSize: "4px", color: "#39ff14", marginBottom: "4px" }}>
                {msg.speaker}
              </div>
              <div style={{ fontFamily: "var(--pixel)", fontSize: "5px", color: "#c8e0f0", lineHeight: "1.9" }}>
                {msg.text}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function PhysicalScenario({ level }) {
  return (
    <div style={{
      background: "#0d1b2e", border: "2px solid rgba(255,140,0,.25)",
      animation: "float-up .4s ease", padding: "20px 22px",
    }}>
      <div style={{ display: "flex", alignItems: "flex-start", gap: "16px" }}>
        <span style={{ fontSize: "40px", filter: "drop-shadow(0 0 8px #ff8c00)" }}>🏢</span>
        <div>
          <div style={{ fontFamily: "var(--pixel)", fontSize: "6px", color: "#ff8c00", marginBottom: "10px", textShadow: "0 0 8px #ff8c00" }}>
            PHYSICAL SCENARIO
          </div>
          <div style={{
            fontFamily: "var(--pixel)", fontSize: "5.5px", color: "#a8c8e0",
            lineHeight: "2.2", background: "#000d1a",
            border: "1px solid rgba(0,245,255,.15)", padding: "14px 16px",
          }}>
            {level.scenario}
          </div>
        </div>
      </div>
    </div>
  );
}

function EmailChainScenario({ level }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "8px", animation: "float-up .4s ease" }}>
      {level.emailChain.map((email, i) => (
        <div key={i} style={{
          background: "#0d1b2e", border: "2px solid rgba(0,245,255,.2)",
        }}>
          <div style={{
            padding: "8px 14px", background: "rgba(0,0,0,.3)",
            borderBottom: "1px solid rgba(0,245,255,.1)",
            display: "flex", alignItems: "center", gap: "8px",
          }}>
            <span style={{ fontSize: "12px" }}>📧</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: "var(--pixel)", fontSize: "5px", color: "#ff2d55" }}>{email.from}</div>
              <div style={{ fontFamily: "var(--pixel)", fontSize: "5px", color: "#ffd700", marginTop: "2px" }}>{email.subject}</div>
            </div>
            <div style={{ fontFamily: "var(--pixel)", fontSize: "4px", color: "rgba(0,245,255,.3)" }}>
              EMAIL {i + 1}
            </div>
          </div>
          <div style={{
            padding: "10px 14px", fontFamily: "var(--pixel)", fontSize: "5px",
            color: "#a8c8e0", lineHeight: "2", whiteSpace: "pre-wrap",
          }}>
            {email.body}
          </div>
        </div>
      ))}
    </div>
  );
}

// ── Choice options (shared) ───────────────────────────────────────────────
function ChoiceOptions({ level, onSubmit, disabled }) {
  const [selected, setSelected] = useState(null);
  const [revealed, setRevealed] = useState(false);

  function handleSubmit() {
    if (!selected || revealed) return;
    setRevealed(true);
    onSubmit(selected === level.correctId, selected);
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
      <div style={{ fontFamily: "var(--pixel)", fontSize: "5px", color: "rgba(0,245,255,.5)", padding: "6px 0", letterSpacing: "1px" }}>
        // WHAT DO YOU DO?
      </div>
      {level.options.map((opt) => {
        const isChosen  = selected === opt.id;
        const isCorrect = opt.id === level.correctId;
        let borderColor = "rgba(0,245,255,.2)";
        let bgColor     = "#000d1a";
        let textColor   = "#c8e0f0";
        if (revealed) {
          if (isChosen && isCorrect)  { borderColor = "#39ff14"; bgColor = "rgba(57,255,20,.06)"; textColor = "#39ff14"; }
          else if (isChosen)          { borderColor = "#ff2d55"; bgColor = "rgba(255,45,85,.06)"; textColor = "#ff2d55"; }
          // unselected options stay neutral — no color leak
        } else if (isChosen) {
          borderColor = "#ffd700"; bgColor = "rgba(255,215,0,.05)"; textColor = "#ffd700";
        }

        return (
          <button key={opt.id} onClick={() => { if (!disabled && !revealed) setSelected(opt.id); }}
            disabled={disabled || revealed}
            style={{
              fontFamily: "var(--pixel)", fontSize: "6px", padding: "13px 16px",
              background: bgColor, border: `2px solid ${borderColor}`, color: textColor,
              cursor: disabled || revealed ? "default" : "pointer",
              display: "flex", alignItems: "flex-start", gap: "10px",
              textAlign: "left", lineHeight: "1.8", transition: "all .15s",
              boxShadow: isChosen && !revealed ? `0 0 10px ${borderColor}44` : "none",
            }}>
            <span style={{ fontFamily: "var(--pixel)", fontSize: "7px", color: "#ffd700", minWidth: "16px" }}>
              {opt.id.toUpperCase()}.
            </span>
            <div style={{ flex: 1 }}>
              <div>{opt.label}</div>
              {revealed && isChosen && (
                <div style={{ marginTop: "6px", fontSize: "5px", color: isCorrect ? "#39ff14" : "rgba(255,45,85,.8)" }}>
                  {isCorrect ? "✓ CORRECT" : "✗ "}{!isCorrect && !opt.safe ? "This exposes the company to attack" : ""}
                </div>
              )}
            </div>
          </button>
        );
      })}

      {!revealed && (
        <button onClick={handleSubmit} disabled={!selected || disabled} style={{
          fontFamily: "var(--pixel)", fontSize: "7px",
          color: selected ? "#0a0e1a" : "#555",
          background: selected ? "#ffd700" : "transparent",
          border: `2px solid ${selected ? "#ffd700" : "#333"}`,
          padding: "14px", cursor: selected ? "pointer" : "not-allowed",
          boxShadow: selected ? "0 0 16px rgba(255,215,0,.4)" : "none",
          transition: "all .15s", letterSpacing: "2px",
        }}>
          ▶ CONFIRM DECISION
        </button>
      )}
    </div>
  );
}

// ── Result overlay ────────────────────────────────────────────────────────
function ResultOverlay({ result, level, isLastLevel, submitting, onNext, onRetry, onExit }) {
  const color   = result.correct ? "#39ff14" : "#ff2d55";
  const verdict = result.correct ? "✓ ATTACK DEFLECTED" : "✗ COMPROMISED";

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 200, background: "rgba(0,0,0,.85)",
      display: "flex", alignItems: "center", justifyContent: "center",
      animation: "float-up .25s ease",
    }}>
      <div style={{
        background: "#0d1b2e", maxWidth: "580px", width: "92%",
        border: `3px solid ${color}`, boxShadow: `0 0 40px ${color}44`,
        animation: "float-up .3s ease",
      }}>
        {/* Verdict */}
        <div style={{ padding: "20px 22px", textAlign: "center", background: result.correct ? "rgba(57,255,20,.06)" : "rgba(255,45,85,.06)", borderBottom: `1px solid ${color}44` }}>
          <div style={{ fontFamily: "var(--pixel)", fontSize: "12px", color, textShadow: `0 0 12px ${color}`, marginBottom: "6px" }}>{verdict}</div>
          <div style={{ fontFamily: "var(--pixel)", fontSize: "6px", color: "rgba(255,255,255,.5)" }}>
            {result.correct ? (isLastLevel ? "Module 3 complete! You resisted all social engineering attempts." : "Good instincts — advance to the next scenario.") : "Study the red flags and try again."}
          </div>
        </div>

        {/* Stats */}
        <div style={{ display: "flex", justifyContent: "center", gap: "24px", flexWrap: "wrap", padding: "14px 20px", background: "rgba(0,0,0,.3)", borderBottom: "1px solid rgba(0,245,255,.1)" }}>
          {[
            { label: "HEALTH",   val: `${result.healthChange > 0 ? "+" : ""}${result.healthChange} HP`, color },
            { label: "XP",       val: `+${result.xpGained}`,                                            color: "#ffd700" },
            { label: "SCENARIO", val: `${level.level}/5`,                                               color: level.difficultyColor },
          ].map((s) => (
            <div key={s.label} style={{ textAlign: "center" }}>
              <div style={{ fontFamily: "var(--pixel)", fontSize: "4px", color: "rgba(0,245,255,.5)", marginBottom: "4px", letterSpacing: "1px" }}>{s.label}</div>
              <div style={{ fontFamily: "var(--pixel)", fontSize: "12px", color: s.color, textShadow: `0 0 8px ${s.color}` }}>{s.val}</div>
            </div>
          ))}
        </div>

        {/* Body */}
        <div style={{ padding: "16px 20px", display: "flex", flexDirection: "column", gap: "12px" }}>
          <div>
            <div style={{ fontFamily: "var(--pixel)", fontSize: "5px", color: "rgba(0,245,255,.5)", letterSpacing: "1px", marginBottom: "6px" }}>// ATTACK ANALYSIS</div>
            <div style={{ fontFamily: "var(--pixel)", fontSize: "5px", color: "#a8c8e0", lineHeight: "2", padding: "10px 12px", background: "#000d1a", border: "1px solid rgba(0,245,255,.15)" }}>
              {level.explanation}
            </div>
          </div>
          <div>
            <div style={{ fontFamily: "var(--pixel)", fontSize: "5px", color: "rgba(0,245,255,.5)", letterSpacing: "1px", marginBottom: "6px" }}>// RED FLAGS</div>
            <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
              {level.redFlags.map((f, i) => (
                <div key={i} style={{ fontFamily: "var(--pixel)", fontSize: "5px", color: "#a8c8e0", padding: "5px 8px", borderLeft: "2px solid #ff2d55", background: "rgba(255,45,85,.04)", lineHeight: "1.7" }}>
                  <span style={{ color: "#ff2d55" }}>⚠</span> {f}
                </div>
              ))}
            </div>
          </div>
          {result.realWorldStat && (
            <div style={{ padding: "10px 12px", background: "rgba(0,0,0,.4)", border: "1px solid rgba(255,215,0,.2)", display: "flex", gap: "10px" }}>
              <span style={{ fontSize: "18px" }}>📊</span>
              <div style={{ fontFamily: "var(--pixel)", fontSize: "5px", color: "#ffd700", lineHeight: "1.9" }}>
                <span>REAL WORLD: </span>{result.realWorldStat}
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        <div style={{ display: "flex", gap: "10px", padding: "0 20px 20px" }}>
          {result.correct && !isLastLevel && (
            <button onClick={onNext} disabled={submitting} style={{
              flex: 1, fontFamily: "var(--pixel)", fontSize: "7px", color: "#0a0e1a",
              background: "#39ff14", border: "2px solid #39ff14", padding: "13px",
              cursor: "pointer", boxShadow: "0 0 20px rgba(57,255,20,.5)",
            }}>NEXT SCENARIO ▶</button>
          )}
          {result.correct && isLastLevel && (
            <button onClick={onExit} style={{
              flex: 1, fontFamily: "var(--pixel)", fontSize: "7px", color: "#0a0e1a",
              background: "#ffd700", border: "2px solid #ffd700", padding: "13px",
              cursor: "pointer", boxShadow: "0 0 20px rgba(255,215,0,.5)",
            }}>🏆 MODULE COMPLETE — RETURN TO BASE</button>
          )}
          {!result.correct && (
            <button onClick={onRetry} style={{
              flex: 1, fontFamily: "var(--pixel)", fontSize: "7px",
              color: "#00f5ff", background: "transparent", border: "2px solid #00f5ff", padding: "13px", cursor: "pointer",
            }}>↺ RETRY</button>
          )}
          <button onClick={onExit} style={{
            fontFamily: "var(--pixel)", fontSize: "6px", color: "#555",
            background: "transparent", border: "2px solid #333", padding: "13px 16px", cursor: "pointer",
          }}>← EXIT</button>
        </div>
      </div>
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────
export default function SocialChallenge() {
  const { level: levelParam } = useParams();
  const navigate              = useNavigate();
  const { user }                                    = useAuth();
  const { submit, submitting, resetWrongStreak }    = useModuleSubmit("social", DB_CHALLENGE_ID);

  const uiLevel   = Math.min(Math.max(parseInt(levelParam) || 1, 1), TOTAL_LEVELS);
  const levelData = getLevelData(uiLevel);

  const [result,   setResult]   = useState(null);
  const [blockMsg, setBlockMsg] = useState("");

  useEffect(() => { setResult(null); setBlockMsg(""); }, [uiLevel]);

  if (!levelData) return null;

  const isLastLevel = uiLevel >= TOTAL_LEVELS;
  const hp          = user?.healthScore ?? 70;
  const hpCol       = hp >= 60 ? "#39ff14" : hp >= 30 ? "#ffd700" : "#ff2d55";

  async function handleSubmit(isCorrect) {
    const res = await submit(isCorrect, uiLevel, levelData);
    setResult({
      correct:      res.correct,
      healthChange: res.healthChange,
      xpGained:     res.xpGained,
      realWorldStat: pickStat(),
      chainAttack:  res.chainAttack,
      crisis:       res.crisis,
    });
    if (!isCorrect && res.chainAttack) {
      setBlockMsg(`⚠ CHAIN ATTACK: ${res.chainAttack.message}`);
    }
  }

  return (
    <div style={{ width: "100vw", minHeight: "100vh", background: "#0a0e1a", display: "flex", flexDirection: "column", position: "relative", overflow: "auto" }}>
      <MatrixRain opacity={0.05} />
      <Scanlines />

      {/* Top bar */}
      <div style={{ position: "sticky", top: 0, zIndex: 30, background: "linear-gradient(90deg,#0a0e1a,#0d1b2e,#0a0e1a)", borderBottom: "2px solid rgba(0,245,255,.2)", padding: "8px 16px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "8px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <button onClick={() => navigate("/main")} style={{ fontFamily: "var(--pixel)", fontSize: "6px", color: "#00f5ff", background: "transparent", border: "1px solid rgba(0,245,255,.3)", padding: "5px 10px", cursor: "pointer" }}>◀ BASE</button>
          <SmallLogo />
          <span style={{ fontFamily: "var(--pixel)", fontSize: "7px", color: "#00f5ff" }}>MODULE 3: SOCIAL ENGINEERING</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "3px", minWidth: "160px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontFamily: "var(--pixel)", fontSize: "5px", color: hpCol }}>
              <span>COMPANY HEALTH</span><span>{hp}/100</span>
            </div>
            <div style={{ height: "10px", background: "#000", border: `2px solid ${hpCol}` }}>
              <div style={{ width: `${hp}%`, height: "100%", background: hpCol, transition: "width .5s" }} />
            </div>
          </div>
          <div style={{ fontFamily: "var(--pixel)", fontSize: "7px", color: "#ffd700", textShadow: "0 0 6px #ffd700" }}>XP: {user?.xp ?? 0}</div>
        </div>
      </div>

      {/* Level header */}
      <div style={{ maxWidth: "820px", margin: "0 auto", width: "100%", padding: "12px 16px 0", position: "relative", zIndex: 5 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 14px", background: "rgba(13,27,46,.9)", border: "1px solid rgba(255,140,0,.2)" }}>
          <div>
            <div style={{ fontFamily: "var(--pixel)", fontSize: "8px", color: "#ff8c00", textShadow: "0 0 8px #ff8c00" }}>
              SCENARIO {uiLevel}: {levelData.difficulty}
            </div>
            <div style={{ fontFamily: "var(--pixel)", fontSize: "5px", color: "rgba(0,245,255,.4)", marginTop: "4px" }}>{levelData.title}</div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div style={{ display: "flex", gap: "6px" }}>
              {Array.from({ length: TOTAL_LEVELS }).map((_, i) => (
                <div key={i} style={{
                  width: "8px", height: "8px", borderRadius: "1px",
                  border: "1px solid rgba(255,140,0,.3)",
                  background: i + 1 < uiLevel ? "#ff8c00" : i + 1 === uiLevel ? "#ffd700" : "transparent",
                  boxShadow: i + 1 <= uiLevel ? "0 0 5px #ff8c00" : "none",
                  animation: i + 1 === uiLevel ? "blink 1s infinite" : "none",
                }} />
              ))}
            </div>
            <span style={{ fontFamily: "var(--pixel)", fontSize: "6px", color: "#ff8c00" }}>{uiLevel}/{TOTAL_LEVELS}</span>
          </div>
        </div>
      </div>

      {/* Main body */}
      <div style={{ maxWidth: "820px", margin: "0 auto", width: "100%", padding: "14px 16px", display: "flex", flexDirection: "column", gap: "14px", position: "relative", zIndex: 5 }}>
        {/* Scenario type renderer */}
        {levelData.type === "call"        && <CallScenario     level={levelData} />}
        {levelData.type === "chat"        && <ChatScenario     level={levelData} />}
        {levelData.type === "physical"    && <PhysicalScenario level={levelData} />}
        {levelData.type === "email-chain" && <EmailChainScenario level={levelData} />}

        {/* Options */}
        <ChoiceOptions level={levelData} onSubmit={handleSubmit} disabled={!!result || submitting} />
      </div>

      {/* Block message */}
      {blockMsg && (
        <div style={{ position: "fixed", bottom: "20px", left: "50%", transform: "translateX(-50%)", zIndex: 150, maxWidth: "480px", width: "90%", background: "#0d1b2e", border: "2px solid #ffd700", padding: "14px 18px", textAlign: "center", boxShadow: "0 0 20px rgba(255,215,0,.3)" }}>
          <div style={{ fontFamily: "var(--pixel)", fontSize: "6px", color: "#ffd700", marginBottom: "10px" }}>⚠ {blockMsg}</div>
          <button onClick={() => navigate("/main")} style={{ fontFamily: "var(--pixel)", fontSize: "6px", color: "#00f5ff", background: "transparent", border: "1px solid #00f5ff", padding: "7px 16px", cursor: "pointer" }}>RETURN TO BASE</button>
        </div>
      )}

      {/* Result */}
      {result && (
        <ResultOverlay
          result={result} level={levelData} isLastLevel={isLastLevel} submitting={submitting}
          onNext={() => { setResult(null); navigate(`/challenge/social/${uiLevel + 1}`); }}
          onRetry={() => setResult(null)}
          onExit={() => navigate("/main")}
        />
      )}
    </div>
  );
}
