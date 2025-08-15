"use client";

import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import clsx from "clsx";
import * as React from "react";

type Size = "sm" | "md" | "lg" | "xl";

const sizeMap: Record<Size, string> = {
  sm: "sm:max-w-sm",
  md: "sm:max-w-md",
  lg: "sm:max-w-lg",
  xl: "sm:max-w-2xl",
};

export type ReusableModalProps = {
  /** Controlled state (optional). If omitted, provide a `trigger`. */
  open?: boolean;
  onOpenChange?: (open: boolean) => void;

  /** Optional trigger to open the modal (e.g., a Button). */
  trigger?: React.ReactNode;

  /** Header content */
  title?: React.ReactNode;
  description?: React.ReactNode;

  /** Main content — pass any component here */
  children?: React.ReactNode;
  /** If you prefer a prop instead of children */
  content?: React.ReactNode;

  /** Footer area (e.g., action buttons) */
  footer?: React.ReactNode;

  /** Max width size */
  size?: Size;

  /** Prevent closing by clicking outside */
  lockOutside?: boolean;

  /** Extra classes for DialogContent */
  className?: string;
};

export function ReusableModal({
  open,
  onOpenChange,
  trigger,
  title,
  description,
  children,
  content,
  footer,
  size = "lg",
  lockOutside = false,
  className,
}: ReusableModalProps) {
  const body = children ?? content;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {trigger ? <DialogTrigger asChild>{trigger}</DialogTrigger> : null}

      <DialogContent
        className={clsx(sizeMap[size], "p-0", className)}
        onInteractOutside={lockOutside ? (e) => e.preventDefault() : undefined}
      >
        {(title || description) && (
          <DialogHeader className="px-6 pt-6">
            {title ? <DialogTitle>{title}</DialogTitle> : null}
            {description ? <DialogDescription>{description}</DialogDescription> : null}
          </DialogHeader>
        )}

        <div className="px-6 py-6">{body}</div>

        {footer ? (
          <>
            <Separator />
            <DialogFooter className="px-6 py-4">{footer}</DialogFooter>
          </>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}

/** Handy close button you can reuse inside your footers */
export function ModalCloseButton(props: React.ComponentProps<"button">) {
  return (
    <DialogClose asChild>
      <button {...props} />
    </DialogClose>
  );
}
