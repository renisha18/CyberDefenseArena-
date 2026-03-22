// ── src/modules/password/data/passwordLevels.js ──────────────────────────
// Password Security module — 5 scenarios testing password hygiene decisions.
// DB challenge id = 4 ("Password Security", level 4 in the sequence).
// Backend is called once on final level correct answer only.

export const DB_CHALLENGE_ID = 4;
export const TOTAL_LEVELS    = 5;

// Each scenario presents a situation — player picks the SAFEST option.
// type: "choice" | "audit" | "strength"

const PASSWORD_LEVELS = [
  // ── Level 1: Spot the weak password ──────────────────────────────────
  {
    level:           1,
    type:            "choice",
    difficulty:      "ROOKIE",
    difficultyColor: "#39ff14",
    title:           "CHOOSE THE STRONGEST PASSWORD",
    description:     "Your IT policy requires a strong password for the company VPN. Which of these should you use?",
    options: [
      { id: "a", label: "password123",          safe: false, reason: "Extremely common — appears in every breach list" },
      { id: "b", label: "Company2024!",          safe: false, reason: "Predictable pattern: company name + year + symbol" },
      { id: "c", label: "T!g3r#Moon$Lamp9",      safe: true,  reason: "Long, random, mixes all character types — excellent" },
      { id: "d", label: "MyDog$Fluffy1995",      safe: false, reason: "Personal info is guessable via social media" },
    ],
    correctId:       "c",
    explanation:     "Strong passwords are long (16+ chars), random, and avoid personal information or predictable patterns. 'T!g3r#Moon$Lamp9' has no dictionary words, uses all character types, and can't be guessed from your social media.",
    redFlags: [
      "password123 is in every leaked password database",
      "Company name + year is the #1 password pattern IT admins see",
      "Personal info (pet names, birth years) is easily found on social media",
      "The winning option uses random words + symbols — impossible to guess",
    ],
    healthReward:   10,
    healthPenalty:  5,
    xpReward:       25,
  },

  // ── Level 2: Password reuse ───────────────────────────────────────────
  {
    level:           2,
    type:            "choice",
    difficulty:      "TRAINEE",
    difficultyColor: "#00f5ff",
    title:           "CREDENTIAL BREACH SCENARIO",
    description:     "A breach notification says your email was found in a leaked database. The leaked site used the same password as your work email. What do you do?",
    options: [
      { id: "a", label: "Ignore it — it's just a random website",    safe: false, reason: "Attackers use breached credentials to log in everywhere you reused the password" },
      { id: "b", label: "Change only the breached site's password",   safe: false, reason: "Any account sharing that password is still compromised" },
      { id: "c", label: "Change ALL accounts using that password + enable MFA", safe: true, reason: "Credential stuffing attacks target every service you use" },
      { id: "d", label: "Wait to see if anything bad happens",        safe: false, reason: "Attackers act within hours of a breach going public" },
    ],
    correctId:       "c",
    explanation:     "Credential stuffing is automated — bots try breached username/password pairs across thousands of sites within minutes of a database going public. The only safe response is to change every account that shared the password AND enable MFA.",
    redFlags: [
      "Password reuse is involved in 80% of all data breaches",
      "Credential stuffing bots act within minutes of a public breach",
      "Attackers specifically look for work email + password combinations",
      "Changing only the breached site leaves every other account exposed",
    ],
    healthReward:   10,
    healthPenalty:  5,
    xpReward:       25,
  },

  // ── Level 3: Password manager ─────────────────────────────────────────
  {
    level:           3,
    type:            "choice",
    difficulty:      "AGENT",
    difficultyColor: "#ffd700",
    title:           "PASSWORD MANAGER POLICY",
    description:     "IT is rolling out a company-wide password manager. A colleague says 'I don't trust it — if it gets hacked, all my passwords leak at once.' What's the correct response?",
    options: [
      { id: "a", label: "Agree — password managers are dangerous",               safe: false, reason: "This is a common misconception — they dramatically improve security" },
      { id: "b", label: "Use a password manager with a strong master password + MFA", safe: true, reason: "The risk of one tool vs reusing weak passwords everywhere" },
      { id: "c", label: "Write passwords in an encrypted spreadsheet instead",   safe: false, reason: "Spreadsheets lack breach detection, sharing control, and auto-fill security" },
      { id: "d", label: "Keep using the same password to avoid confusion",       safe: false, reason: "Password reuse is the leading cause of account takeover" },
    ],
    correctId:       "b",
    explanation:     "A password manager with MFA is dramatically safer than alternatives. Even if the manager is breached, your vault is encrypted with your master password — which the company never sees. The alternative (reuse) guarantees eventual compromise.",
    redFlags: [
      "The real risk is reusing passwords — not using a manager",
      "Password managers are end-to-end encrypted — even the provider can't see your passwords",
      "With MFA on the manager, an attacker needs both your master password AND your phone",
      "Leading password managers have never had vaults successfully decrypted in a breach",
    ],
    healthReward:   15,
    healthPenalty:  10,
    xpReward:       30,
  },

  // ── Level 4: Audit weak accounts ─────────────────────────────────────
  {
    level:           4,
    type:            "audit",
    difficulty:      "SPECIALIST",
    difficultyColor: "#ff8c00",
    title:           "ACCOUNT SECURITY AUDIT",
    description:     "You are auditing the IT team's shared service accounts. Flag ALL accounts that violate security policy.",
    accounts: [
      { id: 1, username: "admin",      password: "Admin2024!",     mfa: false, lastChanged: "14 months ago", risk: "high",   reason: "Predictable pattern + no MFA + overdue rotation" },
      { id: 2, username: "api-service",password: "xK9#mP2$qL8!nR", mfa: false, lastChanged: "3 months ago",  risk: "medium", reason: "Strong password but no MFA on a service account" },
      { id: 3, username: "db-backup",  password: "backup",          mfa: false, lastChanged: "3 years ago",  risk: "critical",reason: "Single-word password + 3 year rotation + no MFA" },
      { id: 4, username: "monitoring", password: "J7!vN$2kP#mL9",   mfa: true,  lastChanged: "2 months ago",  risk: "low",    reason: "Strong password + MFA + recent rotation ✓" },
      { id: 5, username: "deploy-bot", password: "deploy123",        mfa: false, lastChanged: "18 months ago", risk: "critical",reason: "Extremely weak + no MFA + severely overdue" },
    ],
    flaggedIds:      [1, 3, 5],    // accounts the player must flag
    explanation:     "Service accounts are a prime target because they often have elevated privileges and are rarely monitored. Any account with a weak password, no MFA, or password older than 90 days should be flagged for immediate remediation.",
    redFlags: [
      "Predictable passwords (Admin2024, backup, deploy123) are cracked in seconds",
      "90 days is the standard maximum password rotation period",
      "Service accounts without MFA are a common lateral movement path for attackers",
      "Single-word passwords like 'backup' are cracked instantly by dictionary attacks",
    ],
    correctId:       "audit",  // special type — handled differently in UI
    healthReward:   20,
    healthPenalty:  15,
    xpReward:       40,
  },

  // ── Level 5: MFA bypass attack ────────────────────────────────────────
  {
    level:           5,
    type:            "choice",
    difficulty:      "EXPERT",
    difficultyColor: "#ff2d55",
    title:           "MFA FATIGUE ATTACK",
    description:     "At 2am you receive 15 push notifications from your authenticator app asking to approve a login you didn't make. Then you get an SMS: 'Hi, this is IT support — we're doing a system migration. Please approve one of the notifications to complete your account transfer.' What do you do?",
    options: [
      { id: "a", label: "Approve one notification — IT might genuinely need access",   safe: false, reason: "IT will never ask you to approve an unsolicited MFA push" },
      { id: "b", label: "Ignore the notifications and the SMS",                        safe: false, reason: "The account is actively being attacked — you must act" },
      { id: "c", label: "Deny all notifications, change password NOW, call IT security", safe: true, reason: "Someone has your password and is attempting to break through MFA" },
      { id: "d", label: "Turn off MFA to stop the notifications",                      safe: false, reason: "That's exactly what the attacker wants" },
    ],
    correctId:       "c",
    explanation:     "This is an MFA Fatigue (Push Bombing) attack combined with social engineering. Attackers spam push notifications hoping you'll approve one just to make it stop. The SMS is fake — real IT never asks you to approve unsolicited pushes. Your password is compromised: change it immediately and report to IT Security.",
    redFlags: [
      "15 unsolicited MFA pushes = your password is already compromised",
      "Legitimate IT migrations are scheduled and communicated in advance",
      "IT Security will NEVER ask you to approve an unexpected MFA push",
      "MFA fatigue attacks increased 300% in 2023",
      "Turning off MFA removes your last line of defence",
    ],
    healthReward:   25,
    healthPenalty:  20,
    xpReward:       50,
  },
];

export default PASSWORD_LEVELS;

export function getLevelData(uiLevel) {
  return PASSWORD_LEVELS.find((l) => l.level === uiLevel) || null;
}
