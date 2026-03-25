// ── controllers/userController.js ─────────────────────────────────────────
// Added: modulesCompletedToday in getDashboard response.

const db                  = require("../config/db");
const UserModel           = require("../models/userModel");
const UserChallengeModel  = require("../models/userChallengeModel");

const UserController = {

  async getDashboard(req, res) {
    try {
      const userId = req.user.id;

      const user = await UserModel.findById(userId);
      if (!user) return res.status(404).json({ error: "User not found." });

      const [completedChallenges, maxLevel, modulesCompletedToday] = await Promise.all([
        UserChallengeModel.countCompleted(userId),
        UserChallengeModel.maxCompletedLevel(userId),
        UserChallengeModel.modulesCompletedToday(userId),
      ]);

      return res.status(200).json({
        username:              user.username,
        healthScore:           user.health_score,
        xp:                    user.xp,
        streak:                user.streak,
        completedChallenges,
        currentLevel:          maxLevel + 1,
        lastActive:            user.last_active,
        modulesCompletedToday,  // 0–4, used for "X/4 today" pill on Dashboard
      });
    } catch (err) {
      console.error("[User] Dashboard error:", err.message);
      return res.status(500).json({ error: "Server error." });
    }
  },

  async getProfile(req, res) {
    try {
      const userId   = req.user.id;
      const user     = await UserModel.findById(userId);
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
           (SELECT COUNT(*) FROM user_challenges uc
            WHERE uc.user_id = u.id AND uc.completed = TRUE) AS completedChallenges
         FROM users u
         ORDER BY health_score DESC, xp DESC
         LIMIT ?`,
        [limit]
      );
      const ranked = rows.map((player, index) => ({ rank: index + 1, ...player }));
      return res.status(200).json(ranked);
    } catch (err) {
      console.error("[User] Leaderboard error:", err.message);
      return res.status(500).json({ error: "Server error." });
    }
  },
};

module.exports = UserController;
