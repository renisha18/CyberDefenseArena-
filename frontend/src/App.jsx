// ── src/App.jsx ───────────────────────────────────────────────────────────
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider, useAuth }         from "./context/AuthContext";
import { GameStateProvider }             from "./context/GameStateContext";
import ProtectedRoute                    from "./routes/ProtectedRoute";

// Pages
import LandingPage     from "./pages/LandingPage";
import LoginPage       from "./pages/LoginPage";
import SignupPage      from "./pages/SignupPage";
import IntroPage       from "./pages/IntroPage";
import Dashboard       from "./pages/Dashboard";
import LeaderboardPage from "./pages/LeaderboardPage";
import TrainingPage    from "./pages/TrainingPage";
import NotFoundPage    from "./pages/NotFoundPage";
import ScenarioRouter  from "./pages/ScenarioRouter";

// Modules — training order kept intact
import PhishingChallenge from "./modules/phishing/pages/PhishingChallenge";
import PasswordChallenge from "./modules/password/pages/PasswordChallenge";
import SocialChallenge   from "./pages/SocialChallenge";
import MalwareChallenge  from "./pages/MalwareChallenge";

// Styles
import "./styles/global.css";
import "./styles/components.css";
import "./styles/landing.css";
import "./styles/dashboard.css";

function LandingWrapper() {
  const { user, loading } = useAuth();
  if (loading) return null;
  return (
    <LandingPage
      onEnter={() => { window.location.href = user ? "/main" : "/login"; }}
    />
  );
}

function AppRoutes() {
  return (
    <Routes>

      {/* Public */}
      <Route path="/"            element={<LandingWrapper />} />
      <Route path="/login"       element={<LoginPage />} />
      <Route path="/signup"      element={<SignupPage />} />
      <Route path="/leaderboard" element={<LeaderboardPage />} />
      <Route path="/intro"       element={<ProtectedRoute><IntroPage /></ProtectedRoute>} />

      {/* Dashboard + Training */}
      <Route path="/main"     element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/training" element={<ProtectedRoute><TrainingPage /></ProtectedRoute>} />

      {/* Daily Challenge — random engine, cross-module */}
      <Route path="/scenario/next" element={<ProtectedRoute><ScenarioRouter /></ProtectedRoute>} />

      {/* Module pages — used by Training (module order) and by ScenarioRouter redirect */}
      <Route path="/challenge/phishing/:level" element={<ProtectedRoute><PhishingChallenge /></ProtectedRoute>} />
      <Route path="/challenge/password/:level" element={<ProtectedRoute><PasswordChallenge /></ProtectedRoute>} />
      <Route path="/challenge/social/:level"   element={<ProtectedRoute><SocialChallenge /></ProtectedRoute>} />
      <Route path="/challenge/malware/:level"  element={<ProtectedRoute><MalwareChallenge /></ProtectedRoute>} />

      {/* 404 */}
      <Route path="*" element={<NotFoundPage />} />

    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        {/*
          GameStateProvider is INSIDE AuthProvider.
          This means it renders after the user is known,
          and Dashboard can safely call dispatch({ type: "SYNC_HEALTH" }).
        */}
        <GameStateProvider>
          <AppRoutes />
        </GameStateProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
