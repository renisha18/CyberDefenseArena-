// ── models/userChallengeModel.js ──────────────────────────────────────────
// Junction table queries: which challenges has a user completed?

const db = require("../config/db");

const UserChallengeModel = {
  /**
   * Return all user_challenge rows for a given user.
   */
  async getByUser(userId) {
    const [rows] = await db.execute(
      "SELECT * FROM user_challenges WHERE user_id = ?",
      [userId]
    );
    return rows;
  },

  /**
   * Check if a user already completed ANY challenge today.
   * Enforces the "one challenge per day" rule.
   */
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

  /**
   * Check if a specific challenge was already completed by this user.
   */
  async isCompleted(userId, challengeId) {
    const [rows] = await db.execute(
      `SELECT id FROM user_challenges
       WHERE user_id = ? AND challenge_id = ? AND completed = TRUE
       LIMIT 1`,
      [userId, challengeId]
    );
    return rows.length > 0;
  },

  /**
   * Mark a challenge as completed for a user (upsert pattern).
   */
  async markComplete(userId, challengeId) {
    const today = new Date().toISOString().split("T")[0];
    await db.execute(
      `INSERT INTO user_challenges (user_id, challenge_id, completed, completed_date)
       VALUES (?, ?, TRUE, ?)
       ON DUPLICATE KEY UPDATE completed = TRUE, completed_date = ?`,
      [userId, challengeId, today, today]
    );
  },

  /**
   * Count how many challenges a user has completed in total.
   */
  async countCompleted(userId) {
    const [rows] = await db.execute(
      `SELECT COUNT(*) AS total FROM user_challenges
       WHERE user_id = ? AND completed = TRUE`,
      [userId]
    );
    return rows[0].total;
  },

  /**
   * Return the highest level challenge this user has completed.
   * Used to determine which next challenge is unlocked.
   */
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
