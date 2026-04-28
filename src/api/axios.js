import axios from 'axios';

// ──────────────────────────────────────────────────────────────
// ElevateHub — Centralized Axios Instance
// ──────────────────────────────────────────────────────────────
// All API calls go through this configured instance.
// Base URL automatically switches between dev & production.
// ──────────────────────────────────────────────────────────────

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000, // 15-second timeout
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  withCredentials: true, // Send cookies for session-based auth
});

// ─── Request Interceptor ───────────────────────────────────────
// Attach auth tokens or perform pre-request logic here.
api.interceptors.request.use(
  (config) => {
    // If a JWT token exists in localStorage, attach it
    const token = localStorage.getItem('elevatehub_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Log outgoing requests in development
    if (import.meta.env.DEV) {
      console.log(`[API] ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`);
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// ─── Response Interceptor ──────────────────────────────────────
// Centralized error handling — no need to repeat in every component.
api.interceptors.response.use(
  (response) => {
    // Return the data directly for cleaner usage: const data = await api.get(...)
    return response;
  },
  (error) => {
    const status = error.response?.status;

    if (status === 401) {
      // Unauthorized — clear stored credentials
      localStorage.removeItem('elevatehub_token');
      console.warn('[API] Unauthorized — credentials cleared.');
    }

    if (status === 403) {
      console.warn('[API] Forbidden — insufficient permissions.');
    }

    if (status === 500) {
      console.error('[API] Internal Server Error:', error.response?.data);
    }

    if (!error.response) {
      // Network error — server unreachable
      console.error('[API] Network Error — is the backend running on port 8080?');
    }

    return Promise.reject(error);
  }
);

export default api;
