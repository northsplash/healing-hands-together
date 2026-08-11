const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:4242";
export async function createCheckoutSession(payload) {
  const res = await fetch(`${API_BASE}/api/create-checkout-session`, { method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify(payload) });
  const data = await res.json(); if (!res.ok) throw new Error(data.error || "Unable to start payment."); return data;
}

