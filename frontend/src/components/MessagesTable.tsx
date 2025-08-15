"use client";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { StatusBadge } from "../StatusBadge";
import { Message } from "../types";
import { fmt } from "../utils";

type Props = {
  data: Message[];
  onRowClick?: (m: Message) => void;
};

export function MessagesTable({ data, onRowClick }: Props) {
  return (
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
          {data.map((m) => (
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
          {data.length === 0 && (
            <TableRow>
              <TableCell colSpan={5} className="h-28 text-center text-muted-foreground">
                No messages found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
