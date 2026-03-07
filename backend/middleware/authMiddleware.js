// ── middleware/authMiddleware.js ───────────────────────────────────────────
// Reads the JWT from the HTTP-only cookie (not the Authorization header).
// Attaches req.user = { id } on success.

const { verifyToken, COOKIE_NAME } = require("../utils/jwt");

function protect(req, res, next) {
  const token = req.cookies?.[COOKIE_NAME];

  if (!token) {
    return res.status(401).json({ error: "Not authenticated. Please log in." });
  }

  try {
    const decoded = verifyToken(token);
    req.user = { id: decoded.id };
    next();
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({ error: "Session expired. Please log in again." });
    }
    return res.status(401).json({ error: "Invalid session." });
  }
}

module.exports = { protect };
