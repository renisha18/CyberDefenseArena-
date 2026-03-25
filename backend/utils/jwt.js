// ── utils/jwt.js ──────────────────────────────────────────────────────────
// JWT helpers + cookie writer.
// The cookie is HTTP-only so JavaScript on the client can never read it.

const jwt = require("jsonwebtoken");
require("dotenv").config();

const SECRET  = process.env.JWT_SECRET     || "dev_secret_change_in_prod";
const EXPIRES = process.env.JWT_EXPIRES_IN || "7d";

// Cookie name used everywhere
const COOKIE_NAME = "cda_token";

function signToken(userId) {
  return jwt.sign({ id: userId }, SECRET, { expiresIn: EXPIRES });
}

function verifyToken(token) {
  return jwt.verify(token, SECRET);
}

/**
 * Attach the JWT as an HTTP-only cookie on the response.
 * Secure: true in production (HTTPS only).
 * sameSite: "lax" works for same-site navigations and is CSRF-resistant.
 */
function setTokenCookie(res, userId) {
  const token = signToken(userId);
  res.cookie(COOKIE_NAME, token, {
    httpOnly:  true,
    secure:    process.env.NODE_ENV === "production",
    sameSite:  process.env.NODE_ENV === "production" ? "strict" : "lax",
    maxAge:    7 * 24 * 60 * 60 * 1000,
  });
}

/**
 * Clear the auth cookie (used on logout).
 */
function clearTokenCookie(res) {
  res.clearCookie(COOKIE_NAME, { httpOnly: true, sameSite: "lax" });
}

module.exports = { signToken, verifyToken, setTokenCookie, clearTokenCookie, COOKIE_NAME };
