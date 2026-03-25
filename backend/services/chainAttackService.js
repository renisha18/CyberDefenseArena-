// ── backend/services/chainAttackService.js ───────────────────────────────
// When a player gets a wrong answer, a chain attack fires — a follow-up
// scenario from a related module is triggered to simulate how real breaches
// cascade across systems.
//
// Chain map (wrong module → next module to attack):
//   phishing  → password  (stolen creds lead to password attacks)
//   password  → malware   (weak passwords enable malware deployment)
//   malware   → social    (malware exfil enables social engineering)
//   social    → phishing  (social data enables targeted phishing)

const CHAIN_MAP = {
  phishing: "password",
  password: "malware",
  malware:  "social",
  social:   "phishing",
};

// Severity escalates with consecutive wrong answers
const SEVERITY_LEVELS = ["low", "medium", "high", "critical"];

/**
 * Get the chain attack module triggered by a wrong answer.
 * @param {string} failedModule  - module the player just failed
 * @param {number} wrongStreak   - how many consecutive wrong answers (0-based)
 * @returns {{ module: string, severity: string, message: string }}
 */
function getChainAttack(failedModule, wrongStreak = 0) {
  const nextModule = CHAIN_MAP[failedModule] ?? "phishing";
  const severity   = SEVERITY_LEVELS[Math.min(wrongStreak, SEVERITY_LEVELS.length - 1)];

  const messages = {
    phishing: "Credential harvesting attempt detected on company accounts!",
    password: "Brute-force attack launched against internal systems!",
    malware:  "Malware payload deployed — systems compromised!",
    social:   "Social engineering campaign targeting executives!",
  };

  return {
    module:   nextModule,
    severity,
    message:  messages[nextModule],
    route:    `/challenge/${nextModule}/1`,
  };
}

module.exports = { getChainAttack, CHAIN_MAP };
