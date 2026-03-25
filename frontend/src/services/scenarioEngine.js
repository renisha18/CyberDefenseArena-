// ── src/services/scenarioEngine.js ───────────────────────────────────────
// Used ONLY by ScenarioRouter (Daily Challenge button).
// Training page keeps module order — this file is not involved there.
//
// Picks a random scenario the player hasn't completed yet.
// Weighted: phishing 3x, password/social 2x, malware 1x.
// Difficulty gates: harder scenarios unlock as streak grows.

import PHISHING_LEVELS from "../modules/phishing/data/phishingLevels";
import PASSWORD_LEVELS from "../modules/password/data/passwordLevels";
import SOCIAL_LEVELS   from "../modules/social/data/socialLevels";
import MALWARE_LEVELS  from "../modules/malware/data/malwareLevels";

const DIFFICULTY_RANK = {
  ROOKIE: 1, TRAINEE: 2, AGENT: 3, SPECIALIST: 4, EXPERT: 5,
};

function normalise(levels, moduleName, routePrefix) {
  return levels.map((lvl) => ({
    ...lvl,
    id:        `${moduleName}-${lvl.level}`,
    module:    moduleName,
    route:     `${routePrefix}/${lvl.level}`,
    rankScore: DIFFICULTY_RANK[lvl.difficulty] ?? 1,
  }));
}

export const ALL_SCENARIOS = [
  ...normalise(PHISHING_LEVELS, "phishing", "/challenge/phishing"),
  ...normalise(PASSWORD_LEVELS, "password", "/challenge/password"),
  ...normalise(SOCIAL_LEVELS,   "social",   "/challenge/social"),
  ...normalise(MALWARE_LEVELS,  "malware",  "/challenge/malware"),
];

const WEIGHTS = { phishing: 3, password: 2, social: 2, malware: 1 };

function weightedSample(pool) {
  const bag = [];
  pool.forEach((s) => {
    const w = WEIGHTS[s.module] ?? 1;
    for (let i = 0; i < w; i++) bag.push(s);
  });
  return bag[Math.floor(Math.random() * bag.length)];
}

/**
 * Pick the next random scenario for Daily Challenge.
 * @param {string[]} completedIds  e.g. ["phishing-1", "password-3"]
 * @param {number}   streak        unlocks harder content as it grows
 * @returns {object|null}  scenario with .route, or null if all done
 */
export function getNextScenario(completedIds = [], streak = 0) {
  const done = new Set(completedIds);

  const maxRank = streak >= 10 ? 5
               : streak >= 5  ? 4
               : streak >= 3  ? 3
               : streak >= 1  ? 2
               :                1;

  const available = ALL_SCENARIOS.filter(
    (s) => !done.has(s.id) && s.rankScore <= maxRank
  );

  if (available.length > 0) return weightedSample(available);

  // All difficulty-gated ones done — try any remaining
  const any = ALL_SCENARIOS.filter((s) => !done.has(s.id));
  if (any.length > 0) return weightedSample(any);

  return null; // all 20 complete
}
