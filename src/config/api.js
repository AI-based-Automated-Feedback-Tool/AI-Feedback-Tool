const API_ROOT =
  (typeof import.meta !== "undefined" && import.meta.env?.VITE_API_URL) || "";

export const API_BASE = `${API_ROOT}/api`;
export const MOCK_BASE = `${API_BASE}/mock-exam`;

// Add daily limit (read from .env or fallback to 5)
export const DAILY_LIMIT = Number(import.meta.env?.VITE_DAILY_LIMIT) || 5;