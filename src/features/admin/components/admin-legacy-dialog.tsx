"use client";

import type { ReactNode } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

/** Accessible portal shell for older editors while they share the new layout. */
export function AdminLegacyDialog({ title, onClose, children, className = "sm:max-w-lg" }: { title: string; onClose: () => void; children: ReactNode; className?: string }) {
  return <Dialog open onOpenChange={(open) => { if (!open) onClose(); }}>
    <DialogContent data-admin-ui aria-describedby={undefined} showCloseButton={false} className={`max-h-[calc(100dvh-1rem)] overflow-y-auto border-0 bg-transparent p-0 shadow-none md:max-h-[90dvh] ${className}`}>
      <DialogTitle className="sr-only">{title}</DialogTitle>
      {children}
    </DialogContent>
  </Dialog>;
}
