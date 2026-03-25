// ── src/services/api.js ───────────────────────────────────────────────────
// Axios instance with withCredentials: true so the browser automatically
// sends and receives the HTTP-only cookie on every request.
// NO token is ever stored in JS — the cookie is invisible to the frontend.

import axios from "axios";

const api = axios.create({
  baseURL:         "/api",   // Vite proxy forwards to http://localhost:5001/api
  withCredentials: true,
});

// ── Response interceptor ──────────────────────────────────────────────────
// Converts Axios error objects into plain JS Error with the server's message.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.error ||
      error.message ||
      "An unexpected error occurred.";
    return Promise.reject(new Error(message));
  }
);

export default api;