import { useEffect, useMemo, useState } from "react";
import "../styles/gameIntroAnimation.css";

const SCENE_TEXT = {
  1: "This is your digital office.",
  2: "Threats can appear anywhere...",
  3: "If ignored, they spread.",
  4: "Your decisions stop them.",
  5: "You are the defense.",
};

const TOTAL_DURATION_MS = 10000;

export default function GameIntroAnimation({ onComplete, onSkip }) {
  const [scene, setScene] = useState(1);

  const nodes = useMemo(() => Array.from({ length: 16 }, (_, i) => i), []);
  const threatNode = 6;
  const spreadNodes = [5, 6, 7, 10];

  useEffect(() => {
    const timers = [
      setTimeout(() => setScene(2), 2000),
      setTimeout(() => setScene(3), 4200),
      setTimeout(() => setScene(4), 6200),
      setTimeout(() => setScene(5), 8200),
      setTimeout(() => onComplete?.(), TOTAL_DURATION_MS),
    ];

    return () => timers.forEach(clearTimeout);
  }, [onComplete]);

  function getNodeClass(i) {
    if (scene === 1) return "intro-node intro-node--idle";

    if (scene === 2) {
      if (i === threatNode) return "intro-node intro-node--threat intro-node--glitch";
      return "intro-node intro-node--idle";
    }

    if (scene === 3) {
      if (spreadNodes.includes(i)) {
        return i === threatNode
          ? "intro-node intro-node--threat intro-node--glitch"
          : "intro-node intro-node--spread";
      }
      return "intro-node intro-node--idle";
    }

    if (scene === 4) {
      if (i === threatNode) return "intro-node intro-node--shield";
      if (spreadNodes.includes(i)) return "intro-node intro-node--recovering";
      return "intro-node intro-node--idle";
    }

    return "intro-node intro-node--safe";
  }

  return (
    <section className="intro-wrap" aria-label="CyberDefense Arena intro animation">
      <button
        type="button"
        className="intro-skip"
        onClick={() => {
          onSkip?.();
          onComplete?.();
        }}
      >
        SKIP &gt;&gt;
      </button>

      <div className="intro-panel">
        <div className="intro-grid">
          {nodes.map((i) => (
            <div key={i} className={getNodeClass(i)}>
              {scene === 4 && i === threatNode && <span className="intro-shield">+</span>}
            </div>
          ))}
        </div>

        <div className="intro-caption" key={scene}>
          {SCENE_TEXT[scene]}
        </div>

        <div className="intro-subtitle">
          CYBERDEFENSE ARENA // LIVE OFFICE SIMULATION
        </div>
      </div>
    </section>
  );
}
