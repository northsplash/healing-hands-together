const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:4242";

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE}${path}`, {
    headers: { "Content-Type": "application/json", ...(options.headers || {}) },
    ...options,
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.error || "Something went wrong.");
  return data;
}

export const api = {
  health: () => request("/api/health"),
  register: (payload) => request("/api/auth/register", { method: "POST", body: JSON.stringify(payload) }),
  login: (payload) => request("/api/auth/login", { method: "POST", body: JSON.stringify(payload) }),
  me: (token) => request("/api/auth/me", { headers: { Authorization: `Bearer ${token}` } }),
  createEnrollment: (token, payload) => request("/api/enrollments", { method: "POST", headers: { Authorization: `Bearer ${token}` }, body: JSON.stringify(payload) }),
  checkout: (payload) => request("/api/create-checkout-session", { method: "POST", body: JSON.stringify(payload) }),
  student: (token) => request("/api/student/dashboard", { headers: { Authorization: `Bearer ${token}` } }),
  adminLogin: (payload) => request("/api/admin/login", { method: "POST", body: JSON.stringify(payload) }),
  admin: (token) => request("/api/admin/dashboard", { headers: { Authorization: `Bearer ${token}` } }),
};

export function saveAuth(data) {
  localStorage.setItem("hht_auth", JSON.stringify(data));
}
export function getAuth() {
  try { return JSON.parse(localStorage.getItem("hht_auth")) || null; } catch { return null; }
}
export function clearAuth() { localStorage.removeItem("hht_auth"); }

