// ── src/services/api.js ───────────────────────────────────────────────────
// Centralised API client for CyberDefense Arena.
// All fetch calls go through this file — never raw fetch() in components.
//
// Usage:
//   import api from "../services/api";
//   const data = await api.auth.login({ email, password });

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// ── Token helpers ────────────────────────────────────────────────────────
const TokenStore = {
  get:    ()      => localStorage.getItem("cda_token"),
  set:    (token) => localStorage.setItem("cda_token",  token),
  clear:  ()      => localStorage.removeItem("cda_token"),
};

// ── Core fetch wrapper ────────────────────────────────────────────────────
async function request(method, path, body = null, requiresAuth = true) {
  const headers = { "Content-Type": "application/json" };

  if (requiresAuth) {
    const token = TokenStore.get();
    if (!token) throw new Error("Not authenticated. Please log in.");
    headers["Authorization"] = `Bearer ${token}`;
  }

  const options = { method, headers };
  if (body) options.body = JSON.stringify(body);

  const res = await fetch(`${BASE_URL}${path}`, options);

  // Handle 401 globally — token expired / invalid
  if (res.status === 401) {
    TokenStore.clear();
    window.location.href = "/";   // redirect to landing/login
    throw new Error("Session expired. Please log in again.");
  }

  const data = await res.json();

  if (!res.ok) {
    // Server returns { error: "..." }
    throw new Error(data.error || `Request failed with status ${res.status}`);
  }

  return data;
}

// ── API surface ───────────────────────────────────────────────────────────
const api = {
  // ── Auth ────────────────────────────────────────────────────────────
  auth: {
    /**
     * Register a new player.
     * Saves the returned JWT automatically.
     */
    async signup({ username, email, password }) {
      const data = await request("POST", "/auth/signup", { username, email, password }, false);
      TokenStore.set(data.token);
      return data;
    },

    /**
     * Log in an existing player.
     * Saves the returned JWT automatically.
     */
    async login({ email, password }) {
      const data = await request("POST", "/auth/login", { email, password }, false);
      TokenStore.set(data.token);
      return data;
    },

    /**
     * Log out — remove the stored token.
     */
    logout() {
      TokenStore.clear();
    },

    /**
     * Is there a stored token? (does not validate it with the server)
     */
    isLoggedIn() {
      return !!TokenStore.get();
    },
  },

  // ── User / Dashboard ────────────────────────────────────────────────
  user: {
    /**
     * Returns: { username, healthScore, xp, streak, completedChallenges, currentLevel }
     */
    async getDashboard() {
      return request("GET", "/user/dashboard");
    },

    /**
     * Returns full profile including completed challenge list.
     */
    async getProfile() {
      return request("GET", "/user/profile");
    },
  },

  // ── Challenges ──────────────────────────────────────────────────────
  challenges: {
    /**
     * Returns all challenges with status: "completed" | "unlocked" | "locked"
     */
    async getAll() {
      return request("GET", "/challenges");
    },

    /**
     * Returns a single challenge by id.
     */
    async getById(id) {
      return request("GET", `/challenges/${id}`);
    },

    /**
     * Mark a challenge as complete.
     * Returns: { message, healthReward, xpReward, streak, player }
     */
    async complete(challengeId) {
      return request("POST", "/challenges/complete", { challengeId });
    },
  },

  // ── Leaderboard (public) ────────────────────────────────────────────
  leaderboard: {
    /**
     * Returns top N players.
     * @param {number} limit — default 10, max 50
     */
    async getTop(limit = 10) {
      return request("GET", `/leaderboard?limit=${limit}`, null, false);
    },
  },
};

export default api;
export { TokenStore };
