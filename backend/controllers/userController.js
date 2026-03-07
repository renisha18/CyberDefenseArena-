// ── controllers/userController.js ─────────────────────────────────────────
// Returns player stats for the dashboard and the global leaderboard.

const db                  = require("../config/db");
const UserModel           = require("../models/userModel");
const UserChallengeModel  = require("../models/userChallengeModel");

const UserController = {
  // ── GET /api/user/dashboard ────────────────────────────────────────────
  // Returns everything the React Dashboard needs in one call.
  async getDashboard(req, res) {
    try {
      const userId = req.user.id;

      const user = await UserModel.findById(userId);
      if (!user) {
        return res.status(404).json({ error: "User not found." });
      }

      const completedChallenges = await UserChallengeModel.countCompleted(userId);
      const maxLevel            = await UserChallengeModel.maxCompletedLevel(userId);

      return res.status(200).json({
        username:             user.username,
        healthScore:          user.health_score,
        xp:                   user.xp,
        streak:               user.streak,
        completedChallenges,
        currentLevel:         maxLevel + 1, // next challenge level
        lastActive:           user.last_active,
      });
    } catch (err) {
      console.error("[User] Dashboard error:", err.message);
      return res.status(500).json({ error: "Server error." });
    }
  },

  // ── GET /api/user/profile ─────────────────────────────────────────────
  // Full profile including completed challenge list.
  async getProfile(req, res) {
    try {
      const userId = req.user.id;
      const user   = await UserModel.findById(userId);
      if (!user) return res.status(404).json({ error: "User not found." });

      const challenges = await UserChallengeModel.getByUser(userId);

      return res.status(200).json({
        id:          user.id,
        username:    user.username,
        email:       user.email,
        healthScore: user.health_score,
        xp:          user.xp,
        streak:      user.streak,
        lastActive:  user.last_active,
        joinedAt:    user.created_at,
        challenges,
      });
    } catch (err) {
      console.error("[User] Profile error:", err.message);
      return res.status(500).json({ error: "Server error." });
    }
  },

  // ── GET /api/leaderboard ──────────────────────────────────────────────
  // Top 10 players ordered by health_score, then xp as tiebreaker.
  async getLeaderboard(req, res) {
    try {
      const limit = Math.min(parseInt(req.query.limit) || 10, 50);

      const [rows] = await db.execute(
        `SELECT
           id,
           username,
           health_score AS healthScore,
           xp,
           streak,
           (SELECT COUNT(*) FROM user_challenges uc WHERE uc.user_id = u.id AND uc.completed = TRUE)
             AS completedChallenges
         FROM users u
         ORDER BY health_score DESC, xp DESC
         LIMIT ?`,
        [limit]
      );

      // Add rank numbers
      const ranked = rows.map((player, index) => ({
        rank: index + 1,
        ...player,
      }));

      return res.status(200).json(ranked);
    } catch (err) {
      console.error("[User] Leaderboard error:", err.message);
      return res.status(500).json({ error: "Server error." });
    }
  },
};

module.exports = UserController;
