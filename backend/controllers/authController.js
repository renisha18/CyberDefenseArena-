// ── controllers/authController.js ─────────────────────────────────────────
// Signup and Login — both set an HTTP-only cookie instead of returning a token.
// The frontend never sees or stores the JWT itself.

const bcrypt                            = require("bcryptjs");
const UserModel                         = require("../models/userModel");
const { setTokenCookie, clearTokenCookie } = require("../utils/jwt");

const BCRYPT_ROUNDS = 12;

// helper to shape a user object consistently across all auth responses
function formatUser(user) {
  return {
    id:               user.id,
    username:         user.username,
    email:            user.email,
    healthScore:      user.health_score,
    xp:               user.xp,
    streak:           user.streak,
    attacksPrevented: user.attacks_prevented ?? 0,
    breachesCaused:   user.breaches_caused   ?? 0,
  };
}

const AuthController = {

  async signup(req, res) {
    try {
      const { username, email, password } = req.body;
      if (!username || !email || !password)
        return res.status(400).json({ error: "username, email and password are required." });
      if (username.length < 3 || username.length > 50)
        return res.status(400).json({ error: "Username must be 3–50 characters." });
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
        return res.status(400).json({ error: "Invalid email address." });
      if (password.length < 6)
        return res.status(400).json({ error: "Password must be at least 6 characters." });

      if (await UserModel.findByEmail(email))
        return res.status(409).json({ error: "An account with this email already exists." });
      if (await UserModel.findByUsername(username))
        return res.status(409).json({ error: "That username is already taken." });

      const hashedPassword = await bcrypt.hash(password, BCRYPT_ROUNDS);
      const userId = await UserModel.create({ username, email, hashedPassword });
      setTokenCookie(res, userId);

      return res.status(201).json({
        message: "Account created successfully.",
        user: { id: userId, username, email, healthScore: 50, xp: 0, streak: 0, attacksPrevented: 0, breachesCaused: 0 },
      });
    } catch (err) {
      console.error("[Auth] Signup error:", err.message);
      return res.status(500).json({ error: "Server error. Please try again." });
    }
  },

  async login(req, res) {
    try {
      const { email, password } = req.body;
      if (!email || !password)
        return res.status(400).json({ error: "email and password are required." });

      const user = await UserModel.findByEmail(email);
      if (!user) return res.status(401).json({ error: "Invalid email or password." });

      const match = await bcrypt.compare(password, user.password);
      if (!match) return res.status(401).json({ error: "Invalid email or password." });

      setTokenCookie(res, user.id);
      // Fetch full row so new columns are included
      const full = await UserModel.findById(user.id);
      return res.status(200).json({ message: "Login successful.", user: formatUser(full) });
    } catch (err) {
      console.error("[Auth] Login error:", err.message);
      return res.status(500).json({ error: "Server error. Please try again." });
    }
  },

  async logout(req, res) {
    clearTokenCookie(res);
    return res.status(200).json({ message: "Logged out successfully." });
  },

  async me(req, res) {
    try {
      const user = await UserModel.findById(req.user.id);
      if (!user) return res.status(404).json({ error: "User not found." });
      return res.status(200).json({ user: formatUser(user) });
    } catch (err) {
      console.error("[Auth] /me error:", err.message);
      return res.status(500).json({ error: "Server error. Please try again." });
    }
  },
};

module.exports = AuthController;
