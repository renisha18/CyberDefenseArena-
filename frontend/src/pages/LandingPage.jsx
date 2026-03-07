import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Scanlines from "../components/Scanlines";
import MatrixRain from "../components/MatrixRain";
import PixelButton from "../components/PixelButton";
import { LogoShield } from "../components/PixelIcons";
import "../styles/landing.css";

const SUBTITLE = "SECURE THE SYSTEM. TRAIN YOUR INSTINCTS.";
const BOOTLOG  = ["FIREWALL INITIALIZED", "THREAT DATABASE LOADED", "ENCRYPTION ACTIVE"];

export default function LandingPage() {
  const navigate = useNavigate();
  const [typed,   setTyped]   = useState("");
  const [showBtn, setShowBtn] = useState(false);

  useEffect(() => {
    let i = 0;
    const iv = setInterval(() => {
      setTyped(SUBTITLE.slice(0, i));
      i++;
      if (i > SUBTITLE.length) {
        clearInterval(iv);
        setTimeout(() => setShowBtn(true), 400);
      }
    }, 44);
    return () => clearInterval(iv);
  }, []);

  return (
    <div className="landing">
      <MatrixRain opacity={0.09} />
      <Scanlines />

      {/* Radar rings */}
      {[200, 320, 440].map((r, i) => (
        <div key={i} className="landing__radar-ring" style={{ width: r, height: r }} />
      ))}

      <div className="landing__card">
        <LogoShield />

        <div>
          <div className="landing__title-top">CYBERDEFENSE</div>
          <div className="landing__title-bottom">ARENA</div>
        </div>

        <div className="landing__subtitle">
          {typed}
          <span style={{ animation: "blink .8s infinite" }}>_</span>
        </div>

        <div className="landing__version">v1.0 — CHALLENGE SERIES I</div>

        {showBtn && (
          <PixelButton
            text="▶ JOIN MISSION"
            type="cta"
            onClick={() => navigate("/main")}
          />
        )}

        <div className="landing__bootlog">
          {BOOTLOG.map((line, i) => (
            <div key={i} style={{ animation: `float-up .4s ease ${i * 0.2}s both` }}>
              <span>■</span> {line}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
