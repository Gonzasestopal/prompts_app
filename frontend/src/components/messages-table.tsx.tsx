"use client";

import { format } from "date-fns";
import { Search } from "lucide-react";
import * as React from "react";
import { useMemo, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export type Message = {
  _id: string;
  content: string;
  status: "active" | "inactive" | "deleted";
  created_at: string;
  updated_at: string;
};

type Props = {
  data: Message[];
  pageSize?: number;
  onRowClick?: (row: Message) => void;
};

function StatusBadge({ status }: { status: Message["status"] }) {
  const map: Record<Message["status"], string> = {
    active: "bg-emerald-100 text-emerald-700 border-emerald-200",
    inactive: "bg-amber-100 text-amber-800 border-amber-200",
    deleted: "bg-rose-100 text-rose-700 border-rose-200",
  };
  return <Badge variant="outline" className={`${map[status]} capitalize`}>{status}</Badge>;
}

function fmt(dt: string) {
  try {
    return format(new Date(dt), "yyyy-MM-dd HH:mm");
  } catch {
    return dt;
  }
}

export function MessagesTable({ data, pageSize = 10, onRowClick }: Props) {
  const [q, setQ] = useState("");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    const t = q.trim().toLowerCase();
    if (!t) return data;
    return data.filter((r) =>
      r._id.toLowerCase().includes(t) ||
      r.content.toLowerCase().includes(t) ||
      r.status.toLowerCase().includes(t)
    );
  }, [q, data]);

  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const current = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, page, pageSize]);

  React.useEffect(() => {
    if (page > totalPages) setPage(1);
  }, [totalPages, page]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-2">
        <div className="relative w-full max-w-xs">
          <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search messages…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            className="pl-8"
          />
        </div>
        <div className="text-sm text-muted-foreground">
          {total} item{total === 1 ? "" : "s"}
        </div>
      </div>

      <div className="rounded-2xl border bg-card shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[120px]">ID</TableHead>
              <TableHead>Content</TableHead>
              <TableHead className="w-[120px]">Status</TableHead>
              <TableHead className="w-[160px]">Created</TableHead>
              <TableHead className="w-[160px]">Updated</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {current.map((m) => (
              <TableRow
                key={m._id}
                className={onRowClick ? "cursor-pointer hover:bg-accent/40" : ""}
                onClick={() => onRowClick?.(m)}
              >
                <TableCell className="font-mono text-xs">{m._id}</TableCell>
                <TableCell className="max-w-[520px]">
                  <div className="line-clamp-2 text-sm text-foreground/90">{m.content}</div>
                </TableCell>
                <TableCell><StatusBadge status={m.status} /></TableCell>
                <TableCell className="text-sm text-muted-foreground">{fmt(m.created_at)}</TableCell>
                <TableCell className="text-sm text-muted-foreground">{fmt(m.updated_at)}</TableCell>
              </TableRow>
            ))}
            {current.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="h-28 text-center text-muted-foreground">
                  No messages found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

    </div>
  );
}
