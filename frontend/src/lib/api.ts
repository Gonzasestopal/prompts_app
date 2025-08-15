const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export type Message = {
  _id: string;
  content: string;
  status: "active" | "inactive" | "deleted";
  created_at: string;
  updated_at: string;
};

export async function listMessages() {
  const r = await fetch(`${API_BASE}/messages`, { cache: "no-store" });
  if (!r.ok) throw new Error("Failed to load messages");
  return r.json();
}

export async function createMessage(input: {content: string; status?: "active"|"archived"|"deleted"}) {
  const r = await fetch(`${API_BASE}/messages`, { method: "POST", headers: {"Content-Type": "application/json"}, body: JSON.stringify(input) });
  if (!r.ok) throw new Error("Failed to create");
  return r.json();
}

export async function getMessage(id: string) {
  const r = await fetch(`/api/messages/${id}`, { cache: "no-store" });
  if (!r.ok) throw new Error(`Failed to fetch message ${id}`);
  return r.json();
}

export async function updateMessage({ id, content, status }: { id: string; content: string; status: string }) {
  const res = await fetch(`/api/messages/${id}`, {
    method: "put",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ content, status }),
  });
  if (!res.ok) {
    throw new Error("Failed to update message");
  }
  return res.json();
}
