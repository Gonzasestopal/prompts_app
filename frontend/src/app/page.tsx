"use client";


import { MessagesTable } from "@/components/messages-table.tsx";
import { listMessages } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

export default function Page() {
  const [statusFilter, setStatusFilter] = useState("all");

  const { data = [], isFetching, isLoading, error } = useQuery({
    queryKey: ["messages", statusFilter],
    queryFn: () => listMessages(statusFilter),
  });

  if (isLoading) return <p>Loading…</p>;
  if (error) return <p className="text-red-500">Failed to load</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Messages</h1>
      <MessagesTable
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        isFetching={isFetching}
        data={data ?? []}
    />
    </div>
  );
}
