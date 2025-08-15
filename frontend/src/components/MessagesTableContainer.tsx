"use client";

import { listMessages } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Message } from "../types";
import { CreateMessageModal } from "./CreateMessageModal";
import { MessageDrawer } from "./MessagesDrawer";
import { MessagesTable } from "./MessagesTable";
import { MessagesToolbar } from "./MessagesToolbar";

export function MessagesTableContainer() {
  const [statusFilter, setStatusFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Message | null>(null);
  const [openDrawer, setOpenDrawer] = useState(false);
  const [openCreate, setOpenCreate] = useState(false);

  const { data = [], isFetching } = useQuery({
    queryKey: ["messages", statusFilter],
    queryFn: () => listMessages(statusFilter),
    keepPreviousData: true,
  });

  function applySearch(data: Message[], q: string) {
    const t = q.trim().toLowerCase();
    if (!t) return data;
    return data.filter((r) =>
      r._id.toLowerCase().includes(t) ||
      r.content.toLowerCase().includes(t) ||
      r.status.toLowerCase().includes(t)
    );
  }

  const filteredData = applySearch(data, search);

  return (
    <div className="space-y-4">
      <MessagesToolbar
        search={search}
        onSearch={setSearch}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        onNewMessage={() => setOpenCreate(true)}
        total={filteredData.length}
        isFetching={isFetching}
      />

      <MessagesTable
        data={filteredData}
        onRowClick={(m) => { setSelected(m); setOpenDrawer(true); }}
      />

      <MessageDrawer
        open={openDrawer}
        onOpenChange={setOpenDrawer}
        message={selected}
      />

      <CreateMessageModal
        open={openCreate}
        onOpenChange={setOpenCreate}
      />
    </div>
  );
}
