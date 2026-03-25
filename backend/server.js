// ── server.js ─────────────────────────────────────────────────────────────
// Entry point. Boots Express, wires cookie-parser, CORS, routes.
// JWT is delivered via HTTP-only cookie — never exposed to JavaScript.

require("dotenv").config();

const express           = require("express");
const cors              = require("cors");
const cookieParser      = require("cookie-parser");
const authRoutes        = require("./routes/authRoutes");
const userRoutes        = require("./routes/userRoutes");
const challengeRoutes   = require("./routes/challengeRoutes");
const leaderboardRoutes = require("./routes/leaderboardRoutes");

const app  = express();
const PORT = process.env.PORT || 5001;

// ── CORS ──────────────────────────────────────────────────────────────────
// credentials: true is required so the browser sends/receives cookies
// across the localhost:5173 ↔ localhost:5000 origin boundary.
app.use(cors({
  origin:      process.env.FRONTEND_URL || "http://localhost:5174",
  credentials: true,
}));

// ── Body + Cookie parsing ─────────────────────────────────────────────────
app.use(express.json());
app.use(cookieParser());   // makes req.cookies available in every handler

// ── Request logger (dev only) ─────────────────────────────────────────────
if (process.env.NODE_ENV !== "production") {
  app.use((req, _res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
    next();
  });
}

// ── Routes ────────────────────────────────────────────────────────────────
app.use("/api/auth",        authRoutes);
app.use("/api/user",        userRoutes);
app.use("/api/challenges",  challengeRoutes);
app.use("/api/leaderboard", leaderboardRoutes);

// ── Health check ──────────────────────────────────────────────────────────
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", service: "CyberDefense Arena API", time: new Date().toISOString() });
});

// ── 404 ───────────────────────────────────────────────────────────────────
app.use((_req, res) => res.status(404).json({ error: "Route not found." }));

// ── Global error handler ──────────────────────────────────────────────────
// eslint-disable-next-line no-unused-vars
app.use((err, _req, res, _next) => {
  console.error("[Server] Unhandled error:", err.message);
  res.status(500).json({ error: "Internal server error." });
});

// ── Start ─────────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`
  ██████╗ ██╗   ██╗██████╗ ███████╗██████╗
  ██╔════╝╚██╗ ██╔╝██╔══██╗██╔════╝██╔══██╗
  ██║      ╚████╔╝ ██████╔╝█████╗  ██████╔╝
  ██║       ╚██╔╝  ██╔══██╗██╔══╝  ██╔══██╗
  ╚██████╗   ██║   ██████╔╝███████╗██║  ██║
   ╚═════╝   ╚═╝   ╚═════╝ ╚══════╝╚═╝  ╚═╝
  DEFENSE ARENA — API Server
  ─────────────────────────────────────────
  ENV  : ${process.env.NODE_ENV || "development"}
  PORT : ${PORT}
  AUTH : HTTP-only cookie (JWT)
  DB   : ${process.env.DB_NAME || "cyberarena"} @ ${process.env.DB_HOST || "localhost"}
  `);
});
