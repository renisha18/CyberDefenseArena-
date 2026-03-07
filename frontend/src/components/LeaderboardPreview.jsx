// Left-panel leaderboard preview widget
import { useNavigate } from "react-router-dom";
import PixelButton from "./PixelButton";

const TOP_PLAYERS = [
  { rank: 1, name: "CYBERNINJA",  pts: 420, medal: "🥇" },
  { rank: 2, name: "PACKETHUNTR", pts: 380, medal: "🥈" },
  { rank: 3, name: "BYTEGUARD",   pts: 350, medal: "🥉" },
];

export default function LeaderboardPreview() {
  const navigate = useNavigate();

  return (
    <div className="lb-preview">
      <div className="lb-preview__header">🏆 TOP AGENTS</div>
      <div className="lb-preview__body">
        {TOP_PLAYERS.map((p) => (
          <div key={p.rank} className="lb-preview__row">
            <span className="lb-preview__medal">{p.medal}</span>
            <div style={{ flex: 1 }}>
              <div className="lb-preview__name">{p.name}</div>
              <div className="lb-preview__pts">{p.pts} PTS</div>
            </div>
          </div>
        ))}
        <PixelButton
          text="VIEW FULL ▶"
          type="gold"
          onClick={() => navigate("/leaderboard")}
          style={{ marginTop: "4px" }}
        />
      </div>
    </div>
  );
}
