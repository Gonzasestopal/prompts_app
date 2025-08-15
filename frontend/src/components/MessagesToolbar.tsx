"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Search } from "lucide-react";

type Props = {
  search: string;
  onSearch: (val: string) => void;
  statusFilter: string;
  onStatusFilterChange: (val: string) => void;
  onNewMessage: () => void;
  total: number;
  isFetching?: boolean;
};

export function MessagesToolbar({
  search,
  onSearch,
  statusFilter,
  onStatusFilterChange,
  onNewMessage,
  total,
  isFetching,
}: Props) {
  return (
    <div className="flex items-center justify-between gap-2">
      <div className="relative w-full max-w-xs">
        <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search messages…"
          value={search}
          onChange={(e) => onSearch(e.target.value)}
          className="pl-8"
        />
      </div>

      <Select value={statusFilter} onValueChange={onStatusFilterChange}>
        <SelectTrigger className="w-[140px]">
          <SelectValue placeholder="Filter by status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All</SelectItem>
          <SelectItem value="active">Active</SelectItem>
          <SelectItem value="inactive">Inactive</SelectItem>
          <SelectItem value="deleted">Deleted</SelectItem>
        </SelectContent>
      </Select>

      <Button className="gap-2" onClick={onNewMessage}>
        <Plus className="h-4 w-4" />
        New Message
      </Button>

      <div className="text-sm text-muted-foreground">
        {isFetching ? "Loading…" : `${total} item${total === 1 ? "" : "s"}`}
      </div>
    </div>
  );
}
