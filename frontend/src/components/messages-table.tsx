"use client";

import { format } from "date-fns";
import { Search } from "lucide-react";
import * as React from "react";
import { useMemo, useState } from "react";

import { ReusableModal } from "@/components/reusable-modal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle
} from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { createMessage, getMessage, updateMessage } from "@/lib/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2, Plus } from "lucide-react";

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
  onCreate?: (content: string) => Promise<void> | void;
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

export function MessagesTable({ data, pageSize = 10, onRowClick, onCreate }: Props) {
  const queryClient = useQueryClient();

  const [q, setQ] = useState("");
  const [page] = useState(1); // keep it simple here
  const [openDetails, setOpenDetails] = useState(false);
  const [openCreate, setOpenCreate] = useState(false);
  const [selected, setSelected] = useState<Message | null>(null);
  const [newContent, setNewContent] = useState("");  const [submitting, setSubmitting] = useState(false);
  const [editContent, setEditContent] = useState("");
  const [editStatus, setEditStatus] = useState<string>("active");


  // When you open a row, seed editContent
  function openDetailsFor(m: Message) {
    setSelected(m);
    setEditContent(m.content);
    setOpenDetails(true);
    onRowClick?.(m);
  }

  const createMut = useMutation({
    mutationFn: createMessage,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["messages"] });
      setOpenCreate(false);
      setNewContent("");
    },
  });

  const updateMut = useMutation({
    mutationFn: ({ id, content, status }: { id: string; content: string; status: string }) =>
      updateMessage({ id, content, status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["messages"] });
      queryClient.invalidateQueries({ queryKey: ["message", selected?._id] });
      setOpenDetails(false);
    },
  });

  const filtered = useMemo(() => {
    const t = q.trim().toLowerCase();
    if (!t) return data;
    return data.filter((r) =>
      r._id.toLowerCase().includes(t) ||
      r.content.toLowerCase().includes(t) ||
      r.status.toLowerCase().includes(t)
    );
  }, [q, data]);

  React.useEffect(() => {
  if (selected) {
    setEditContent(selected.content);
    setEditStatus(selected.status);
  }
}, [selected]);

  const { data: fresh, isFetching } = useQuery({
    queryKey: ["message", selected?._id],
    queryFn: () => getMessage(selected!._id),
    enabled: !!selected && openDetails, // only fetch if drawer is open
    staleTime: 10_000,
  });

  const view = fresh && fresh._id === selected?._id ? fresh : selected;


  const total = filtered.length;
  const current = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, page, pageSize]);


  const inputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (openCreate) setTimeout(() => inputRef.current?.focus(), 0);
  }, [openCreate]);

  async function submitNew() {
    if (!newContent.trim()) return;
    setSubmitting(true);
    try {
      await createMessage({content: newContent.trim()});
      setNewContent("");
      setOpenCreate(false);
      // Refresh main table data
      queryClient.invalidateQueries({ queryKey: ["messages"] });
    } finally {
      setSubmitting(false);
    }
  }

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

        <Button className="gap-2" onClick={() => setOpenCreate(true)}>
          <Plus className="h-4 w-4" />
          New Message
        </Button>

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
                onClick={() => openDetailsFor(m)}
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

      <Drawer open={openDetails} onOpenChange={setOpenDetails} direction="right">
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Message details</DrawerTitle>
            <DrawerDescription>
              {view ? `ID: ${view._id}` : null}
            </DrawerDescription>
          </DrawerHeader>

          <div className="p-4 space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Content</label>
              <Input
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                placeholder="Message content"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Status</label>
              <Select value={editStatus} onValueChange={setEditStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="deleted">Deleted</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {/* Read-only fields */}
            {selected && (
              <div className="space-y-1 text-sm text-muted-foreground">
                <div><span className="font-medium text-foreground">Created:</span> {fmt(selected.created_at)}</div>
                <div><span className="font-medium text-foreground">Updated:</span> {fmt(selected.updated_at)}</div>
              </div>
            )}
          </div>
          <div className="p-4 flex flex-col gap-2">
            <DrawerClose asChild>
              <Button variant="outline" className="w-full">
                Close
              </Button>
            </DrawerClose>
              <Button
                onClick={() =>
                  updateMut.mutate({
                    id: selected!._id,
                    content: editContent,
                    status: editStatus as Message["status"],
                  })
                }
                disabled={updateMut.isPending || !editContent.trim()}
                className="w-full"
              >
                {updateMut.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save"}
              </Button>
          </div>
        </DrawerContent>
      </Drawer>

      <ReusableModal
        open={openCreate}
        onOpenChange={setOpenCreate}
        title="Create message"
        description="Submit a new message."
        content={
          <div className="space-y-3">
            <label className="grid gap-2">
              <span className="text-sm font-medium">Content</span>
              <Input
                ref={inputRef}
                placeholder="Type your message…"
                value={newContent}
                onChange={(e) => setNewContent(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && newContent.trim()) {
                    createMut.mutate({ content: newContent.trim() });
                  }
                }}
              />
            </label>
            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" onClick={() => setOpenCreate(false)}>Cancel</Button>
              <Button
                onClick={() => createMut.mutate({ content: newContent.trim() })}
                disabled={createMut.isPending || !newContent.trim()}
                className="gap-2"
              >
                {createMut.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
                Create
              </Button>
            </div>
          </div>
        }
        size="lg"
      />

    </div>
  );
}
