"use client";


import { MessagesTable } from "@/components/messages-table";
import { listMessages } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";

export default function Page() {
    const { data, isLoading, error } = useQuery({
    queryKey: ["messages"],
    queryFn: listMessages,
    staleTime: 30_000,
  });

  if (isLoading) return <p>Loading…</p>;
  if (error) return <p className="text-red-500">Failed to load</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Messages</h1>
      <MessagesTable
      data={data ?? []}
    />
    </div>
  );
}
