// ── routes/authRoutes.js ──────────────────────────────────────────────────
const express        = require("express");
const AuthController = require("../controllers/authController");
const { protect }    = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/signup",  AuthController.signup);
router.post("/login",   AuthController.login);
router.post("/logout",  AuthController.logout);
router.get("/me",       protect, AuthController.me);   // session restore on page load

module.exports = router;
