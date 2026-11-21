"use client";

import { useMemo, useState } from "react";
import { CheckCheck, Clock, Inbox, Mail, RefreshCw, Search, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { WhatsAppIcon } from "@/components/icons/whatsapp-icon";
import { AdminFormDialog } from "./admin-form-dialog";
import { AdminDeleteDialog } from "./admin-delete-dialog";
import { EditorError } from "./forms/editor-form";
import { useAdminAction } from "../hooks/use-admin-action";
import type { AdminContactSubmission } from "../types";

interface InboxSubmissionsProps {
  submissions: AdminContactSubmission[];
  loading: boolean;
  onRefresh: () => Promise<void>;
  onMarkAsRead?: (id: string) => Promise<void> | void;
  onDeleteSubmission?: (id: string) => Promise<void> | void;
  filterTab: "principal" | "otras" | "mas_tarde" | "borradas";
}

export function buildWhatsAppLink(rawPhone: string, name: string) {
  const digits = rawPhone.replace(/\D/g, "");
  const phone = digits.length === 9 && digits.startsWith("9") ? `51${digits}` : digits;
  return `https://wa.me/${phone}?text=${encodeURIComponent(`¡Hola ${name}! Te escribimos desde el equipo de Chicas SC respecto a tu mensaje en la web.`)}`;
}

export function formatSubmissionDate(createdAt?: AdminContactSubmission["createdAt"]) {
  if (!createdAt) return "Reciente";
  const date = typeof createdAt === "object" && "seconds" in createdAt
    ? new Date(createdAt.seconds * 1000) : new Date(createdAt);
  if (Number.isNaN(date.getTime())) return "Reciente";
  return date.toLocaleString("es-PE", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });
}

