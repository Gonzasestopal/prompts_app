"use client";

import { MessagesTable, type Message } from "@/components/messages-table.tsx";
import * as React from "react";

export default function Page() {
  // Replace with your fetch (e.g., from NEXT_PUBLIC_API_URL)
  const [rows, setRows] = React.useState<Message[]>([
    {
      id: "677eaecc5cb584f76f83e028",
      content: "Can you show me the weather of previous week?",
      status: "active",
      createdAt: "2025-08-14T15:42:30Z",
      updatedAt: "2025-08-14T18:42:30Z",
    },
    {
      id: "677eafc624569cf5ec2c9faf",
      content: "Draft a summary of today’s standup",
      status: "inactive",
      createdAt: "2025-08-13T10:10:05Z",
      updatedAt: "2025-08-13T12:00:00Z",
    },
  ]);

  return (
    <main className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-semibold mb-4">Messages</h1>
      <MessagesTable data={rows} onRowClick={(row) => console.log("clicked:", row)} />
    </main>
  );
}
