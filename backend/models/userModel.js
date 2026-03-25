// ── models/userModel.js ───────────────────────────────────────────────────
// All database queries that touch the `users` table.
// Controllers call these functions; they never write SQL themselves.

const db = require("../config/db");

let combatColumnsCache = null;

async function hasCombatColumns() {
  if (combatColumnsCache !== null) return combatColumnsCache;

  const [rows] = await db.execute("SHOW COLUMNS FROM users LIKE 'attacks_prevented'");
  const [rows2] = await db.execute("SHOW COLUMNS FROM users LIKE 'breaches_caused'");
  combatColumnsCache = rows.length > 0 && rows2.length > 0;
  return combatColumnsCache;
}

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
    const includeCombatColumns = await hasCombatColumns();
    const baseFields = "id, username, email, health_score, xp, streak, last_active, created_at";
    const extraFields = includeCombatColumns ? ", attacks_prevented, breaches_caused" : "";

    const [rows] = await db.execute(
      `SELECT ${baseFields}${extraFields}
       FROM users WHERE id = ? LIMIT 1`,
      [id]
    );
    const user = rows[0] || null;
    if (!user) return null;

    if (!includeCombatColumns) {
      user.attacks_prevented = 0;
      user.breaches_caused = 0;
    }
    return user;
  },

  /**
   * Create a new user row. Returns the insertId.
   */
  async create({ username, email, hashedPassword }) {
    const includeCombatColumns = await hasCombatColumns();
    const query = includeCombatColumns
      ? `INSERT INTO users (username, email, password, health_score, xp, streak, attacks_prevented, breaches_caused)
         VALUES (?, ?, ?, 50, 0, 0, 0, 0)`
      : `INSERT INTO users (username, email, password, health_score, xp, streak)
         VALUES (?, ?, ?, 50, 0, 0)`;

    const [result] = await db.execute(query, [username, email, hashedPassword]);
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
   * Apply a scenario result — correct or wrong — in a single query.
   * Correct:  health += reward (capped 100), xp += xpReward * streakMultiplier, attacks_prevented++
   * Wrong:    health -= penalty (floored 0), xp += floor(xpReward * 0.1), breaches_caused++
   *
   * streakMultiplier: streak > 5 → 1.5x XP, streak > 2 → 1.2x, else 1x
   */
  async applyActionResult(userId, { correct, healthDelta, xpBase, currentStreak }) {
    const multiplier = currentStreak > 5 ? 1.5 : currentStreak > 2 ? 1.2 : 1.0;
    const xpGained   = correct
      ? Math.round(xpBase * multiplier)
      : Math.round(xpBase * 0.1); // consolation XP for trying

    const includeCombatColumns = await hasCombatColumns();

    if (correct) {
      await db.execute(
        includeCombatColumns
          ? `UPDATE users
             SET health_score      = LEAST(health_score + ?, 100),
                 xp                = xp + ?,
                 attacks_prevented = attacks_prevented + 1
             WHERE id = ?`
          : `UPDATE users
             SET health_score = LEAST(health_score + ?, 100),
                 xp           = xp + ?
             WHERE id = ?`,
        [healthDelta, xpGained, userId]
      );
    } else {
      await db.execute(
        includeCombatColumns
          ? `UPDATE users
             SET health_score   = GREATEST(health_score - ?, 0),
                 xp             = xp + ?,
                 breaches_caused = breaches_caused + 1
             WHERE id = ?`
          : `UPDATE users
             SET health_score = GREATEST(health_score - ?, 0),
                 xp           = xp + ?
             WHERE id = ?`,
        [Math.abs(healthDelta), xpGained, userId]
      );
    }
    return { xpGained, multiplier };
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
