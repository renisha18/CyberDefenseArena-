// ── models/userModel.js ───────────────────────────────────────────────────
// All database queries that touch the `users` table.
// Controllers call these functions; they never write SQL themselves.

const db = require("../config/db");

const UserModel = {
  /**
   * Find a user by email address.
   */
  async findByEmail(email) {
    const [rows] = await db.execute(
      "SELECT * FROM users WHERE email = ? LIMIT 1",
      [email]
    );
    return rows[0] || null;
  },

  /**
   * Find a user by username.
   */
  async findByUsername(username) {
    const [rows] = await db.execute(
      "SELECT * FROM users WHERE username = ? LIMIT 1",
      [username]
    );
    return rows[0] || null;
  },

  /**
   * Find a user by primary key id.
   */
  async findById(id) {
    const [rows] = await db.execute(
      "SELECT id, username, email, health_score, xp, streak, last_active, created_at FROM users WHERE id = ? LIMIT 1",
      [id]
    );
    return rows[0] || null;
  },

  /**
   * Create a new user row. Returns the insertId.
   */
  async create({ username, email, hashedPassword }) {
    const [result] = await db.execute(
      `INSERT INTO users (username, email, password, health_score, xp, streak)
       VALUES (?, ?, ?, 50, 0, 0)`,
      [username, email, hashedPassword]
    );
    return result.insertId;
  },

  /**
   * Increase health_score and xp for a user.
   * Called when a challenge is completed.
   */
  async addRewards(userId, healthReward, xpReward) {
    await db.execute(
      `UPDATE users
       SET health_score = LEAST(health_score + ?, 100),
           xp           = xp + ?
       WHERE id = ?`,
      [healthReward, xpReward, userId]
    );
  },

  /**
   * Update the streak and last_active date.
   * streak++ if consecutive day, reset to 1 if gap, keep if same day.
   */
  async updateStreak(userId, lastActive, currentStreak) {
    const today     = new Date().toISOString().split("T")[0]; // YYYY-MM-DD
    const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];

    let newStreak = currentStreak;

    if (lastActive === null || lastActive < yesterday) {
      // First time ever, or missed a day → reset
      newStreak = 1;
    } else if (lastActive === yesterday) {
      // Completed yesterday → extend streak
      newStreak = currentStreak + 1;
    }
    // If lastActive === today the streak stays the same (already counted today)

    await db.execute(
      "UPDATE users SET streak = ?, last_active = ? WHERE id = ?",
      [newStreak, today, userId]
    );

    return newStreak;
  },

  /**
   * Decrement health_score (floored at 0) for wrong actions.
   */
  async applyHealthPenalty(userId, penalty) {
    await db.execute(
      "UPDATE users SET health_score = GREATEST(health_score - ?, 0) WHERE id = ?",
      [penalty, userId]
    );
  },
};

module.exports = UserModel;
