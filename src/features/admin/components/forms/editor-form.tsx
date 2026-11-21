"use client";

import type { FormEventHandler, ReactNode } from "react";
import { AlertCircle, LoaderCircle, Save } from "lucide-react";
import { Button } from "@/components/ui/button";

export function EditorError({ message }: { message?: string | null }) {
  if (!message) return null;
  return <div role="alert" className="mb-4 flex items-start gap-2 rounded-lg border border-destructive/20 bg-destructive/5 p-3 text-sm text-destructive"><AlertCircle className="mt-0.5 size-4 shrink-0" /><p>{message}</p></div>;
}

export function EditorForm({ onSubmit, onCancel, pending, error, children, preview }: {
  onSubmit: FormEventHandler<HTMLFormElement>;
  onCancel: () => void;
  pending: boolean;
  error?: string | null;
  children: ReactNode;
  preview: ReactNode;
}) {
  return <form noValidate onSubmit={onSubmit} className="space-y-6">
    <EditorError message={error} />
    <div className="grid items-start gap-6 md:grid-cols-2">
      <fieldset disabled={pending} className="min-w-0 space-y-5 disabled:opacity-60">{children}</fieldset>
      <aside className="min-w-0 rounded-xl border bg-muted/30 p-4">
        <p className="mb-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Previsualización</p>
        {preview}
      </aside>
    </div>
    <div className="sticky bottom-0 flex flex-wrap justify-end gap-2 border-t bg-background py-4">
      <Button type="button" variant="outline" onClick={onCancel} disabled={pending}>Cancelar</Button>
      <Button type="submit" disabled={pending}>{pending ? <LoaderCircle className="size-4 animate-spin" /> : <Save className="size-4" />}{pending ? "Procesando…" : "Guardar cambios"}</Button>
    </div>
  </form>;
}
