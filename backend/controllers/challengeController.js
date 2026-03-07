// ── controllers/challengeController.js ───────────────────────────────────
// All challenge game logic lives here.
//
// Rules enforced:
//   1. One challenge completion per day (calendar day, UTC)
//   2. Sequential unlock: challenge N unlocks only after N-1 is done
//   3. health_score and xp are rewarded on successful completion
//   4. Streak is updated based on consecutive daily activity

const ChallengeModel     = require("../models/challengeModel");
const UserChallengeModel = require("../models/userChallengeModel");
const UserModel          = require("../models/userModel");

const ChallengeController = {
  // ── GET /api/challenges ───────────────────────────────────────────────
  // Returns every challenge with a status field:
  //   "completed" | "unlocked" | "locked"
  async getChallenges(req, res) {
    try {
      const userId = req.user.id;

      const [allChallenges, userProgress] = await Promise.all([
        ChallengeModel.getAll(),
        UserChallengeModel.getByUser(userId),
      ]);

      const maxLevel = await UserChallengeModel.maxCompletedLevel(userId);

      const completedIds = new Set(
        userProgress.filter((uc) => uc.completed).map((uc) => uc.challenge_id)
      );

      const withStatus = allChallenges.map((ch) => {
        let status;
        if (completedIds.has(ch.id)) {
          status = "completed";
        } else if (ch.level <= maxLevel + 1) {
          status = "unlocked";
        } else {
          status = "locked";
        }

        return {
          id:           ch.id,
          title:        ch.title,
          description:  ch.description,
          category:     ch.category,
          healthReward: ch.health_reward,
          xpReward:     ch.xp_reward,
          level:        ch.level,
          status,
        };
      });

      return res.status(200).json(withStatus);
    } catch (err) {
      console.error("[Challenge] List error:", err.message);
      return res.status(500).json({ error: "Server error." });
    }
  },

  // ── GET /api/challenges/:id ───────────────────────────────────────────
  // Single challenge detail (used when the player opens a challenge room).
  async getChallengeById(req, res) {
    try {
      const userId      = req.user.id;
      const challengeId = parseInt(req.params.id);

      if (isNaN(challengeId)) {
        return res.status(400).json({ error: "Invalid challenge id." });
      }

      const challenge = await ChallengeModel.findById(challengeId);
      if (!challenge) {
        return res.status(404).json({ error: "Challenge not found." });
      }

      const maxLevel    = await UserChallengeModel.maxCompletedLevel(userId);
      const isCompleted = await UserChallengeModel.isCompleted(userId, challengeId);

      let status;
      if (isCompleted)                        status = "completed";
      else if (challenge.level <= maxLevel + 1) status = "unlocked";
      else                                    status = "locked";

      return res.status(200).json({
        id:           challenge.id,
        title:        challenge.title,
        description:  challenge.description,
        category:     challenge.category,
        healthReward: challenge.health_reward,
        xpReward:     challenge.xp_reward,
        level:        challenge.level,
        status,
      });
    } catch (err) {
      console.error("[Challenge] GetById error:", err.message);
      return res.status(500).json({ error: "Server error." });
    }
  },

  // ── POST /api/challenges/complete ────────────────────────────────────
  // Called when the player successfully completes a challenge in the UI.
  //
  // Request body: { challengeId: number }
  //
  // Response: updated player stats + new streak value
  async completeChallenge(req, res) {
    try {
      const userId      = req.user.id;
      const challengeId = parseInt(req.body.challengeId);

      if (isNaN(challengeId)) {
        return res.status(400).json({ error: "challengeId must be a number." });
      }

      // ── 1. Fetch the challenge ─────────────────────────────────────────
      const challenge = await ChallengeModel.findById(challengeId);
      if (!challenge) {
        return res.status(404).json({ error: "Challenge not found." });
      }

      // ── 2. Fetch the user ──────────────────────────────────────────────
      const user = await UserModel.findById(userId);
      if (!user) {
        return res.status(404).json({ error: "User not found." });
      }

      // ── 3. Check sequential unlock ────────────────────────────────────
      const maxLevel = await UserChallengeModel.maxCompletedLevel(userId);
      if (challenge.level > maxLevel + 1) {
        return res.status(403).json({
          error: "This challenge is locked. Complete the previous challenge first.",
        });
      }

      // ── 4. Already completed this challenge? ──────────────────────────
      const alreadyDone = await UserChallengeModel.isCompleted(userId, challengeId);
      if (alreadyDone) {
        return res.status(409).json({
          error: "You have already completed this challenge.",
        });
      }

      // ── 5. One challenge per day rule ─────────────────────────────────
      const doneToday = await UserChallengeModel.completedToday(userId);
      if (doneToday) {
        return res.status(429).json({
          error: "You have already completed a challenge today. Come back tomorrow!",
          retryAfter: "tomorrow",
        });
      }

      // ── 6. Mark complete, apply rewards, update streak ────────────────
      await UserChallengeModel.markComplete(userId, challengeId);
      await UserModel.addRewards(userId, challenge.health_reward, challenge.xp_reward);

      // last_active is stored as a DATE string e.g. "2025-03-06"
      const lastActiveStr = user.last_active
        ? new Date(user.last_active).toISOString().split("T")[0]
        : null;

      const newStreak = await UserModel.updateStreak(
        userId,
        lastActiveStr,
        user.streak
      );

      // ── 7. Return updated player state ────────────────────────────────
      const updated = await UserModel.findById(userId);

      return res.status(200).json({
        message:        `Challenge "${challenge.title}" completed!`,
        healthReward:   challenge.health_reward,
        xpReward:       challenge.xp_reward,
        streak:         newStreak,
        player: {
          healthScore: updated.health_score,
          xp:          updated.xp,
          streak:      updated.streak,
        },
      });
    } catch (err) {
      console.error("[Challenge] Complete error:", err.message);
      return res.status(500).json({ error: "Server error." });
    }
  },
};

module.exports = ChallengeController;
