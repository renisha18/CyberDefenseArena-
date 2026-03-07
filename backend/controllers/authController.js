// ── controllers/authController.js ─────────────────────────────────────────
// Signup and Login — both set an HTTP-only cookie instead of returning a token.
// The frontend never sees or stores the JWT itself.

const bcrypt                            = require("bcryptjs");
const UserModel                         = require("../models/userModel");
const { setTokenCookie, clearTokenCookie } = require("../utils/jwt");

const BCRYPT_ROUNDS = 12;

const AuthController = {

  // ── POST /api/auth/signup ──────────────────────────────────────────────
  async signup(req, res) {
    try {
      const { username, email, password } = req.body;

      // Validation
      if (!username || !email || !password)
        return res.status(400).json({ error: "username, email and password are required." });
      if (username.length < 3 || username.length > 50)
        return res.status(400).json({ error: "Username must be 3–50 characters." });
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
        return res.status(400).json({ error: "Invalid email address." });
      if (password.length < 6)
        return res.status(400).json({ error: "Password must be at least 6 characters." });

      // Duplicate check
      if (await UserModel.findByEmail(email))
        return res.status(409).json({ error: "An account with this email already exists." });
      if (await UserModel.findByUsername(username))
        return res.status(409).json({ error: "That username is already taken." });

      // Create user
      const hashedPassword = await bcrypt.hash(password, BCRYPT_ROUNDS);
      const userId = await UserModel.create({ username, email, hashedPassword });

      // Set HTTP-only cookie — client never sees the token
      setTokenCookie(res, userId);

      return res.status(201).json({
        message: "Account created successfully.",
        user: {
          id:          userId,
          username,
          email,
          healthScore: 50,
          xp:          0,
          streak:      0,
        },
      });
    } catch (err) {
      console.error("[Auth] Signup error:", err.message);
      return res.status(500).json({ error: "Server error. Please try again." });
    }
  },

  // ── POST /api/auth/login ───────────────────────────────────────────────
  async login(req, res) {
    try {
      const { email, password } = req.body;

      if (!email || !password)
        return res.status(400).json({ error: "email and password are required." });

      const user = await UserModel.findByEmail(email);
      if (!user)
        return res.status(401).json({ error: "Invalid email or password." });

      const match = await bcrypt.compare(password, user.password);
      if (!match)
        return res.status(401).json({ error: "Invalid email or password." });

      // Set HTTP-only cookie
      setTokenCookie(res, user.id);

      return res.status(200).json({
        message: "Login successful.",
        user: {
          id:          user.id,
          username:    user.username,
          email:       user.email,
          healthScore: user.health_score,
          xp:          user.xp,
          streak:      user.streak,
        },
      });
    } catch (err) {
      console.error("[Auth] Login error:", err.message);
      return res.status(500).json({ error: "Server error. Please try again." });
    }
  },

  // ── POST /api/auth/logout ──────────────────────────────────────────────
  async logout(req, res) {
    clearTokenCookie(res);
    return res.status(200).json({ message: "Logged out successfully." });
  },

  // ── GET /api/auth/me ───────────────────────────────────────────────────
  // Called on page load to restore session from cookie.
  // Returns the user if the cookie is valid, 401 if not.
  async me(req, res) {
    // req.user is set by the protect middleware
    const user = await UserModel.findById(req.user.id);
    if (!user) return res.status(404).json({ error: "User not found." });

    return res.status(200).json({
      user: {
        id:          user.id,
        username:    user.username,
        email:       user.email,
        healthScore: user.health_score,
        xp:          user.xp,
        streak:      user.streak,
      },
    });
  },
};

module.exports = AuthController;
