const API_ROOT =
  (typeof import.meta !== "undefined" && import.meta.env?.VITE_API_URL) || "";

export const API_BASE = `${API_ROOT}/api`;
export const MOCK_BASE = `${API_BASE}/mock-exam`;