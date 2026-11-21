"use client";

import { LoaderCircle, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { EditorError } from "./forms/editor-form";

export function AdminDeleteDialog({ open, onClose, onConfirm, title, description, pending, error }: {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  pending: boolean;
  error?: string | null;
}) {
  return <Dialog open={open} onOpenChange={(next) => { if (!next && !pending) onClose(); }}>
    <DialogContent data-admin-ui showCloseButton={!pending}>
      <DialogHeader><DialogTitle>{title}</DialogTitle><DialogDescription>{description}</DialogDescription></DialogHeader>
      <EditorError message={error} />
      <DialogFooter>
        <Button type="button" variant="outline" disabled={pending} onClick={onClose}>Cancelar</Button>
        <Button type="button" variant="destructive" disabled={pending} onClick={onConfirm}>{pending ? <LoaderCircle className="size-4 animate-spin" /> : <Trash2 className="size-4" />}Eliminar</Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>;
}
