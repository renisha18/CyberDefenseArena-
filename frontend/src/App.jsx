// ── src/App.jsx ───────────────────────────────────────────────────────────
// Routes + AuthProvider wrapper.
// Auth state lives in AuthContext — no localStorage, no prop-drilling tokens.

import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth }                   from "./context/AuthContext";
import ProtectedRoute                              from "./routes/ProtectedRoute";

import LandingPage   from "./pages/LandingPage";
import LoginPage     from "./pages/LoginPage";
import SignupPage    from "./pages/SignupPage";
import Dashboard     from "./pages/Dashboard";
import ChallengePage from "./pages/ChallengePage";
import LeaderboardPage from "./pages/LeaderboardPage";
import TrainingPage  from "./pages/TrainingPage";

import "./styles/global.css";
import "./styles/components.css";
import "./styles/landing.css";
import "./styles/dashboard.css";

// ── Landing redirect logic ────────────────────────────────────────────────
// If already logged in, JOIN MISSION skips the auth screen entirely.
function LandingWrapper() {
  const { user, loading } = useAuth();
  if (loading) return null; // avoid flash
  return (
    <LandingPage
      onEnter={() => {
        window.location.href = user ? "/main" : "/login";
      }}
    />
  );
}

// ── App routes ────────────────────────────────────────────────────────────
function AppRoutes() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/"       element={<LandingWrapper />} />
      <Route path="/login"  element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />

      {/* Leaderboard is public — anyone can view rankings */}
      <Route path="/leaderboard" element={<LeaderboardPage />} />

      {/* Protected — require valid session cookie */}
      <Route path="/main" element={
        <ProtectedRoute><Dashboard /></ProtectedRoute>
      } />
      <Route path="/challenge" element={
        <ProtectedRoute><ChallengePage /></ProtectedRoute>
      } />
      <Route path="/training" element={
        <ProtectedRoute><TrainingPage /></ProtectedRoute>
      } />

      {/* Catch-all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}
