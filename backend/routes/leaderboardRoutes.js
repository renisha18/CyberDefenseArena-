// ── routes/leaderboardRoutes.js ───────────────────────────────────────────
// Leaderboard is intentionally public — no auth required.
// This lets the landing page show rankings without login.

const express        = require("express");
const UserController = require("../controllers/userController");

const router = express.Router();

// GET /api/leaderboard?limit=10
router.get("/", UserController.getLeaderboard);

module.exports = router;
