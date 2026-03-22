// ── src/pages/NotFoundPage.jsx ────────────────────────────────────────────
import { useNavigate } from "react-router-dom";
import Scanlines       from "../components/Scanlines";
import MatrixRain      from "../components/MatrixRain";

export default function NotFoundPage() {
  const navigate = useNavigate();
  return (
    <div style={{ width: "100vw", height: "100vh", background: "#0a0e1a", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "24px", position: "relative", overflow: "hidden" }}>
      <MatrixRain opacity={0.05} />
      <Scanlines />
      <div style={{ position: "relative", zIndex: 5, textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: "16px", animation: "float-up .5s ease" }}>
        <div style={{ fontFamily: "var(--pixel)", fontSize: "clamp(40px,8vw,72px)", color: "#ff2d55", textShadow: "0 0 30px #ff2d55", animation: "blink 1.5s infinite" }}>
          404
        </div>
        <div style={{ fontFamily: "var(--pixel)", fontSize: "clamp(6px,1.5vw,10px)", color: "#00f5ff", textShadow: "0 0 10px #00f5ff" }}>
          SECTOR NOT FOUND
        </div>
        <div style={{ fontFamily: "var(--pixel)", fontSize: "5px", color: "rgba(0,245,255,.4)", lineHeight: "1.9" }}>
          The requested sector does not exist in the network map.
        </div>
        <div style={{ display: "flex", gap: "10px", marginTop: "8px" }}>
          <button onClick={() => navigate("/main")} style={{ fontFamily: "var(--pixel)", fontSize: "7px", color: "#0a0e1a", background: "#39ff14", border: "2px solid #39ff14", padding: "12px 24px", cursor: "pointer", boxShadow: "0 0 20px rgba(57,255,20,.5)" }}>
            ▶ RETURN TO BASE
          </button>
          <button onClick={() => navigate(-1)} style={{ fontFamily: "var(--pixel)", fontSize: "7px", color: "#00f5ff", background: "transparent", border: "2px solid #00f5ff", padding: "12px 24px", cursor: "pointer" }}>
            ◀ GO BACK
          </button>
        </div>
      </div>
    </div>
  );
}
