// ── src/modules/password/pages/PasswordChallenge.jsx ─────────────────────
// Route: /challenge/password/:level
// DB submit fires once on level 5 correct answer only.

import { useState, useEffect }    from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth }                from "../../../context/AuthContext";
import { useModuleSubmit }        from "../../../hooks/useModuleSubmit";
import Scanlines                  from "../../../components/Scanlines";
import MatrixRain                 from "../../../components/MatrixRain";
import { SmallLogo }              from "../../../components/PixelIcons";
import ChoiceScenario             from "../components/ChoiceScenario";
import AuditScenario              from "../components/AuditScenario";
import PASSWORD_LEVELS, {
  getLevelData,
  TOTAL_LEVELS,
  DB_CHALLENGE_ID,
} from "../data/passwordLevels";
import "../styles/password.css";

const REAL_WORLD_STATS = [
  "123456 is still the most common password in the world.",
  "80% of confirmed breaches involve weak or reused passwords.",
  "A 12-character random password takes 34,000 years to brute-force.",
  "MFA blocks 99.9% of automated account attacks — even with a leaked password.",
  "The average person reuses the same password across 14 different websites.",
  "In 2023, 86% of web app attacks used stolen credentials.",
];
const pickStat = () => REAL_WORLD_STATS[Math.floor(Math.random() * REAL_WORLD_STATS.length)];

export default function PasswordChallenge() {
  const { level: levelParam } = useParams();
  const navigate              = useNavigate();
  const { user }                                    = useAuth();
  const { submit, submitting, resetWrongStreak }    = useModuleSubmit("password", DB_CHALLENGE_ID);

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
      correct:       res.correct,
      healthChange:  res.healthChange,
      xpGained:      res.xpGained,
      explanation:   levelData.explanation,
      realWorldStat: pickStat(),
      chainAttack:   res.chainAttack,
    });
    if (!isCorrect && res.chainAttack) {
      setBlockMsg(`⚠ CHAIN ATTACK: ${res.chainAttack.message}`);
    }
  }

  return (
    <div className="pwd-page">
      <MatrixRain opacity={0.05} />
      <Scanlines />

      {/* Top bar */}
      <div style={{
        position: "sticky", top: 0, zIndex: 30,
        background: "linear-gradient(90deg,#0a0e1a,#0d1b2e,#0a0e1a)",
        borderBottom: "2px solid rgba(0,245,255,.2)",
        padding: "8px 16px",
        display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "8px",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <button onClick={() => navigate("/main")} style={{
            fontFamily: "var(--pixel)", fontSize: "6px", color: "#00f5ff",
            background: "transparent", border: "1px solid rgba(0,245,255,.3)",
            padding: "5px 10px", cursor: "pointer",
          }}>◀ BASE</button>
          <SmallLogo />
          <span style={{ fontFamily: "var(--pixel)", fontSize: "7px", color: "#00f5ff" }}>
            MODULE 2: PASSWORD SECURITY
          </span>
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
          <div style={{ fontFamily: "var(--pixel)", fontSize: "7px", color: "#ffd700", textShadow: "0 0 6px #ffd700" }}>
            XP: {user?.xp ?? 0}
          </div>
        </div>
      </div>

      {/* Level progress header */}
      <div style={{ maxWidth: "860px", margin: "0 auto", width: "100%", padding: "12px 16px 0", position: "relative", zIndex: 5 }}>
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "10px 14px", background: "rgba(13,27,46,.9)",
          border: "1px solid rgba(255,215,0,.2)",
        }}>
          <div>
            <div style={{ fontFamily: "var(--pixel)", fontSize: "8px", color: "#ffd700", textShadow: "0 0 8px #ffd700" }}>
              SCENARIO {uiLevel}: {levelData.difficulty}
            </div>
            <div style={{ fontFamily: "var(--pixel)", fontSize: "5px", color: "rgba(0,245,255,.4)", marginTop: "4px" }}>
              {levelData.title}
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div className="level-progress">
              {Array.from({ length: TOTAL_LEVELS }).map((_, i) => (
                <div key={i} className={[
                  "level-dot",
                  i + 1 < uiLevel   ? "level-dot--done"    : "",
                  i + 1 === uiLevel ? "level-dot--current" : "",
                ].join(" ")} />
              ))}
            </div>
            <span style={{ fontFamily: "var(--pixel)", fontSize: "6px", color: levelData.difficultyColor }}>
              {uiLevel}/{TOTAL_LEVELS}
            </span>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="pwd-page__body">
        {/* Scenario card */}
        <div className="pwd-scenario">
          <span className="pwd-scenario__badge" style={{ color: levelData.difficultyColor, borderColor: levelData.difficultyColor }}>
            {levelData.difficulty}
          </span>
          <div className="pwd-scenario__title">{levelData.title}</div>
          <div className="pwd-scenario__description">{levelData.description}</div>
        </div>

        {/* Choice or Audit component */}
        {levelData.type === "audit"
          ? <AuditScenario
              key={`password-audit-${uiLevel}`}
              level={levelData}
              onSubmit={handleSubmit}
              disabled={!!result || submitting}
            />
          : <ChoiceScenario
              key={`password-choice-${uiLevel}`}
              level={levelData}
              onSubmit={handleSubmit}
              disabled={!!result || submitting}
            />
        }
      </div>

      {/* Block message */}
      {blockMsg && (
        <div style={{
          position: "fixed", bottom: "20px", left: "50%", transform: "translateX(-50%)",
          zIndex: 150, maxWidth: "480px", width: "90%",
          background: "#0d1b2e", border: "2px solid #ffd700",
          padding: "14px 18px", textAlign: "center",
          boxShadow: "0 0 20px rgba(255,215,0,.3)",
        }}>
          <div style={{ fontFamily: "var(--pixel)", fontSize: "6px", color: "#ffd700", marginBottom: "10px" }}>⚠ {blockMsg}</div>
          <button onClick={() => navigate("/main")} style={{
            fontFamily: "var(--pixel)", fontSize: "6px", color: "#00f5ff",
            background: "transparent", border: "1px solid #00f5ff", padding: "7px 16px", cursor: "pointer",
          }}>RETURN TO BASE</button>
        </div>
      )}

      {/* Result overlay */}
      {result && (
        <ResultOverlay
          result={result}
          level={levelData}
          isLastLevel={isLastLevel}
          submitting={submitting}
          onNext={() => { setResult(null); navigate(`/challenge/password/${uiLevel + 1}`); }}
          onRetry={() => setResult(null)}
          onExit={() => navigate("/main")}
        />
      )}
    </div>
  );
}

