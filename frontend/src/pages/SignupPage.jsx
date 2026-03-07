// ── src/pages/SignupPage.jsx ──────────────────────────────────────────────
import { useState }            from "react";
import { useNavigate, Link }   from "react-router-dom";
import { useAuth }             from "../context/AuthContext";
import AuthCard                from "../components/AuthCard";
import PixelInput              from "../components/PixelInput";
import Scanlines               from "../components/Scanlines";
import MatrixRain              from "../components/MatrixRain";

export default function SignupPage() {
  const navigate        = useNavigate();
  const { signup }      = useAuth();

  const [form, setForm]       = useState({ username: "", email: "", password: "", confirm: "" });
  const [errors, setErrors]   = useState({});
  const [apiError, setApiError] = useState("");
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
    setErrors((p) => ({ ...p, [e.target.name]: "" }));
    setApiError("");
  }

  function validate() {
    const e = {};
    if (!form.username || form.username.trim().length < 3)
      e.username = "Username must be at least 3 characters";
    if (!form.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      e.email = "Valid email is required";
    if (!form.password || form.password.length < 6)
      e.password = "Password must be at least 6 characters";
    if (form.password !== form.confirm)
      e.confirm = "Passwords do not match";
    return e;
  }

  async function handleSubmit() {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }

    setLoading(true);
    try {
      await signup({
        username: form.username.trim(),
        email:    form.email.trim(),
        password: form.password,
      });
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

      <div style={{ position: "relative", zIndex: 5, width: "100%", overflowY: "auto", padding: "20px 0" }}>
        <AuthCard title="NEW AGENT" subtitle="Create your account to start training">
          <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>

            <PixelInput label="USERNAME" name="username"
              value={form.username} onChange={handleChange} onKeyDown={onKey}
              placeholder="e.g. CyberNinja" error={errors.username} />

            <PixelInput label="EMAIL" name="email" type="email"
              value={form.email} onChange={handleChange} onKeyDown={onKey}
              placeholder="agent@company.com" error={errors.email} />

            <PixelInput label="PASSWORD" name="password" type="password"
              value={form.password} onChange={handleChange} onKeyDown={onKey}
              placeholder="min. 6 characters" error={errors.password} />

            <PixelInput label="CONFIRM PASSWORD" name="confirm" type="password"
              value={form.confirm} onChange={handleChange} onKeyDown={onKey}
              placeholder="repeat password" error={errors.confirm} />

            {/* Password strength hint */}
            {form.password.length > 0 && form.password.length < 6 && !errors.password && (
              <div style={{ fontFamily: "'Press Start 2P', monospace", fontSize: "5px", color: "#ffd700" }}>
                ⚡ {6 - form.password.length} more character{6 - form.password.length !== 1 ? "s" : ""} needed
              </div>
            )}

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
              {loading ? "CREATING..." : "▶ CREATE ACCOUNT"}
            </button>

            <div style={{
              fontFamily: "'Press Start 2P', monospace",
              fontSize: "5px", color: "rgba(0,245,255,.4)",
              textAlign: "center", marginTop: "4px",
            }}>
              Already an agent?{" "}
              <Link to="/login" style={{ color: "#00f5ff", textDecoration: "underline" }}>
                LOG IN
              </Link>
            </div>

          </div>
        </AuthCard>
      </div>
    </div>
  );
}
