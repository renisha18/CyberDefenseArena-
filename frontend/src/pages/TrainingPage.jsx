// ── src/pages/TrainingPage.jsx ────────────────────────────────────────────
// Shows challenge progression tree fetched live from the backend.
// Locked = grayed out. Completed = green check. Unlocked = playable.

import { useState, useEffect } from "react";
import { useNavigate }         from "react-router-dom";
import Scanlines               from "../components/Scanlines";
import MatrixRain              from "../components/MatrixRain";
import PixelButton             from "../components/PixelButton";
import api                     from "../services/api";

const STATUS_CONFIG = {
  completed: { icon: "✓", color: "#39ff14", label: "COMPLETE",  opacity: 1   },
  unlocked:  { icon: "▶", color: "#ffd700", label: "PLAY NOW",  opacity: 1   },
  locked:    { icon: "🔒", color: "#444",    label: "LOCKED",    opacity: 0.5 },
};

export default function TrainingPage() {
  const navigate              = useNavigate();
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState("");

  useEffect(() => {
    async function load() {
      try {
        const { data } = await api.get("/challenges");
        setModules(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return (
    <div style={{
      width: "100vw", height: "100vh", background: "#0a0e1a",
      overflow: "auto", position: "relative",
    }}>
      <MatrixRain opacity={0.05} />
      <Scanlines />

      <div style={{ maxWidth: "600px", margin: "0 auto", padding: "30px 16px", position: "relative", zIndex: 5 }}>

        <div style={{ textAlign: "center", marginBottom: "24px" }}>
          <div style={{
            fontFamily: "var(--pixel)", fontSize: "14px",
            color: "#00f5ff", textShadow: "0 0 16px #00f5ff", marginBottom: "8px",
          }}>
            📡 TRAINING MODULES
          </div>
          <div style={{ fontFamily: "var(--pixel)", fontSize: "6px", color: "rgba(0,245,255,.5)" }}>
            COMPLETE EACH MODULE TO UNLOCK THE NEXT
          </div>
        </div>

        {loading && (
          <div style={{
            fontFamily: "var(--pixel)", fontSize: "6px",
            color: "rgba(0,245,255,.4)", textAlign: "center",
            animation: "blink 1s infinite", padding: "20px",
          }}>
            LOADING MODULES...
          </div>
        )}

        {error && !loading && (
          <div style={{
            fontFamily: "var(--pixel)", fontSize: "6px", color: "#ff2d55",
            textAlign: "center", padding: "12px",
            border: "1px solid rgba(255,45,85,.3)",
          }}>
            ⚠ {error}
          </div>
        )}

        {modules.map((mod) => {
          const cfg = STATUS_CONFIG[mod.status] ?? STATUS_CONFIG.locked;
          return (
            <div key={mod.id} style={{
              display: "flex", alignItems: "center", gap: "14px",
              padding: "14px 18px", marginBottom: "10px",
              background: mod.status === "completed" ? "rgba(57,255,20,0.04)" : "rgba(13,27,46,.8)",
              border: `2px solid ${cfg.color}`,
              boxShadow: mod.status !== "locked" ? `0 0 10px ${cfg.color}33` : "none",
              opacity: cfg.opacity,
              animation: "float-up .3s ease",
            }}>
              {/* Icon */}
              <div style={{
                fontFamily: "var(--pixel)", fontSize: "14px",
                color: cfg.color, minWidth: "20px", textAlign: "center",
              }}>
                {cfg.icon}
              </div>

              {/* Info */}
              <div style={{ flex: 1 }}>
                <div style={{
                  fontFamily: "var(--pixel)", fontSize: "7px",
                  color: cfg.color, marginBottom: "5px",
                }}>
                  MODULE {mod.level}: {mod.title.toUpperCase()}
                </div>
                {mod.description && (
                  <div style={{
                    fontFamily: "var(--pixel)", fontSize: "5px",
                    color: "rgba(0,245,255,.5)", lineHeight: "1.8",
                    marginBottom: "4px",
                  }}>
                    {mod.description}
                  </div>
                )}
                <div style={{ fontFamily: "var(--pixel)", fontSize: "5px", color: "rgba(255,215,0,.6)" }}>
                  +{mod.healthReward} HP  ·  +{mod.xpReward} XP
                </div>
              </div>

              {/* Status badge / Play button */}
              <div>
                {mod.status === "unlocked" ? (
                  <button onClick={() => navigate("/challenge")} style={{
                    fontFamily: "var(--pixel)", fontSize: "5px",
                    color: "#0a0e1a", background: "#ffd700",
                    border: "2px solid #ffd700", padding: "6px 10px",
                    cursor: "pointer", boxShadow: "0 0 10px rgba(255,215,0,.5)",
                    transition: "all .15s",
                  }}>
                    PLAY ▶
                  </button>
                ) : (
                  <div style={{
                    fontFamily: "var(--pixel)", fontSize: "5px",
                    color: cfg.color, border: `1px solid ${cfg.color}`,
                    padding: "4px 8px",
                  }}>
                    {cfg.label}
                  </div>
                )}
              </div>
            </div>
          );
        })}

        <div style={{ marginTop: "24px", display: "flex", justifyContent: "center" }}>
          <PixelButton text="◀ RETURN TO BASE" type="back" onClick={() => navigate("/main")}
            style={{ fontSize: "7px", padding: "12px 24px", border: "2px solid #00f5ff", color: "#00f5ff" }} />
        </div>

      </div>
    </div>
  );
}
