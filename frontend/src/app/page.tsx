"use client";

import { MessagesTableContainer } from "@/components/MessagesTableContainer";

export default function Page() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Messages</h1>
      <MessagesTableContainer />
    </div>
  );
}
