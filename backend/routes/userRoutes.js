// ── routes/userRoutes.js ──────────────────────────────────────────────────
const express        = require("express");
const UserController = require("../controllers/userController");
const { protect }    = require("../middleware/authMiddleware");

const router = express.Router();

// All user routes require a valid JWT
router.use(protect);

// GET /api/user/dashboard
router.get("/dashboard", UserController.getDashboard);

// GET /api/user/profile
router.get("/profile", UserController.getProfile);

module.exports = router;
