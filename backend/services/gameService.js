// ── backend/services/gameService.js ──────────────────────────────────────
// Rule change: 1 per MODULE per day (not 1 total per day).
// Each of the 4 modules (phishing, password, social, malware) can be
// completed once per day → up to 4 submissions allowed per day.

const UserModel          = require("../models/userModel");
const UserChallengeModel = require("../models/userChallengeModel");
const ChallengeModel     = require("../models/challengeModel");

const GameService = {

  async applyResult(userId, challengeId, healthDelta, xpReward) {
    const user = await UserModel.findById(userId);
    if (!user) throw new Error("User not found.");

    await UserChallengeModel.markComplete(userId, challengeId);

    if (healthDelta > 0) {
      await UserModel.addRewards(userId, healthDelta, xpReward);
    } else if (healthDelta < 0) {
      await UserModel.applyHealthPenalty(userId, Math.abs(healthDelta));
      if (xpReward > 0) {
        await UserModel.addRewards(userId, 0, Math.floor(xpReward * 0.25));
      }
    }

    const lastActiveStr = user.last_active
      ? new Date(user.last_active).toISOString().split("T")[0]
      : null;
    const newStreak = await UserModel.updateStreak(userId, lastActiveStr, user.streak);

    const updated = await UserModel.findById(userId);
    return {
      healthScore: updated.health_score,
      xp:          updated.xp,
      streak:      newStreak,
    };
  },

  async validateSubmission(userId, challengeId, challengeLevel) {
    // 1. Already completed this specific challenge ever?
    const alreadyDone = await UserChallengeModel.isCompleted(userId, challengeId);
    if (alreadyDone) {
      const err = new Error("You have already completed this challenge.");
      err.status = 409;
      throw err;
    }

    // 2. Fetch challenge to get its category (module name)
    const challenge = await ChallengeModel.findById(challengeId);
    if (!challenge) {
      const err = new Error("Challenge not found.");
      err.status = 404;
      throw err;
    }

    // 3. Per-module-per-day check (NEW rule — was: 1 total per day)
    const doneThisModuleToday = await UserChallengeModel.completedModuleToday(
      userId,
      challenge.category
    );
    if (doneThisModuleToday) {
      const err = new Error(
        `You've already completed a ${challenge.category} challenge today. ` +
        `Try a different module or come back tomorrow!`
      );
      err.status = 429;
      throw err;
    }

    // 4. Sequential unlock — must complete previous level first
    const maxLevel = await UserChallengeModel.maxCompletedLevel(userId);
    if (challengeLevel > maxLevel + 1) {
      const err = new Error("This challenge is locked. Complete the previous one first.");
      err.status = 403;
      throw err;
    }
  },
};

module.exports = GameService;
