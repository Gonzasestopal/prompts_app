"use client";

import * as React from "react";

import { MessagesTable, type Message } from "@/components/messages-table.tsx";
import { createMessage, listMessages } from "@/lib/api";
import { useState } from "react";


export default function Page() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);

  const load = React.useCallback(async () => {
    const data = await listMessages();
    setMessages(data);
  }, []);

  React.useEffect(() => {
    load().catch(console.error).finally(() => setLoading(false));
  }, [load]);

  if (loading) return <main className="p-6">Loading…</main>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Messages</h1>
      <MessagesTable
      data={messages}
      onCreate={async (content) => {
          const created = await createMessage({ content });
          setMessages((prev) => [created, ...prev]);

      }} />
    </div>
  );
}
