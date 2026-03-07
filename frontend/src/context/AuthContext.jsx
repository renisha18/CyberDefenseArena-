// ── src/context/AuthContext.jsx ───────────────────────────────────────────
// Single source of truth for auth state.
// On mount, calls GET /api/auth/me to restore session from the HTTP-only
// cookie — this is how the app knows if the user is already logged in after
// a page refresh without touching localStorage at all.

import { createContext, useContext, useState, useEffect, useCallback } from "react";
import api from "../services/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user,    setUser]    = useState(null);   // null = not logged in
  const [loading, setLoading] = useState(true);   // true while restoring session

  // ── Restore session on page load ─────────────────────────────────────
  // The browser sends the HTTP-only cookie automatically.
  // If valid → setUser. If not → setUser(null) (silent, no redirect here).
  const restoreSession = useCallback(async () => {
    try {
      const { data } = await api.get("/auth/me");
      setUser(data.user);
    } catch {
      setUser(null); // cookie absent or expired — user must log in
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { restoreSession(); }, [restoreSession]);

  // ── Login ─────────────────────────────────────────────────────────────
  // Backend sets the HTTP-only cookie; we just store the user object in state.
  async function login({ email, password }) {
    const { data } = await api.post("/auth/login", { email, password });
    setUser(data.user);
    return data.user;
  }

  // ── Signup ────────────────────────────────────────────────────────────
  async function signup({ username, email, password }) {
    const { data } = await api.post("/auth/signup", { username, email, password });
    setUser(data.user);
    return data.user;
  }

  // ── Logout ────────────────────────────────────────────────────────────
  // Backend clears the cookie; we clear user state.
  async function logout() {
    try { await api.post("/auth/logout"); } catch { /* ignore */ }
    setUser(null);
  }

  // ── Update player stats locally after challenge completion ────────────
  // Avoids a full re-fetch just to update health/xp/streak.
  function updateStats({ healthScore, xp, streak }) {
    setUser((prev) => prev ? { ...prev, healthScore, xp, streak } : prev);
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout, updateStats }}>
      {children}
    </AuthContext.Provider>
  );
}

// Convenience hook
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
