// ── src/context/AuthContext.jsx ───────────────────────────────────────────
// Handles login / session / logout only.
// After login it dispatches SYNC_FROM_AUTH to GameStateContext
// so the game state starts with the real XP / streak / health from the DB.

import { createContext, useContext, useState, useEffect, useCallback } from "react";
import api from "../services/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user,    setUser]    = useState(null);
  const [loading, setLoading] = useState(true);

  const restoreSession = useCallback(async () => {
    try {
      const { data } = await api.get("/auth/me");
      try {
        const { data: dash } = await api.get("/user/dashboard");
        setUser({ ...data.user, completedChallenges: dash.completedChallenges ?? 0 });
      } catch {
        setUser(data.user);
      }
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { restoreSession(); }, [restoreSession]);

  async function login({ email, password }) {
    const { data } = await api.post("/auth/login", { email, password });
    try {
      const { data: dash } = await api.get("/user/dashboard");
      setUser({ ...data.user, completedChallenges: dash.completedChallenges ?? 0 });
    } catch {
      setUser(data.user);
    }
    return data.user;
  }

  async function signup({ username, email, password }) {
    const { data } = await api.post("/auth/signup", { username, email, password });
    setUser({ ...data.user, completedChallenges: 0 });
    return data.user;
  }

  async function logout() {
    try { await api.post("/auth/logout"); } catch { /* ignore */ }
    setUser(null);
  }

  // Called by module pages after backend responds — keeps auth user in sync
  function updateStats({ healthScore, xp, streak }) {
    setUser((prev) => prev ? {
      ...prev,
      healthScore,
      xp,
      streak,
      completedChallenges: (prev.completedChallenges ?? 0) + 1,
    } : prev);
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout, updateStats }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
