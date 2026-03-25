// ── utils/seed.js ─────────────────────────────────────────────────────────
// Run once: `npm run seed`
// Creates the cyberarena database schema and seeds starter challenges.

const mysql = require("mysql2/promise");
require("dotenv").config();

async function seed() {
  // Connect without specifying DB first so we can CREATE it
  const conn = await mysql.createConnection({
    host:     process.env.DB_HOST     || "localhost",
    port:     process.env.DB_PORT     || 3306,
    user:     process.env.DB_USER     || "root",
    password: process.env.DB_PASSWORD || "",
  });

  console.log("[Seed] Connected to MySQL");

  // ── Create database ──────────────────────────────────────────────────
  await conn.execute(`CREATE DATABASE IF NOT EXISTS cyberarena`);
  await conn.execute(`USE cyberarena`);
  console.log("[Seed] Database: cyberarena");

  // ── users ────────────────────────────────────────────────────────────
  await conn.execute(`
    CREATE TABLE IF NOT EXISTS users (
      id                INT          PRIMARY KEY AUTO_INCREMENT,
      username          VARCHAR(50)  NOT NULL UNIQUE,
      email             VARCHAR(100) NOT NULL UNIQUE,
      password          VARCHAR(255) NOT NULL,
      health_score      INT          NOT NULL DEFAULT 50,
      xp                INT          NOT NULL DEFAULT 0,
      streak            INT          NOT NULL DEFAULT 0,
      last_active       DATE         DEFAULT NULL,
      attacks_prevented INT          NOT NULL DEFAULT 0,
      breaches_caused   INT          NOT NULL DEFAULT 0,
      created_at        TIMESTAMP    DEFAULT CURRENT_TIMESTAMP
    )
  `);
  // Safe migration — add new columns to existing tables if they don't exist
  await conn.execute(`
    ALTER TABLE users
      ADD COLUMN IF NOT EXISTS attacks_prevented INT NOT NULL DEFAULT 0,
      ADD COLUMN IF NOT EXISTS breaches_caused   INT NOT NULL DEFAULT 0
  `).catch(() => {}); // ignore if already exists (older MySQL)
  console.log("[Seed] Table: users ✓");

  // ── challenges ───────────────────────────────────────────────────────
  await conn.execute(`
    CREATE TABLE IF NOT EXISTS challenges (
      id             INT          PRIMARY KEY AUTO_INCREMENT,
      title          VARCHAR(100) NOT NULL,
      description    TEXT,
      category       VARCHAR(50)  DEFAULT 'phishing',
      health_reward  INT          NOT NULL DEFAULT 10,
      xp_reward      INT          NOT NULL DEFAULT 20,
      level          INT          NOT NULL DEFAULT 1,
      created_at     TIMESTAMP    DEFAULT CURRENT_TIMESTAMP
    )
  `);
  console.log("[Seed] Table: challenges ✓");

  // ── user_challenges ───────────────────────────────────────────────────
  await conn.execute(`
    CREATE TABLE IF NOT EXISTS user_challenges (
      id             INT     PRIMARY KEY AUTO_INCREMENT,
      user_id        INT     NOT NULL,
      challenge_id   INT     NOT NULL,
      completed      BOOLEAN NOT NULL DEFAULT FALSE,
      completed_date DATE    DEFAULT NULL,
      FOREIGN KEY (user_id)      REFERENCES users(id)      ON DELETE CASCADE,
      FOREIGN KEY (challenge_id) REFERENCES challenges(id) ON DELETE CASCADE,
      UNIQUE KEY uq_user_challenge (user_id, challenge_id)
    )
  `);
  console.log("[Seed] Table: user_challenges ✓");

  const [existing] = await conn.execute(`SELECT COUNT(*) AS cnt FROM challenges`);
  if (existing[0].cnt === 0) {
    await conn.execute(`
      INSERT INTO challenges
        (title, description, category, health_reward, xp_reward, level)
      VALUES
        ('Phishing Detection',
         'Identify phishing emails and social engineering attempts targeting your company.',
         'phishing', 10, 50, 1),

        ('Social Engineering',
         'An unknown caller claims to be from IT support and asks for your network password.',
         'social', 10, 50, 2),

        ('Malware Recognition',
         'Your workstation shows unusual behaviour. Diagnose and quarantine the threat.',
         'malware', 15, 50, 3),

        ('Password Security',
         'Audit the company password policy and identify which accounts are at risk.',
         'password', 10, 50, 4)
    `);
    console.log("[Seed] Challenges seeded ✓");
  } else {
    console.log("[Seed] Challenges already present, skipping");
  }

  await conn.end();
  console.log("[Seed] Done ✓");
}

seed().catch((err) => {
  console.error("[Seed] Error:", err.message);
  process.exit(1);
});
