// ── src/App.jsx ───────────────────────────────────────────────────────────
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth }                   from "./context/AuthContext";
import ProtectedRoute                              from "./routes/ProtectedRoute";

// Pages
import LandingPage     from "./pages/LandingPage";
import LoginPage       from "./pages/LoginPage";
import SignupPage      from "./pages/SignupPage";
import Dashboard       from "./pages/Dashboard";
import LeaderboardPage from "./pages/LeaderboardPage";
import TrainingPage    from "./pages/TrainingPage";
import NotFoundPage    from "./pages/NotFoundPage";

// Module 1 — Phishing
import PhishingChallenge from "./modules/phishing/pages/PhishingChallenge";

// Module 2 — Password
import PasswordChallenge from "./modules/password/pages/PasswordChallenge";

// Module 3 — Social Engineering
//import SocialChallenge from "./modules/social/pages/SocialChallenge";

// Module 4 — Malware
//import MalwareChallenge from "./modules/malware/pages/MalwareChallenge";

// Styles
import "./styles/global.css";
import "./styles/components.css";
import "./styles/landing.css";
import "./styles/dashboard.css";

// ── Landing: skip auth screen if already logged in ────────────────────────
function LandingWrapper() {
  const { user, loading } = useAuth();
  if (loading) return null;
  return (
    <LandingPage
      onEnter={() => { window.location.href = user ? "/main" : "/login"; }}
    />
  );
}

// ── Routes ────────────────────────────────────────────────────────────────
function AppRoutes() {
  return (
    <Routes>

      {/* ── Public ── */}
      <Route path="/"            element={<LandingWrapper />} />
      <Route path="/login"       element={<LoginPage />} />
      <Route path="/signup"      element={<SignupPage />} />
      <Route path="/leaderboard" element={<LeaderboardPage />} />

      {/* ── Protected: dashboard & training ── */}
      <Route path="/main" element={
        <ProtectedRoute><Dashboard /></ProtectedRoute>
      } />
      <Route path="/training" element={
        <ProtectedRoute><TrainingPage /></ProtectedRoute>
      } />

      {/* ── Module 1: Phishing ── */}
      <Route path="/challenge/phishing/:level" element={
        <ProtectedRoute><PhishingChallenge /></ProtectedRoute>
      } />

      {/* ── Module 2: Password ── */}
      <Route path="/challenge/password/:level" element={
        <ProtectedRoute><PasswordChallenge /></ProtectedRoute>
      } />

      {/* ── Module 3: Social Engineering ── */}
      <Route path="/challenge/social/:level" element={
        <ProtectedRoute><SocialChallenge /></ProtectedRoute>
      } />

      {/* ── Module 4: Malware ── */}
      <Route path="/challenge/malware/:level" element={
        <ProtectedRoute><MalwareChallenge /></ProtectedRoute>
      } />

      {/* ── 404 ── */}
      <Route path="*" element={<NotFoundPage />} />

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