export function InboxSubmissions({ submissions, loading, onRefresh, onMarkAsRead, onDeleteSubmission, filterTab }: InboxSubmissionsProps) {
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<AdminContactSubmission | null>(null);
  const [toDelete, setToDelete] = useState<AdminContactSubmission | null>(null);
  const action = useAdminAction();
  const deletion = useAdminAction();
  const filtered = useMemo(() => {
    if (filterTab === "borradas" || filterTab === "mas_tarde") return [];
    const term = search.trim().toLowerCase();
    return submissions.filter((item) => [item.name, item.email, item.whatsapp ?? "", item.message].some((value) => value.toLowerCase().includes(term)));
  }, [submissions, search, filterTab]);

  function openMessage(item: AdminContactSubmission) {
    setSelected(item);
    if (item.status !== "read") {
      void action.run(async () => { await onMarkAsRead?.(item.id); });
      setSelected({ ...item, status: "read" });
    }
  }

  return <div className="flex min-h-0 min-w-0 flex-1 flex-col bg-white">
    <div className="flex shrink-0 flex-col justify-between gap-3 border-b border-[#f1f2f4] px-4 py-3 md:flex-row md:items-center md:px-6">
      <div className="relative w-full md:max-w-md">
        <Search aria-hidden="true" className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
        <Input value={search} onChange={(event) => setSearch(event.target.value)} aria-label="Buscar mensajes" placeholder="Buscar mensajes…" className="h-11 pl-9 md:h-8 md:text-xs" />
      </div>
      <div className="flex items-center justify-between gap-3"><span className="text-xs text-slate-500">{filtered.length} mensajes</span><Button variant="ghost" size="icon" aria-label="Actualizar mensajes" disabled={loading || action.pending} onClick={() => void action.run(onRefresh)}><RefreshCw className={`size-4 ${loading || action.pending ? "animate-spin" : ""}`} /></Button></div>
    </div>
    <EditorError message={action.error} />
    <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
      {loading ? <p role="status" className="p-8 text-center text-sm text-muted-foreground">Cargando mensajes…</p> : filtered.length === 0 ? <div className="p-8 text-center"><Inbox className="mx-auto mb-3 size-8 text-slate-400" /><p className="text-sm font-semibold">No hay mensajes en esta vista</p><p className="mt-2 text-xs text-muted-foreground">{search ? "Prueba con otra búsqueda." : "Aquí aparecerán los nuevos mensajes de contacto."}</p></div> :
        <div className="space-y-3 p-3 md:space-y-0 md:divide-y md:divide-slate-100 md:p-0">
          {filtered.map((item) => <article key={item.id} className={`rounded-xl border p-4 md:flex md:items-center md:justify-between md:gap-3 md:rounded-none md:border-0 md:px-6 md:py-3.5 ${item.status !== "read" ? "bg-slate-50/50" : "bg-white"}`}>
            <button type="button" onClick={() => openMessage(item)} className="flex min-w-0 flex-1 gap-3 text-left" aria-label={`Leer mensaje de ${item.name}`}>
              <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary/20 text-sm font-bold text-secondary">{item.name.charAt(0).toUpperCase()}</span>
              <span className="block min-w-0 flex-1">
                <span className="flex flex-wrap items-center gap-2"><span className="text-sm font-semibold md:text-xs">{item.name}</span><span className={`rounded px-1.5 py-0.5 text-[10px] ${item.status === "read" ? "bg-slate-100 text-slate-500" : "bg-amber-50 text-amber-700"}`}>{item.status === "read" ? "Leído" : "Nuevo"}</span></span>
                <span className="mt-1 block truncate text-xs text-slate-500">{item.email}</span>
                <span className="mt-2 line-clamp-2 text-sm leading-relaxed text-slate-700 md:mt-1 md:text-xs">{item.message}</span>
              </span>
            </button>
            <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t pt-3 md:mt-0 md:justify-end md:border-0 md:pt-0">
              <span className="flex items-center gap-1 text-[11px] text-slate-500"><Clock className="size-3" />{formatSubmissionDate(item.createdAt)}</span>
              <div className="flex items-center gap-1">{item.whatsapp && <Button asChild size="sm" className="bg-whatsapp text-white hover:bg-whatsapp/90"><a href={buildWhatsAppLink(item.whatsapp, item.name)} target="_blank" rel="noopener noreferrer"><WhatsAppIcon className="size-4" /><span className="md:hidden">WhatsApp</span><span className="hidden md:inline">{item.whatsapp}</span></a></Button>}
                {onDeleteSubmission && <Button type="button" variant="ghost" size="icon" aria-label={`Eliminar mensaje de ${item.name}`} className="text-slate-400 hover:text-destructive" onClick={() => { deletion.clearError(); setToDelete(item); }}><Trash2 className="size-4" /></Button>}
              </div>
            </div>
          </article>)}
        </div>}
    </div>
    <AdminFormDialog open={selected !== null} title={selected?.name ?? "Mensaje de contacto"} description="Detalle del mensaje recibido desde la web." onOpenChange={(open) => { if (!open) setSelected(null); }}>
      {selected && <div className="space-y-5 pb-4">
        <div className="grid gap-4 rounded-xl border bg-muted/40 p-4 text-sm md:grid-cols-2">
          <div className="min-w-0"><p className="mb-1 text-xs text-muted-foreground">Correo electrónico</p><a href={`mailto:${selected.email}`} className="flex items-start gap-2 break-all"><Mail className="mt-0.5 size-4 shrink-0" />{selected.email}</a></div>
          <div><p className="mb-1 text-xs text-muted-foreground">WhatsApp / celular</p><p>{selected.whatsapp || "No registrado"}</p></div>
        </div>
        <div><h3 className="mb-2 text-sm font-semibold">Mensaje</h3><p className="whitespace-pre-wrap break-words rounded-xl border p-4 text-sm leading-relaxed">{selected.message}</p></div>
        <p className="text-xs text-muted-foreground">Recibido: {formatSubmissionDate(selected.createdAt)}</p>
        <p className="flex items-center gap-2 text-xs text-emerald-700"><CheckCheck className="size-4" />{selected.consent ? "Consentimiento autorizado" : "Sin consentimiento registrado"}</p>
        <div className="flex flex-col gap-2 border-t pt-4 md:flex-row md:justify-end">
          <Button variant="outline" onClick={() => setSelected(null)}>Cerrar</Button>
          {selected.whatsapp && <Button asChild className="bg-whatsapp text-white hover:bg-whatsapp/90"><a href={buildWhatsAppLink(selected.whatsapp, selected.name)} target="_blank" rel="noopener noreferrer"><WhatsAppIcon className="size-4" />Abrir chat de WhatsApp</a></Button>}
        </div>
      </div>}
    </AdminFormDialog>
    <AdminDeleteDialog open={toDelete !== null} title="Eliminar mensaje" description={`Se eliminará el mensaje de ${toDelete?.name ?? ""}. Esta acción no se puede deshacer.`} pending={deletion.pending} error={deletion.error} onClose={() => setToDelete(null)} onConfirm={() => {
      if (!toDelete || !onDeleteSubmission) return;
      void deletion.run(async () => { await onDeleteSubmission(toDelete.id); setToDelete(null); });
    }} />
  </div>;
}
