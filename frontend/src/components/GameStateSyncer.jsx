// ── src/components/GameStateSyncer.jsx ───────────────────────────────────
// Tiny invisible component placed inside App.
// Watches AuthContext user and syncs XP / streak / health into GameStateContext.
// This is the ONLY bridge between the two contexts — clean separation of concerns.
//
// Usage: place <GameStateSyncer /> once inside <GameStateProvider> in App.jsx

import { useEffect } from "react";
import { useAuth }   from "../context/AuthContext";
import { useGameState } from "../context/GameStateContext";

export default function GameStateSyncer() {
  const { user }          = useAuth();
  const { dispatch }      = useGameState();

  useEffect(() => {
    if (!user) return;
    dispatch({
      type: "SYNC_FROM_AUTH",
      payload: {
        xp:          user.xp          ?? 0,
        streak:      user.streak       ?? 0,
        healthScore: user.healthScore  ?? 70,
      },
    });
  }, [user?.xp, user?.streak, user?.healthScore]); // eslint-disable-line

  return null; // renders nothing
}
