const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export async function listMessages() {
  const r = await fetch(`${API_BASE}/messages`, { cache: "no-store" });
  if (!r.ok) throw new Error("Failed to load messages");
  return r.json();
}
