// ── src/modules/phishing/pages/PhishingChallenge.jsx ─────────────────────
// Route: /challenge/phishing/:level
//
// IMPORTANT — DB submission strategy:
//   Levels 1–4 are LOCAL training rounds (no backend call).
//   Level 5 (final) triggers POST /api/phishing/submit once on correct answer.
//   This avoids the "one challenge per day" rule firing between levels.

import { useState, useEffect }    from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth }                from "../../../context/AuthContext";
import { useGameState }           from "../../../context/GameStateContext";
import api                        from "../../../services/api";
import Scanlines                  from "../../../components/Scanlines";
import MatrixRain                 from "../../../components/MatrixRain";
import { SmallLogo }              from "../../../components/PixelIcons";
import EmailCard                  from "../components/EmailCard";
import ActionButtons              from "../components/ActionButtons";
import InspectModal               from "../components/InspectModal";
import ResultPopup                from "../components/ResultPopup";
import PHISHING_LEVELS, {
  getLevelData,
  TOTAL_LEVELS,
  DB_CHALLENGE_ID,
} from "../data/phishingLevels";
import "../styles/phishing.css";

export default function PhishingChallenge() {
  const { level: levelParam } = useParams();
  const navigate              = useNavigate();
  const { user, updateStats } = useAuth();
  const { dispatch: gameDispatch } = useGameState();

  const uiLevel   = Math.min(Math.max(parseInt(levelParam) || 1, 1), TOTAL_LEVELS);
  const levelData = getLevelData(uiLevel);

  const [showInspect, setShowInspect] = useState(false);
  const [result,      setResult]      = useState(null);
  const [glitch,      setGlitch]      = useState(false);
  const [submitting,  setSubmitting]  = useState(false);
  const [blockMsg,    setBlockMsg]    = useState("");
  const [wrongStreak, setWrongStreak] = useState(0);

  // Reset state on level change
  useEffect(() => {
    setShowInspect(false);
    setResult(null);
    setGlitch(false);
    setBlockMsg("");
  }, [uiLevel]);

  if (!levelData) return null;

  const isLastLevel = uiLevel >= TOTAL_LEVELS;
  const hp          = user?.healthScore ?? 70;
  const hpCol       = hp >= 60 ? "#39ff14" : hp >= 30 ? "#ffd700" : "#ff2d55";

  // ── Handle player action ─────────────────────────────────────────────
  async function handleAction(action) {
    if (submitting || result) return;

    const isCorrect = action === levelData.correctAction;

    if (!isCorrect) {
      setGlitch(true);
      setTimeout(() => setGlitch(false), 500);
    }

    // Every level now submits to DB
    setSubmitting(true);
    try {
      const { data } = await api.post("/challenges/submit", {
        challengeId: DB_CHALLENGE_ID,
        uiLevel,
        correct:     isCorrect,
        wrongStreak,
      });

      if (!isCorrect) setWrongStreak((w) => w + 1);
      else            setWrongStreak(0);

      if (data.updatedPlayer) {
        updateStats(data.updatedPlayer);
      }

      // Update office map
      gameDispatch({ type: "SCENARIO_RESULT", payload: { module: "phishing", correct: isCorrect } });

      // Trigger crisis if backend says so
      if (data.crisis) {
        gameDispatch({ type: "CRISIS", payload: data.crisis });
      }

      setResult({
        correct:       isCorrect,
        healthChange:  data.healthChange,
        xpGained:      data.xpGained,
        streakMultiplier: data.streakMultiplier,
        explanation:   levelData.explanation,
        realWorldStat: pickStat(),
        chainAttack:   data.chainAttack,
        crisis:        data.crisis,
      });
    } catch (err) {
      // Network error — fall back to local result so player isn't blocked
      setResult({
        correct:       isCorrect,
        healthChange:  isCorrect ? levelData.healthReward : -levelData.healthPenalty,
        xpGained:      isCorrect ? levelData.xpReward : 0,
        explanation:   levelData.explanation,
        realWorldStat: pickStat(),
        serverMsg:     err.message,
      });
    } finally {
      setSubmitting(false);
    }
  }

  function handleNext() {
    setResult(null);
    navigate(`/challenge/phishing/${uiLevel + 1}`);
  }

  function handleRetry() {
    setResult(null);
    setGlitch(false);
  }

  function handleExit() {
    setWrongStreak(0);
    navigate("/main");
  }

  return (
    <div className="phishing-page">
      <MatrixRain opacity={0.05} />
      <Scanlines />

      {/* ── Top bar ── */}
      <div style={{
        position: "sticky", top: 0, zIndex: 30,
        background: "linear-gradient(90deg,#0a0e1a,#0d1b2e,#0a0e1a)",
        borderBottom: "2px solid rgba(0,245,255,.2)",
        padding: "8px 16px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        flexWrap: "wrap", gap: "8px",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <button onClick={handleExit} style={{
            fontFamily: "var(--pixel)", fontSize: "6px", color: "#00f5ff",
            background: "transparent", border: "1px solid rgba(0,245,255,.3)",
            padding: "5px 10px", cursor: "pointer", transition: "all .15s",
          }}
            onMouseEnter={e => e.target.style.borderColor = "#00f5ff"}
            onMouseLeave={e => e.target.style.borderColor = "rgba(0,245,255,.3)"}
          >
            ◀ BASE
          </button>
          <SmallLogo />
          <span style={{ fontFamily: "var(--pixel)", fontSize: "7px", color: "#00f5ff" }}>
            MODULE 1: PHISHING DETECTION
          </span>
        </div>
        {/* HP + XP */}
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

      {/* ── Level header ── */}
      <div style={{ maxWidth: "1100px", margin: "0 auto", width: "100%", padding: "12px 16px 0", position: "relative", zIndex: 5 }}>
        <div className="phishing-header">
          <div>
            <div className="phishing-header__title">
              SCENARIO {uiLevel}: {levelData.difficulty}
            </div>
            <div style={{ fontFamily: "var(--pixel)", fontSize: "5px", color: "rgba(0,245,255,.4)", marginTop: "4px" }}>
              Analyse the email below and decide what to do
            </div>
          </div>
          <div className="phishing-header__meta">
            {/* Progress dots */}
            <div className="level-progress">
              {Array.from({ length: TOTAL_LEVELS }).map((_, i) => (
                <div key={i} className={[
                  "level-dot",
                  i + 1 < uiLevel  ? "level-dot--done"    : "",
                  i + 1 === uiLevel ? "level-dot--current" : "",
                ].join(" ")} />
              ))}
            </div>
            <div className="phishing-header__level">SCENARIO {uiLevel} / {TOTAL_LEVELS}</div>
          </div>
        </div>
      </div>

      {/* ── Main grid ── */}
      <div className="phishing-page__body" style={{ position: "relative", zIndex: 5 }}>
        <EmailCard level={levelData} glitch={glitch} />
        <ActionButtons
          level={levelData}
          onAction={handleAction}
          onInspect={() => setShowInspect(true)}
          disabled={!!result || submitting}
          result={result}
        />
      </div>

      {/* ── Blocked message (already done today) ── */}
      {blockMsg && (
        <div style={{
          position: "fixed", bottom: "20px", left: "50%", transform: "translateX(-50%)",
          zIndex: 150, maxWidth: "480px", width: "90%",
          background: "#0d1b2e", border: "2px solid #ffd700",
          padding: "14px 18px", textAlign: "center",
          boxShadow: "0 0 20px rgba(255,215,0,.3)",
        }}>
          <div style={{ fontFamily: "var(--pixel)", fontSize: "6px", color: "#ffd700", marginBottom: "10px" }}>
            ⚠ {blockMsg}
          </div>
          <button onClick={handleExit} style={{
            fontFamily: "var(--pixel)", fontSize: "6px",
            color: "#00f5ff", background: "transparent",
            border: "1px solid #00f5ff", padding: "7px 16px", cursor: "pointer",
          }}>
            RETURN TO BASE
          </button>
        </div>
      )}

      {/* ── Inspect modal ── */}
      {showInspect && (
        <InspectModal level={levelData} onClose={() => setShowInspect(false)} />
      )}

      {/* ── Result popup ── */}
      {result && (
        <ResultPopup
          correct={result.correct}
          healthChange={result.healthChange}
          xpGained={result.xpGained}
          explanation={result.explanation}
          redFlags={levelData.redFlags}
          realWorldStat={result.realWorldStat}
          level={levelData}
          onNext={handleNext}
          onRetry={handleRetry}
          onExit={handleExit}
          isLastLevel={isLastLevel}
          submitting={submitting}
          serverMsg={result.serverMsg}
        />
      )}
    </div>
  );
}

// ── Real-world stats pool ─────────────────────────────────────────────────
const STATS = [
  "91% of all cyber attacks begin with a phishing email.",
  "The average cost of a phishing breach on a mid-sized company is $1.6M.",
  "Phishing emails have a 30% open rate — higher than most marketing emails.",
  "Spear phishing is 3× more likely to succeed than generic phishing.",
  "In 2023, BEC attacks caused $2.9 billion in losses globally.",
  "Credential phishing rose 48% in 2022, targeting cloud services.",
  "The most impersonated brand in phishing is Microsoft (30% of attacks).",
];
function pickStat() { return STATS[Math.floor(Math.random() * STATS.length)]; }
