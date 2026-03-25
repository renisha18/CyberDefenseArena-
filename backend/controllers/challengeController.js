// ── controllers/challengeController.js ───────────────────────────────────
const ChallengeModel     = require("../models/challengeModel");
const UserChallengeModel = require("../models/userChallengeModel");
const UserModel          = require("../models/userModel");
const { getChainAttack } = require("../services/chainAttackService");
const { checkForCrisis } = require("../services/crisisEngine");

const ChallengeController = {

  // ── GET /api/challenges ───────────────────────────────────────────────
  async getChallenges(req, res) {
    try {
      const userId = req.user.id;
      const [allChallenges, userProgress] = await Promise.all([
        ChallengeModel.getAll(),
        UserChallengeModel.getByUser(userId),
      ]);
      const maxLevel     = await UserChallengeModel.maxCompletedLevel(userId);
      const completedIds = new Set(
        userProgress.filter((uc) => uc.completed).map((uc) => uc.challenge_id)
      );
      const withStatus = allChallenges.map((ch) => {
        const status = completedIds.has(ch.id) ? "completed"
          : ch.level <= maxLevel + 1 ? "unlocked" : "locked";
        return {
          id: ch.id, title: ch.title, description: ch.description,
          category: ch.category, healthReward: ch.health_reward,
          xpReward: ch.xp_reward, level: ch.level, status,
        };
      });
      return res.status(200).json(withStatus);
    } catch (err) {
      console.error("[Challenge] List error:", err.message);
      return res.status(500).json({ error: "Server error." });
    }
  },

  // ── GET /api/challenges/:id ───────────────────────────────────────────
  async getChallengeById(req, res) {
    try {
      const userId      = req.user.id;
      const challengeId = parseInt(req.params.id);
      if (isNaN(challengeId)) return res.status(400).json({ error: "Invalid challenge id." });
      const challenge = await ChallengeModel.findById(challengeId);
      if (!challenge) return res.status(404).json({ error: "Challenge not found." });
      const maxLevel    = await UserChallengeModel.maxCompletedLevel(userId);
      const isCompleted = await UserChallengeModel.isCompleted(userId, challengeId);
      const status = isCompleted ? "completed"
        : challenge.level <= maxLevel + 1 ? "unlocked" : "locked";
      return res.status(200).json({
        id: challenge.id, title: challenge.title, description: challenge.description,
        category: challenge.category, healthReward: challenge.health_reward,
        xpReward: challenge.xp_reward, level: challenge.level, status,
      });
    } catch (err) {
      console.error("[Challenge] GetById error:", err.message);
      return res.status(500).json({ error: "Server error." });
    }
  },

  // ── POST /api/challenges/submit ───────────────────────────────────────
  // Handles ALL scenario levels (1–5), correct AND wrong answers.
  // Body: { challengeId, uiLevel, correct, wrongStreak? }
  async submitScenario(req, res) {
    try {
      const userId      = req.user.id;
      const challengeId = parseInt(req.body.challengeId);
      const uiLevel     = parseInt(req.body.uiLevel) || 1;
      const correct     = Boolean(req.body.correct);
      const wrongStreak = parseInt(req.body.wrongStreak) || 0;

      if (isNaN(challengeId)) return res.status(400).json({ error: "challengeId required." });

      const challenge = await ChallengeModel.findById(challengeId);
      if (!challenge) return res.status(404).json({ error: "Challenge not found." });

      const user = await UserModel.findById(userId);
      if (!user) return res.status(404).json({ error: "User not found." });

      // Level 5 = full reward, levels 1–4 = scaled
      const levelScale  = uiLevel === 5 ? 1.0 : uiLevel / 5;
      const healthDelta = correct
        ? Math.round(challenge.health_reward * levelScale)
        : Math.round(challenge.health_reward * 0.4);
      const xpBase = Math.round(challenge.xp_reward * levelScale);

      const { xpGained, multiplier } = await UserModel.applyActionResult(userId, {
        correct, healthDelta, xpBase, currentStreak: user.streak,
      });

      // Level 5 correct: mark complete + update streak
      let newStreak = user.streak;
      if (uiLevel === 5 && correct) {
        const doneThisModuleToday = await UserChallengeModel.completedModuleToday(userId, challenge.category);
        if (!doneThisModuleToday) {
          const alreadyDone = await UserChallengeModel.isCompleted(userId, challengeId);
          if (!alreadyDone) await UserChallengeModel.markComplete(userId, challengeId);
        }
        const lastActiveStr = user.last_active
          ? new Date(user.last_active).toISOString().split("T")[0] : null;
        newStreak = await UserModel.updateStreak(userId, lastActiveStr, user.streak);
      }

      const updated     = await UserModel.findById(userId);
      const chainAttack = !correct ? getChainAttack(challenge.category, wrongStreak) : null;
      const crisis      = checkForCrisis(updated.health_score, wrongStreak);

      return res.status(200).json({
        correct,
        healthChange:     correct ? healthDelta : -healthDelta,
        xpGained,
        streakMultiplier: multiplier,
        streak:           newStreak,
        updatedPlayer: {
          healthScore:      updated.health_score,
          xp:               updated.xp,
          streak:           updated.streak,
          attacksPrevented: updated.attacks_prevented,
          breachesCaused:   updated.breaches_caused,
        },
        chainAttack,
        crisis,
      });
    } catch (err) {
      console.error("[Challenge] Submit error:", err.message);
      return res.status(500).json({ error: "Server error." });
    }
  },

  // ── POST /api/challenges/complete (backward compat) ───────────────────
  async completeChallenge(req, res) {
    try {
      const userId      = req.user.id;
      const challengeId = parseInt(req.body.challengeId);
      if (isNaN(challengeId)) return res.status(400).json({ error: "challengeId must be a number." });

      const challenge = await ChallengeModel.findById(challengeId);
      if (!challenge) return res.status(404).json({ error: "Challenge not found." });

      const user = await UserModel.findById(userId);
      if (!user) return res.status(404).json({ error: "User not found." });

      const maxLevel = await UserChallengeModel.maxCompletedLevel(userId);
      if (challenge.level > maxLevel + 1)
        return res.status(403).json({ error: "This challenge is locked." });

      const alreadyDone = await UserChallengeModel.isCompleted(userId, challengeId);
      if (alreadyDone)
        return res.status(409).json({ error: "You have already completed this challenge." });

      const doneThisModuleToday = await UserChallengeModel.completedModuleToday(userId, challenge.category);
      if (doneThisModuleToday)
        return res.status(429).json({
          error: `You've already completed a ${challenge.category} challenge today.`,
          retryAfter: "tomorrow",
        });

      await UserChallengeModel.markComplete(userId, challengeId);
      const { xpGained } = await UserModel.applyActionResult(userId, {
        correct: true, healthDelta: challenge.health_reward,
        xpBase: challenge.xp_reward, currentStreak: user.streak,
      });

      const lastActiveStr = user.last_active
        ? new Date(user.last_active).toISOString().split("T")[0] : null;
      const newStreak = await UserModel.updateStreak(userId, lastActiveStr, user.streak);
      const updated   = await UserModel.findById(userId);

      return res.status(200).json({
        message:       `Challenge "${challenge.title}" completed!`,
        healthChange:  challenge.health_reward,
        xpGained,
        streak:        newStreak,
        player:        { healthScore: updated.health_score, xp: updated.xp, streak: updated.streak },
        updatedPlayer: { healthScore: updated.health_score, xp: updated.xp, streak: updated.streak },
      });
    } catch (err) {
      console.error("[Challenge] Complete error:", err.message);
      return res.status(500).json({ error: "Server error." });
    }
  },
};

module.exports = ChallengeController;
