// ── src/routes/ProtectedRoute.jsx ────────────────────────────────────────
// Wraps any route that requires login.
// Shows a loading screen while the session cookie is being verified,
// then redirects to /login if no valid session exists.

import { Navigate } from "react-router-dom";
import { useAuth }   from "../context/AuthContext";

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  // While /auth/me is in-flight, show a neutral loading screen
  // so we don't flash the login page on every refresh.
  if (loading) {
    return (
      <div style={{
        width: "100vw", height: "100vh", background: "#0a0e1a",
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        <span style={{
          fontFamily: "'Press Start 2P', monospace", fontSize: "8px",
          color: "#00f5ff", animation: "blink 1s infinite",
          textShadow: "0 0 8px #00f5ff",
        }}>
          LOADING SESSION...
        </span>
      </div>
    );
  }

  return user ? children : <Navigate to="/login" replace />;
}
