// ── backend/services/crisisEngine.js ─────────────────────────────────────
// Triggers high-impact crisis events when company health drops below thresholds.
// Crisis events are returned to the frontend in the submit response so the
// UI can display an alert and redirect the player to the relevant module.

const CRISIS_EVENTS = [
  {
    id:       "ransomware_attack",
    type:     "ransomware",
    severity: "critical",
    title:    "RANSOMWARE OUTBREAK",
    message:  "Files are being encrypted across the network. Immediate response required.",
    module:   "malware",
    route:    "/challenge/malware/3",
    healthThreshold: 30,
  },
  {
    id:       "data_breach",
    type:     "breach",
    severity: "high",
    title:    "DATA BREACH DETECTED",
    message:  "Sensitive employee data is being exfiltrated. Contain the threat now.",
    module:   "social",
    route:    "/challenge/social/5",
    healthThreshold: 40,
  },
  {
    id:       "credential_dump",
    type:     "credential",
    severity: "high",
    title:    "CREDENTIAL DUMP IN PROGRESS",
    message:  "Company passwords are being harvested. Lock down accounts immediately.",
    module:   "password",
    route:    "/challenge/password/5",
    healthThreshold: 35,
  },
];

/**
 * Check if a crisis should be triggered based on current health.
 * Returns a crisis event object or null.
 * Uses randomness (30% chance) to keep it unpredictable.
 *
 * @param {number} healthScore  - current user health_score
 * @param {number} wrongStreak  - consecutive wrong answers this session
 * @returns {object|null}
 */
function checkForCrisis(healthScore, wrongStreak = 0) {
  // Only trigger if health is low enough
  const eligible = CRISIS_EVENTS.filter((e) => healthScore <= e.healthThreshold);
  if (eligible.length === 0) return null;

  // 30% base chance, +10% per consecutive wrong answer
  const chance = 0.3 + wrongStreak * 0.1;
  if (Math.random() > chance) return null;

  // Pick the most severe eligible crisis
  return eligible.sort((a, b) =>
    ["low","medium","high","critical"].indexOf(b.severity) -
    ["low","medium","high","critical"].indexOf(a.severity)
  )[0];
}

module.exports = { checkForCrisis, CRISIS_EVENTS };