// ── Inline result overlay (same style as phishing module) ─────────────────
function ResultOverlay({ result, level, isLastLevel, submitting, onNext, onRetry, onExit }) {
  const color   = result.correct ? "#39ff14" : "#ff2d55";
  const verdict = result.correct ? "✓ CORRECT DECISION" : "✗ WRONG CALL";

  return (
    <div className="pwd-result">
      <div className="pwd-result__card" style={{ border: `3px solid ${color}`, boxShadow: `0 0 40px ${color}44` }}>

        <div className="pwd-result__header" style={{ background: result.correct ? "rgba(57,255,20,.06)" : "rgba(255,45,85,.06)", borderBottom: `1px solid ${color}44` }}>
          <div className="pwd-result__verdict" style={{ color, textShadow: `0 0 12px ${color}` }}>{verdict}</div>
          <div className="pwd-result__sub">
            {result.correct
              ? isLastLevel ? "Module 2 complete! Outstanding security awareness." : "Good call — move to the next scenario."
              : "Study the explanation below and retry."}
          </div>
        </div>

        <div className="pwd-result__stats">
          {[
            { label: "HEALTH",    val: `${result.healthChange > 0 ? "+" : ""}${result.healthChange} HP`, color },
            { label: "XP EARNED", val: `+${result.xpGained}`, color: "#ffd700" },
            { label: "SCENARIO",  val: `${level.level}/5`,    color: level.difficultyColor },
          ].map((s) => (
            <div key={s.label}>
              <div className="pwd-result__stat-label">{s.label}</div>
              <div className="pwd-result__stat-value" style={{ color: s.color, textShadow: `0 0 8px ${s.color}` }}>{s.val}</div>
            </div>
          ))}
        </div>

        <div className="pwd-result__body">
          <div>
            <div className="pwd-result__section">// EXPLANATION</div>
            <div className="pwd-result__explanation">{result.explanation}</div>
          </div>
          {level.redFlags?.length > 0 && (
            <div>
              <div className="pwd-result__section">// KEY LESSONS</div>
              <div className="pwd-result__flags">
                {level.redFlags.map((f, i) => (
                  <div key={i} className="pwd-result__flag"><span>▶</span> {f}</div>
                ))}
              </div>
            </div>
          )}
          {result.realWorldStat && (
            <div className="pwd-result__stat-box">
              <span className="pwd-result__stat-icon">📊</span>
              <div className="pwd-result__stat-text">
                <span style={{ color: "#ffd700" }}>REAL WORLD: </span>{result.realWorldStat}
              </div>
            </div>
          )}
        </div>

        <div className="pwd-result__actions">
          {result.correct && !isLastLevel && (
            <button onClick={onNext} disabled={submitting} style={{
              flex: 1, fontFamily: "var(--pixel)", fontSize: "7px",
              color: "#0a0e1a", background: "#39ff14",
              border: "2px solid #39ff14", padding: "13px",
              cursor: "pointer", boxShadow: "0 0 20px rgba(57,255,20,.5)",
            }}>NEXT SCENARIO ▶</button>
          )}
          {result.correct && isLastLevel && (
            <button onClick={onExit} style={{
              flex: 1, fontFamily: "var(--pixel)", fontSize: "7px",
              color: "#0a0e1a", background: "#ffd700",
              border: "2px solid #ffd700", padding: "13px", cursor: "pointer",
              boxShadow: "0 0 20px rgba(255,215,0,.5)",
            }}>🏆 MODULE COMPLETE — RETURN TO BASE</button>
          )}
          {!result.correct && (
            <button onClick={onRetry} style={{
              flex: 1, fontFamily: "var(--pixel)", fontSize: "7px",
              color: "#00f5ff", background: "transparent",
              border: "2px solid #00f5ff", padding: "13px", cursor: "pointer",
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
