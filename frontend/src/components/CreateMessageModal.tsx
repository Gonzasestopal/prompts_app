"use client";

import { ReusableModal } from "@/components/ReusableModal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createMessage } from "@/lib/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { useRef, useState } from "react";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function CreateMessageModal({ open, onOpenChange }: Props) {
  const [newContent, setNewContent] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();

  const createMut = useMutation({
    mutationFn: createMessage,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["messages"] });
      setNewContent("");
      onOpenChange(false);
    },
  });

  return (
    <ReusableModal
      open={open}
      onOpenChange={onOpenChange}
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
            <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
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
  );
}
