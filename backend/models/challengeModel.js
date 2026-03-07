// ── models/challengeModel.js ──────────────────────────────────────────────
// All database queries that touch the `challenges` table.

const db = require("../config/db");

const ChallengeModel = {
  /**
   * Return all challenges ordered by level.
   */
  async getAll() {
    const [rows] = await db.execute(
      "SELECT * FROM challenges ORDER BY level ASC"
    );
    return rows;
  },

  /**
   * Return a single challenge by id.
   */
  async findById(id) {
    const [rows] = await db.execute(
      "SELECT * FROM challenges WHERE id = ? LIMIT 1",
      [id]
    );
    return rows[0] || null;
  },
};

module.exports = ChallengeModel;
