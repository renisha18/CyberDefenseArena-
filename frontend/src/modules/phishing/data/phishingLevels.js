// src/modules/phishing/data/phishingLevels.js
// ─────────────────────────────────────────────
// All 5 phishing scenarios for Module 1.
// DB submit only fires on Level 5 correct answer.
// Levels 1–4 are local training rounds (no backend call).

export const DB_CHALLENGE_ID = 1; // matches challenges.id in MySQL
export const TOTAL_LEVELS    = 5;

const PHISHING_LEVELS = [
  // ── Level 1: Obvious phishing ─────────────────────────────────────────
  {
    level:           1,
    difficulty:      "ROOKIE",
    difficultyColor: "#39ff14",
    sender:          "ceo-support@company-helpdesk.com",
    senderDisplay:   "CEO Support <ceo-support@company-helpdesk.com>",
    subject:         "URGENT: Payment Required Immediately!!!",
    body: `Dear Valued Employee,

We have a URGENT situation!!! A payment of $47,500 must be processed TODAY before 5pm or the company will loose the contract!!!

Please wire the funds to the following bank account IMMEDIATLY:

  Account: 9823746510
  Routing: 021000021

Do NOT tell anyone about this. This is TOP CONFIDENTIAL.

Act now or face CONSEQUENCES.

— CEO`,
    link:           "http://secure-payment-update.ru/transfer",
    attachment:     null,
    redFlags: [
      "Sender domain is company-helpdesk.com — NOT the real company domain",
      "Multiple spelling errors: 'loose', 'IMMEDIATLY'",
      "Extreme urgency and threat language",
      "Requests secrecy — a major red flag in any financial request",
      "No approval process, no verification step",
    ],
    correctAction:  "report",
    explanation:    "Classic Business Email Compromise (BEC). The domain doesn't match, spelling errors are everywhere, and the email demands secrecy about a wire transfer — the three biggest BEC red flags combined.",
    healthReward:   10,
    healthPenalty:  5,
    xpReward:       20,
    affectedSystem: "employee_trust",
  },

  // ── Level 2: Suspicious link ──────────────────────────────────────────
  {
    level:           2,
    difficulty:      "TRAINEE",
    difficultyColor: "#00f5ff",
    sender:          "no-reply@paypa1.com",
    senderDisplay:   "PayPal Security <no-reply@paypa1.com>",
    subject:         "Your account has been limited — action required",
    body: `Hello,

We have detected unusual activity on your PayPal account. To protect your funds, we have temporarily limited your account.

To restore full access, please verify your identity within 24 hours by clicking the link below:

  → Verify My Account Now

Failure to verify will result in permanent account suspension.

PayPal Security Team`,
    link:           "http://paypa1-secure-login.com/verify?token=aX9k2mZ",
    attachment:     null,
    redFlags: [
      "Sender domain is paypa1.com — digit '1' replacing letter 'l'",
      "Link goes to paypa1-secure-login.com — not paypal.com",
      "Threatens permanent suspension to create urgency",
      "No personalisation — doesn't use your name",
      "HTTP link (not HTTPS) — no encryption",
    ],
    correctAction:  "report",
    explanation:    "A credential harvesting attack using a lookalike domain (paypa1 vs paypal). The link leads to a fake site that captures your login. This technique is called typosquatting.",
    healthReward:   10,
    healthPenalty:  5,
    xpReward:       20,
    affectedSystem: "employee_trust",
  },

  // ── Level 3: Attachment trap ──────────────────────────────────────────
  {
    level:           3,
    difficulty:      "AGENT",
    difficultyColor: "#ffd700",
    sender:          "hr@company-benefits-portal.net",
    senderDisplay:   "HR Benefits <hr@company-benefits-portal.net>",
    subject:         "Important: Updated Benefits Package 2024 — Action Required",
    body: `Hi Team,

Please find attached the updated employee benefits package for 2024. All employees must review and sign the acknowledgement form by Friday COB.

Open the attachment to access your personalised benefits summary and complete the digital signature.

Questions? Contact HR at ext. 4400.

Best regards,
Human Resources`,
    link:           null,
    attachment:     "Benefits_2024_Review.pdf.exe",
    redFlags: [
      "Sender domain is company-benefits-portal.net — not the real company",
      "Double extension: .pdf.exe — Windows hides .exe, victim sees .pdf",
      "No employee name in the greeting",
      "Friday deadline creates artificial time pressure",
      "HR never sends executables — always proper PDFs via internal systems",
    ],
    correctAction:  "report",
    explanation:    "The attachment has a double extension (.pdf.exe). Windows hides known extensions by default — victims see 'Benefits_2024_Review.pdf' but it's actually malware. Opening it executes a trojan on your machine.",
    healthReward:   15,
    healthPenalty:  10,
    xpReward:       30,
    affectedSystem: "systems",
  },

  // ── Level 4: Spear phishing ───────────────────────────────────────────
  {
    level:           4,
    difficulty:      "SPECIALIST",
    difficultyColor: "#ff8c00",
    sender:          "sarah.chen@company.co",
    senderDisplay:   "Sarah Chen <sarah.chen@company.co>",
    subject:         "Quick favour — can you handle this invoice?",
    body: `Hey,

Sorry to bother you — I'm in back-to-back meetings all day and just got pinged by our supplier Apex Tech saying invoice #4821 is overdue and they'll apply a late fee if not processed today.

Can you take care of this for me? Details below:

  Supplier:  Apex Tech Solutions
  Amount:    $8,200
  Reference: INV-4821

Wire to their updated banking details (they changed banks last month):
  BSB: 062-000
  Account: 1234 5678

Thanks so much — you're a lifesaver!
Sarah`,
    link:           null,
    attachment:     "Invoice_4821.pdf",
    redFlags: [
      "Domain is company.co — not company.com (one character different)",
      "Requests a financial wire without formal approval process",
      "Claims to be too busy to handle it — social pressure tactic",
      "'Updated banking details' is the #1 red flag for invoice fraud",
      "Real colleague would use internal invoice system, not email",
    ],
    correctAction:  "report",
    explanation:    "Spear phishing — a targeted attack using a real colleague's name. The domain is company.co not .com. The 'new banking details' is the signature move of invoice redirect fraud, where attackers intercept supplier relationships to steal payments.",
    healthReward:   20,
    healthPenalty:  15,
    xpReward:       40,
    affectedSystem: "finance",
  },

  // ── Level 5: Multi-step / AiTM ───────────────────────────────────────
  {
    level:           5,
    difficulty:      "EXPERT",
    difficultyColor: "#ff2d55",
    sender:          "it-helpdesk@company.com",
    senderDisplay:   "IT Helpdesk <it-helpdesk@company.com>",
    subject:         "Re: Your IT support ticket #83921 — MFA reset required",
    body: `Hi,

This is a follow-up to your IT support ticket #83921 (submitted this morning regarding your password reset).

As part of our security infrastructure upgrade, all accounts must be migrated to the new MFA system within the next 2 hours to avoid service disruption.

Please complete your account migration here:
  → Complete MFA Migration (expires in 01:58:32)

You'll need to:
  1. Confirm your current password
  2. Enter your authenticator code
  3. Register your backup verification method

This is mandatory. Accounts not migrated by the deadline will be locked until manual IT verification.

IT Helpdesk | Ticket Ref: #83921`,
    link:           "https://company-it-portal.support/mfa-migrate?ref=83921",
    attachment:     null,
    redFlags: [
      "You never submitted ticket #83921 — the pretext is fabricated",
      "Link goes to company-it-portal.support — not company.com",
      "IT will NEVER ask for your current password",
      "2-hour countdown creates extreme urgency to prevent careful thinking",
      "Asks for MFA code — attackers use it in real-time to bypass 2FA",
      "Even if the sender looks right, always verify IT requests by phone",
    ],
    correctAction:  "report",
    explanation:    "An Adversary-in-The-Middle (AiTM) attack. The fake site captures your password AND MFA code simultaneously, using them in real-time to log in before the code expires. This bypasses two-factor authentication entirely.",
    healthReward:   25,
    healthPenalty:  20,
    xpReward:       50,
    affectedSystem: "network",
  },
];

export default PHISHING_LEVELS;

// Get level data by UI level number (1–5)
export function getLevelData(uiLevel) {
  return PHISHING_LEVELS.find((l) => l.level === uiLevel) || null;
}