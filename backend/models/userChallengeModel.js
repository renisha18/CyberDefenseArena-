// ── models/userChallengeModel.js ──────────────────────────────────────────
// Rule change: 1 per MODULE per day (was: 1 per day total).
// Allows up to 4 submissions per day — one per module category.

const db = require("../config/db");

const UserChallengeModel = {

  async getByUser(userId) {
    const [rows] = await db.execute(
      "SELECT * FROM user_challenges WHERE user_id = ?",
      [userId]
    );
    return rows;
  },

  // ── NEW: checks if THIS MODULE was already completed today ─────────────
  // Used by gameService.validateSubmission instead of old completedToday()
  async completedModuleToday(userId, category) {
    const today = new Date().toISOString().split("T")[0];
    const [rows] = await db.execute(
      `SELECT uc.id
       FROM user_challenges uc
       JOIN challenges c ON c.id = uc.challenge_id
       WHERE uc.user_id     = ?
         AND uc.completed   = TRUE
         AND uc.completed_date = ?
         AND c.category     = ?
       LIMIT 1`,
      [userId, today, category]
    );
    return rows.length > 0;
  },

  // ── NEW: how many distinct modules completed today (0–4) ───────────────
  // Used by userController.getDashboard for the "X/4 today" pill
  async modulesCompletedToday(userId) {
    const today = new Date().toISOString().split("T")[0];
    const [rows] = await db.execute(
      `SELECT COUNT(DISTINCT c.category) AS cnt
       FROM user_challenges uc
       JOIN challenges c ON c.id = uc.challenge_id
       WHERE uc.user_id       = ?
         AND uc.completed     = TRUE
         AND uc.completed_date = ?`,
      [userId, today]
    );
    return rows[0].cnt;
  },

  // Kept for backward compat (phishingController status endpoint)
  async completedToday(userId) {
    const today = new Date().toISOString().split("T")[0];
    const [rows] = await db.execute(
      `SELECT id FROM user_challenges
       WHERE user_id = ? AND completed = TRUE AND completed_date = ?
       LIMIT 1`,
      [userId, today]
    );
    return rows.length > 0;
  },

  async isCompleted(userId, challengeId) {
    const [rows] = await db.execute(
      `SELECT id FROM user_challenges
       WHERE user_id = ? AND challenge_id = ? AND completed = TRUE
       LIMIT 1`,
      [userId, challengeId]
    );
    return rows.length > 0;
  },

  async markComplete(userId, challengeId) {
    const today = new Date().toISOString().split("T")[0];
    await db.execute(
      `INSERT INTO user_challenges (user_id, challenge_id, completed, completed_date)
       VALUES (?, ?, TRUE, ?)
       ON DUPLICATE KEY UPDATE completed = TRUE, completed_date = ?`,
      [userId, challengeId, today, today]
    );
  },

  async countCompleted(userId) {
    const [rows] = await db.execute(
      `SELECT COUNT(*) AS total FROM user_challenges
       WHERE user_id = ? AND completed = TRUE`,
      [userId]
    );
    return rows[0].total;
  },

  async maxCompletedLevel(userId) {
    const [rows] = await db.execute(
      `SELECT COALESCE(MAX(c.level), 0) AS max_level
       FROM user_challenges uc
       JOIN challenges c ON c.id = uc.challenge_id
       WHERE uc.user_id = ? AND uc.completed = TRUE`,
      [userId]
    );
    return rows[0].max_level;
  },
};

module.exports = UserChallengeModel;
