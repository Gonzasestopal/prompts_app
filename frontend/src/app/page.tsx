"use client";

import { MessagesTable, type Message } from "@/components/messages-table.tsx";
import { listMessages } from "@/lib/api";
import { useEffect, useState } from "react";

export default function Page() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    listMessages()
      .then((data) => setMessages(data)) // keep createdAt/updatedAt as strings
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <p className="p-4">Loading...</p>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Messages</h1>
      <MessagesTable data={messages} />
    </div>
  );
}
