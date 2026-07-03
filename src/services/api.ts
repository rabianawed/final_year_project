/**
 * api.ts — Axios instance for PhishGuard API
 * Base URL points to your FastAPI backend.
 */
import axios from "axios";
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8000/api/v2",
  timeout: 30000,
  headers: { "Content-Type": "application/json" },
});
// Attach JWT token on every request
api.interceptors.request.use(cfg => {
  const token = localStorage.getItem("pg_token");
  if (token && cfg.headers) cfg.headers.Authorization = `Bearer ${token}`;
  return cfg;
});
// Handle 401 globally
api.interceptors.response.use(
  res => res,
  err => {
    if (err.response?.status === 401) { localStorage.removeItem("pg_token"); window.location.href = "/login"; }
    return Promise.reject(err);
  }
);
export default api;
