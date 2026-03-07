// ── config/db.js ─────────────────────────────────────────────────────────
// MySQL connection pool using mysql2/promise.
// A pool (not a single connection) lets concurrent API requests
// each get their own connection without blocking.

const mysql = require("mysql2/promise");
require("dotenv").config();

const pool = mysql.createPool({
  host:               process.env.DB_HOST ,    
  port:               process.env.DB_PORT ,    
  user:               process.env.DB_USER  ,   
  password:           process.env.DB_PASSWORD, 
  database:           process.env.DB_NAME     ,
  waitForConnections: true,
  connectionLimit:    10,
  queueLimit:         0,
  timezone:           "Z", // UTC for all timestamps
});

// Test connection on startup
pool
  .getConnection()
  .then((conn) => {
    console.log("[DB] ✓ MySQL connected");
    conn.release();
  })
  .catch((err) => {
    console.error("[DB] ✗ Connection failed:", err.message);
    process.exit(1);
  });

module.exports = pool;
