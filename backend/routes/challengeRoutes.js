// ── routes/challengeRoutes.js ─────────────────────────────────────────────
const express             = require("express");
const ChallengeController = require("../controllers/challengeController");
const { protect }         = require("../middleware/authMiddleware");

const router = express.Router();

// All challenge routes require a valid JWT
router.use(protect);

// GET  /api/challenges          — list all challenges with status
router.get("/",           ChallengeController.getChallenges);

// GET  /api/challenges/:id      — single challenge detail
router.get("/:id",        ChallengeController.getChallengeById);

// POST /api/challenges/submit   — NEW: all levels, correct + wrong
router.post("/submit",    ChallengeController.submitScenario);

// POST /api/challenges/complete — legacy: level-5 correct only
router.post("/complete",  ChallengeController.completeChallenge);

module.exports = router;
