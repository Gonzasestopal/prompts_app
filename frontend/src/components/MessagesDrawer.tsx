"use client";

import { Button } from "@/components/ui/button";
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { updateMessage } from "@/lib/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Message } from "../types";
import { fmt } from "../utils";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  message: Message | null;
};

export function MessageDrawer({ open, onOpenChange, message }: Props) {
  const [editContent, setEditContent] = useState("");
  const [editStatus, setEditStatus] = useState<Message["status"]>("active");
  const queryClient = useQueryClient();

  useEffect(() => {
    if (message) {
      setEditContent(message.content);
      setEditStatus(message.status);
    }
  }, [message]);

  const updateMut = useMutation({
    mutationFn: ({ id, content, status }: { id: string; content: string; status: Message["status"] }) =>
      updateMessage({ id, content, status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["messages"] });
      onOpenChange(false);
    },
  });

  if (!message) return null;

  return (
    <Drawer open={open} onOpenChange={onOpenChange} direction="right">
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Message details</DrawerTitle>
          <DrawerDescription>ID: {message._id}</DrawerDescription>
        </DrawerHeader>

        <div className="p-4 space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Content</label>
            <Input value={editContent} onChange={(e) => setEditContent(e.target.value)} />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Status</label>
            <Select value={editStatus} onValueChange={(val) => setEditStatus(val as Message["status"])}>
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

          <div className="space-y-1 text-sm text-muted-foreground">
            <div><span className="font-medium text-foreground">Created:</span> {fmt(message.created_at)}</div>
            <div><span className="font-medium text-foreground">Updated:</span> {fmt(message.updated_at)}</div>
          </div>
        </div>

        <div className="p-4 flex flex-col gap-2">
          <DrawerClose asChild>
            <Button variant="outline" className="w-full">Close</Button>
          </DrawerClose>
          <Button
            onClick={() => updateMut.mutate({ id: message._id, content: editContent, status: editStatus })}
            disabled={updateMut.isPending || !editContent.trim()}
            className="w-full"
          >
            {updateMut.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save"}
          </Button>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
