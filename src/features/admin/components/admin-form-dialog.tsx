"use client";

import { useId, useRef, type ReactNode } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

interface AdminFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  busy?: boolean;
  children: ReactNode;
}

export function AdminFormDialog({ open, onOpenChange, title, description, busy = false, children }: AdminFormDialogProps) {
  const returnFocus = useRef<HTMLElement | null>(null);
  const descriptionId = useId();
  return (
    <Dialog open={open} onOpenChange={(nextOpen) => { if (!busy) onOpenChange(nextOpen); }}>
      <DialogContent
        data-admin-ui
        aria-describedby={description ? descriptionId : undefined}
        showCloseButton={!busy}
        className="flex max-h-[calc(100dvh-1rem)] flex-col gap-0 overflow-hidden rounded-2xl p-0 sm:max-w-5xl md:max-h-[90dvh]"
        onOpenAutoFocus={() => { returnFocus.current = document.activeElement as HTMLElement | null; }}
        onCloseAutoFocus={(event) => { event.preventDefault(); returnFocus.current?.focus(); }}
      >
        <DialogHeader className="shrink-0 border-b bg-muted/20 px-4 py-5 pr-12 text-left md:px-6 md:pr-12">
          <DialogTitle className="text-xl">{title}</DialogTitle>
          {description && <DialogDescription id={descriptionId} className="text-sm leading-relaxed">{description}</DialogDescription>}
        </DialogHeader>
        <div className="min-h-0 overflow-y-auto overscroll-contain px-4 pt-4 md:px-6 md:pt-6">{children}</div>
      </DialogContent>
    </Dialog>
  );
}
