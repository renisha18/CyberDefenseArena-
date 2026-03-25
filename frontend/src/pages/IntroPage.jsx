import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import GameIntroAnimation from "../components/GameIntroAnimation";

function seenKey(userId) {
  return `cda:intro:seen:${userId}`;
}

function pendingKey(userId) {
  return `cda:intro:pending:${userId}`;
}

export default function IntroPage() {
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    if (!user?.id) return;

    const seen = localStorage.getItem(seenKey(user.id)) === "1";
    const pending = sessionStorage.getItem(pendingKey(user.id)) === "1";

    if (seen || !pending) {
      navigate("/main", { replace: true });
    }
  }, [navigate, user]);

  function finishIntro() {
    if (!user?.id) {
      navigate("/main", { replace: true });
      return;
    }

    localStorage.setItem(seenKey(user.id), "1");
    sessionStorage.removeItem(pendingKey(user.id));
    navigate("/main", { replace: true });
  }

  if (!user?.id) return null;

  return <GameIntroAnimation onComplete={finishIntro} onSkip={finishIntro} />;
}
