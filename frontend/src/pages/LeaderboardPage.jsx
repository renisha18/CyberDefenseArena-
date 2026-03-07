// ── src/pages/LeaderboardPage.jsx ─────────────────────────────────────────
// Fetches live rankings from GET /api/leaderboard (public — no auth needed).

import { useState, useEffect } from "react";
import { useNavigate }         from "react-router-dom";
import Scanlines               from "../components/Scanlines";
import MatrixRain              from "../components/MatrixRain";
import PixelButton             from "../components/PixelButton";
import api                     from "../services/api";

const MEDALS = ["🥇", "🥈", "🥉"];

export default function LeaderboardPage() {
  const navigate          = useNavigate();
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState("");

  useEffect(() => {
    async function load() {
      try {
        const { data } = await api.get("/leaderboard?limit=10");
        setPlayers(data);
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

      <div style={{ maxWidth: "560px", margin: "0 auto", padding: "30px 16px", position: "relative", zIndex: 5 }}>

        <div style={{ textAlign: "center", marginBottom: "24px" }}>
          <div style={{
            fontFamily: "var(--pixel)", fontSize: "18px",
            color: "#ffd700", textShadow: "0 0 16px #ffd700", marginBottom: "8px",
          }}>
            🏆 LEADERBOARD
          </div>
          <div style={{ fontFamily: "var(--pixel)", fontSize: "6px", color: "rgba(0,245,255,.5)" }}>
            TOP AGENTS — GLOBAL RANKING
          </div>
        </div>

        {/* States */}
        {loading && (
          <div style={{
            fontFamily: "var(--pixel)", fontSize: "6px",
            color: "rgba(0,245,255,.4)", textAlign: "center",
            animation: "blink 1s infinite", padding: "20px",
          }}>
            LOADING RANKINGS...
          </div>
        )}

        {error && !loading && (
          <div style={{
            fontFamily: "var(--pixel)", fontSize: "6px", color: "#ff2d55",
            textAlign: "center", padding: "12px",
            border: "1px solid rgba(255,45,85,.3)",
            background: "rgba(255,45,85,.05)",
          }}>
            ⚠ {error}
          </div>
        )}

        {!loading && !error && players.length === 0 && (
          <div style={{
            fontFamily: "var(--pixel)", fontSize: "6px",
            color: "rgba(0,245,255,.4)", textAlign: "center", padding: "20px",
          }}>
            No agents ranked yet.<br /><br />Complete challenges to appear here!
          </div>
        )}

        {/* Player rows */}
        {players.map((p) => (
          <div key={p.id ?? p.rank} style={{
            display: "flex", alignItems: "center", gap: "12px",
            padding: "10px 14px", marginBottom: "8px",
            background: p.rank <= 3 ? "rgba(255,215,0,0.05)" : "rgba(13,27,46,.8)",
            border: `1px solid ${p.rank <= 3 ? "#ffd700" : "rgba(30,58,95,.8)"}`,
            boxShadow: p.rank <= 3 ? "0 0 10px rgba(255,215,0,.2)" : "none",
            animation: "float-up .3s ease",
          }}>
            <span style={{ fontSize: "16px", minWidth: "24px" }}>
              {MEDALS[p.rank - 1] ?? "🎖"}
            </span>
            <span style={{
              fontFamily: "var(--pixel)", fontSize: "7px",
              color: "#fff", flex: 1,
            }}>
              #{p.rank} {p.username.toUpperCase()}
            </span>
            <div style={{ textAlign: "right" }}>
              <div style={{
                fontFamily: "var(--pixel)", fontSize: "7px",
                color: "#ffd700", textShadow: "0 0 6px #ffd700",
              }}>
                {p.healthScore} HP
              </div>
              <div style={{
                fontFamily: "var(--pixel)", fontSize: "5px",
                color: "rgba(0,245,255,.5)", marginTop: "2px",
              }}>
                {p.xp} XP · 🔥 {p.streak}
              </div>
            </div>
          </div>
        ))}

        <div style={{ marginTop: "24px", display: "flex", justifyContent: "center" }}>
          <PixelButton text="◀ RETURN TO BASE" type="back" onClick={() => navigate("/main")}
            style={{ fontSize: "7px", padding: "12px 24px", border: "2px solid #00f5ff", color: "#00f5ff" }} />
        </div>

      </div>
    </div>
  );
}
