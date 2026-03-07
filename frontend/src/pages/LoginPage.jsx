// ── src/pages/LoginPage.jsx ───────────────────────────────────────────────
import { useState }       from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth }         from "../context/AuthContext";
import AuthCard            from "../components/AuthCard";
import PixelInput          from "../components/PixelInput";
import Scanlines           from "../components/Scanlines";
import MatrixRain          from "../components/MatrixRain";

export default function LoginPage() {
  const navigate        = useNavigate();
  const { login }       = useAuth();

  const [form,    setForm]    = useState({ email: "", password: "" });
  const [errors,  setErrors]  = useState({});
  const [apiError,setApiError]= useState("");
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
    setErrors((p) => ({ ...p, [e.target.name]: "" }));
    setApiError("");
  }

  function validate() {
    const e = {};
    if (!form.email)    e.email    = "Email is required";
    if (!form.password) e.password = "Password is required";
    return e;
  }

  async function handleSubmit() {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }

    setLoading(true);
    try {
      await login({ email: form.email.trim(), password: form.password });
      navigate("/main");
    } catch (err) {
      setApiError(err.message);
    } finally {
      setLoading(false);
    }
  }

  const onKey = (e) => { if (e.key === "Enter") handleSubmit(); };

  return (
    <div style={{
      width: "100vw", height: "100vh", background: "#0a0e1a",
      display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      position: "relative", overflow: "hidden",
    }}>
      <MatrixRain opacity={0.07} />
      <Scanlines />

      <div style={{ position: "relative", zIndex: 5, width: "100%" }}>
        <AuthCard title="AGENT LOGIN" subtitle="Enter your credentials to access the arena">
          <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>

            <PixelInput label="EMAIL" name="email" type="email"
              value={form.email} onChange={handleChange} onKeyDown={onKey}
              placeholder="agent@company.com" error={errors.email} />

            <PixelInput label="PASSWORD" name="password" type="password"
              value={form.password} onChange={handleChange} onKeyDown={onKey}
              placeholder="••••••••" error={errors.password} />

            {/* API error */}
            {apiError && (
              <div style={{
                fontFamily: "'Press Start 2P', monospace", fontSize: "5px",
                color: "#ff2d55", background: "rgba(255,45,85,.07)",
                border: "1px solid rgba(255,45,85,.3)",
                padding: "8px 10px", lineHeight: "1.9",
              }}>
                ⚠ {apiError}
              </div>
            )}

            {/* Submit */}
            <button onClick={handleSubmit} disabled={loading} style={{
              fontFamily: "'Press Start 2P', monospace", fontSize: "7px",
              color:      loading ? "#555"    : "#0a0e1a",
              background: loading ? "transparent" : "#39ff14",
              border:     `2px solid ${loading ? "#555" : "#39ff14"}`,
              padding:    "14px", marginTop: "4px", letterSpacing: "2px",
              cursor:     loading ? "not-allowed" : "pointer",
              boxShadow:  loading ? "none" : "0 0 20px rgba(57,255,20,.5)",
              transition: "all .15s",
            }}>
              {loading ? "CONNECTING..." : "▶ ENTER ARENA"}
            </button>

            {/* Link to signup */}
            <div style={{
              fontFamily: "'Press Start 2P', monospace",
              fontSize: "5px", color: "rgba(0,245,255,.4)",
              textAlign: "center", marginTop: "4px",
            }}>
              New agent?{" "}
              <Link to="/signup" style={{ color: "#00f5ff", textDecoration: "underline" }}>
                CREATE ACCOUNT
              </Link>
            </div>

          </div>
        </AuthCard>
      </div>
    </div>
  );
}
