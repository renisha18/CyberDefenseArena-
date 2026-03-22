// ── src/modules/social/data/socialLevels.js ──────────────────────────────
// Social Engineering module — 5 real-world attack scenarios.
// DB challenge id = 2 ("Social Engineering", level 2 in sequence).
// type: "call" | "chat" | "physical" | "email-chain"

export const DB_CHALLENGE_ID = 2;
export const TOTAL_LEVELS    = 5;

const SOCIAL_LEVELS = [
  // ── Level 1: Vishing (phone phishing) ────────────────────────────────
  {
    level:           1,
    type:            "call",
    difficulty:      "ROOKIE",
    difficultyColor: "#39ff14",
    title:           "SUSPICIOUS PHONE CALL",
    callerId:        "IT Support — 0800-COMPANY",
    transcript: [
      { speaker: "CALLER", text: "Hi, this is Mark from IT Support. We've detected your account is locked due to a security policy violation. I need to verify your identity." },
      { speaker: "YOU",    text: "Oh, okay. What do you need?" },
      { speaker: "CALLER", text: "Can you confirm your employee ID and your current network password? I can unlock your account immediately once verified." },
      { speaker: "YOU",    text: "Is this urgent?" },
      { speaker: "CALLER", text: "Yes, your access will be permanently revoked in 15 minutes if we don't process this now. It'll take IT three weeks to manually restore access." },
    ],
    options: [
      { id: "a", label: "Give the caller your employee ID and password",          safe: false },
      { id: "b", label: "Hang up and call IT support back on the official number", safe: true  },
      { id: "c", label: "Ask for the caller's employee badge number",             safe: false },
      { id: "d", label: "Give only your employee ID, not the password",          safe: false },
    ],
    correctId:   "b",
    explanation: "Vishing (voice phishing) attacks impersonate IT support to steal credentials over the phone. The correct response is always to hang up and call IT back on the official company number — never give credentials to an inbound caller, no matter how urgent they claim it is.",
    redFlags: [
      "IT will NEVER ask for your password — ever, for any reason",
      "Extreme time pressure (15 minutes) is a classic manipulation tactic",
      "The caller initiated the call — you can't verify their identity",
      "Legitimate IT lockouts are handled through ticketing, not phone calls",
    ],
    healthReward:   10,
    healthPenalty:  5,
    xpReward:       20,
  },

  // ── Level 2: Baiting (USB drop) ───────────────────────────────────────
  {
    level:           2,
    type:            "physical",
    difficulty:      "TRAINEE",
    difficultyColor: "#00f5ff",
    title:           "USB DRIVE FOUND IN CAR PARK",
    scenario:        "You find a USB drive in the company car park. It has a label: 'Q3 SALARY REVIEW — CONFIDENTIAL'. What do you do?",
    options: [
      { id: "a", label: "Plug it into your work computer to see who it belongs to",  safe: false },
      { id: "b", label: "Plug it into a personal device that isn't on the company network", safe: false },
      { id: "c", label: "Hand it to IT Security without plugging it in anywhere",    safe: true  },
      { id: "d", label: "Leave it where you found it in case the owner returns",     safe: false },
    ],
    correctId:   "c",
    explanation: "This is a 'baiting' attack — attackers deliberately drop USB drives in car parks, cafeterias, and lobbies. The label is designed to be irresistible. 60% of people who find a dropped USB plug it in immediately. Once inserted, it can auto-execute malware within seconds, before any antivirus can respond.",
    redFlags: [
      "Found USB drives are the #1 baiting attack vector used in penetration testing",
      "The label is specifically chosen to trigger curiosity — it's bait",
      "Personal devices on WiFi can still expose company data",
      "Modern USB malware executes before you see any files",
    ],
    healthReward:   10,
    healthPenalty:  5,
    xpReward:       25,
  },

  // ── Level 3: Pretexting (impersonation) ───────────────────────────────
  {
    level:           3,
    type:            "chat",
    difficulty:      "AGENT",
    difficultyColor: "#ffd700",
    title:           "INTERNAL CHAT IMPERSONATION",
    chatFrom:        "James Thornton (CTO) via Slack",
    messages: [
      { speaker: "James Thornton", text: "Hey — are you free? Need a quick favour, in a meeting right now so can't call." },
      { speaker: "YOU",            text: "Sure, what's up?" },
      { speaker: "James Thornton", text: "I need you to purchase 5× £200 Amazon gift cards for a client presentation. It's urgent — can you buy them now and send me the codes? I'll reimburse you through expenses." },
      { speaker: "James Thornton", text: "Don't mention it to anyone else — it's a surprise for the client. Just send me the codes directly." },
    ],
    options: [
      { id: "a", label: "Buy the gift cards and send the codes immediately",           safe: false },
      { id: "b", label: "Ask James to make a formal purchase order instead",           safe: false },
      { id: "c", label: "Call James directly on his known number to verify the request", safe: true  },
      { id: "d", label: "Check his Slack profile photo to confirm it's really him",     safe: false },
    ],
    correctId:   "c",
    explanation: "Gift card fraud via executive impersonation costs companies £1.8B per year. Attackers compromise or spoof Slack/Teams accounts and impersonate senior executives. The 'secrecy' request is designed to prevent you from checking with anyone. Always verify financial requests by calling the person directly on a known number.",
    redFlags: [
      "Real executives use formal procurement processes for purchases",
      "The secrecy request ('don't tell anyone') is a major manipulation signal",
      "Slack profile photos and display names can be faked or accounts compromised",
      "Urgency + secrecy + financial request = classic executive impersonation fraud",
    ],
    healthReward:   15,
    healthPenalty:  10,
    xpReward:       30,
  },

  // ── Level 4: Tailgating (physical access) ────────────────────────────
  {
    level:           4,
    type:            "physical",
    difficulty:      "SPECIALIST",
    difficultyColor: "#ff8c00",
    title:           "PHYSICAL SECURITY — TAILGATING",
    scenario:        "You're entering the secure server room using your keycard. A person in a branded uniform carrying equipment says 'Thanks — I've got my hands full, can you hold it open? I'm with the HVAC maintenance team.' You don't recognise them. What do you do?",
    options: [
      { id: "a", label: "Hold the door — they look legitimate and have equipment",         safe: false },
      { id: "b", label: "Hold the door but ask for their name first",                     safe: false },
      { id: "c", label: "Apologise and tell them to badge in separately via reception",   safe: true  },
      { id: "d", label: "Let them in but follow them closely to monitor what they do",    safe: false },
    ],
    correctId:   "c",
    explanation: "Tailgating is one of the most underestimated physical security threats. Social politeness is weaponised — most people hold doors out of courtesy. An attacker with 15 minutes of physical access can install a hardware keylogger, copy files, or plant a rogue device. Every visitor without a badge must go through reception, every time.",
    redFlags: [
      "Uniforms and equipment can be purchased online for under £50",
      "Legitimate contractors are pre-registered and escorted by facilities",
      "Social awkwardness is the attacker's best weapon — they count on politeness",
      "Even a brief period of physical access can compromise an entire network",
    ],
    healthReward:   20,
    healthPenalty:  15,
    xpReward:       40,
  },

  // ── Level 5: Multi-vector / quid pro quo ─────────────────────────────
  {
    level:           5,
    type:            "email-chain",
    difficulty:      "EXPERT",
    difficultyColor: "#ff2d55",
    title:           "MULTI-VECTOR SOCIAL ENGINEERING",
    emailChain: [
      {
        from:    "security-alert@company-compliance.net",
        subject: "Mandatory Cybersecurity Awareness Survey — Deadline Friday",
        body:    "All staff must complete the annual cybersecurity awareness survey by end of Friday. Complete it here: http://company-awareness-check.com/survey",
      },
      {
        from:    "james.thornton@company.co",
        subject: "Re: Survey",
        body:    "Just a reminder from the leadership team — please complete the survey by Friday. It only takes 5 minutes. The link is safe, James.",
      },
      {
        from:    "no-reply@company-awareness-check.com",
        subject: "Your Survey Is Ready — Login With Company Credentials",
        body:    "Please use your company email and password to access the survey. This ensures your responses are linked to your department. Survey link: http://company-awareness-check.com/login",
      },
    ],
    options: [
      { id: "a", label: "Complete the survey — two people from the company confirmed it",    safe: false },
      { id: "b", label: "Forward the survey link to IT asking if it is legitimate",         safe: true  },
      { id: "c", label: "Complete it but use a different password instead of your real one", safe: false },
      { id: "d", label: "Ignore it — cybersecurity surveys are always optional",             safe: false },
    ],
    correctId:   "b",
    explanation: "This is a multi-stage attack combining phishing, executive impersonation, and credential harvesting. The attacker used three emails to build legitimacy before requesting credentials. The 'executive confirmation' email came from company.co (not .com). Any survey or link requesting company credentials should be verified with IT before clicking.",
    redFlags: [
      "Sender domain is company-compliance.net and company.co — not the real company",
      "Multiple follow-up emails building false legitimacy is a classic multi-vector attack",
      "No legitimate internal survey ever requests your work password",
      "The 'confirmation' from James came from company.co (not .com) — a lookalike domain",
      "Credential harvesting disguised as a compliance requirement is increasingly common",
    ],
    healthReward:   25,
    healthPenalty:  20,
    xpReward:       50,
  },
];

export default SOCIAL_LEVELS;

export function getLevelData(uiLevel) {
  return SOCIAL_LEVELS.find((l) => l.level === uiLevel) || null;
}
