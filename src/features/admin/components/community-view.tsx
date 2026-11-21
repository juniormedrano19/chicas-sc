"use client";

import { useState } from "react";
import { ArrowUp, ArrowDown, Pencil, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  getCommunityContent, deleteCommunityMember, deleteCommunityTestimonial, reorderCommunityMembers,
  type CommunityMember, type CommunityTestimonial,
} from "../community-repository";
import { useAdminResource } from "../hooks/use-admin-resource";
import { useAdminAction } from "../hooks/use-admin-action";
import { MemberEditor } from "./forms/member-editor";
import { TestimonialEditor } from "./forms/testimonial-editor";
import { EditorError } from "./forms/editor-form";
import { AdminDeleteDialog } from "./admin-delete-dialog";

type CommunityData = Awaited<ReturnType<typeof getCommunityContent>>;
const emptyCommunity: CommunityData = { members: [], testimonials: [] };
type EditorState =
  | { type: "members"; record: CommunityMember | null }
  | { type: "testimonials"; record: CommunityTestimonial | null }
  | null;

export function CommunityView({ section }: { section: "members" | "testimonials" }) {
  const resource = useAdminResource(getCommunityContent, emptyCommunity);
  const action = useAdminAction();
  const deletion = useAdminAction();
  const [editor, setEditor] = useState<EditorState>(null);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const { members, testimonials } = resource.data;
  const isMembers = section === "members";
  const rows = isMembers
    ? members.map((member) => ({ id: member.id, name: member.name, description: null, edit: () => setEditor({ type: "members", record: member }) }))
    : testimonials.map((testimonial) => ({
      id: testimonial.id,
      name: members.find((member) => member.id === testimonial.memberId)?.name ?? "Integrante",
      description: testimonial.text,
      edit: () => setEditor({ type: "testimonials", record: testimonial }),
    }));

  async function onSaved() {
    await resource.reload();
    setEditor(null);
    toast.success("Cambios guardados.");
  }
  async function moveMember(index: number, direction: -1 | 1) {
    const next = [...members];
    const target = index + direction;
    if (target < 0 || target >= next.length) return;
    [next[index], next[target]] = [next[target], next[index]];
    if (await action.run(async () => { await reorderCommunityMembers(next.map((member) => member.id)); await resource.reload(); })) {
      toast.success("Orden de integrantes guardado.");
    }
  }

  return <div className="flex-1 overflow-y-auto p-6">
    <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
      <div><h2 className="text-lg font-semibold">{isMembers ? "Integrantes" : "Testimonios"}</h2><p className="mt-1 text-sm text-muted-foreground">{isMembers ? "Gestiona sus perfiles y el orden en la comunidad." : "Comparte las historias de las integrantes."}</p></div>
      <Button disabled={resource.loading} onClick={() => setEditor({ type: section, record: null })}><Plus />{isMembers ? "Agregar integrante" : "Crear testimonio"}</Button>
    </div>
    <EditorError message={resource.error || action.error} />
    {resource.loading ? <p role="status" className="py-8 text-center text-muted-foreground">Cargando…</p> : rows.length === 0 ? <p className="rounded-xl border border-dashed p-8 text-center text-sm text-muted-foreground">{isMembers ? "Todavía no hay integrantes. Agrega la primera para comenzar." : "Todavía no hay testimonios. Crea el primero para compartir su historia."}</p> :
      <div className="divide-y overflow-hidden rounded-xl border bg-background shadow-xs">
        {rows.map((row, index) => <div key={row.id} className="flex flex-wrap items-center justify-between gap-4 px-4 py-3">
          <div className="flex min-w-0 flex-1 items-center gap-3">
            {isMembers && <div className="flex shrink-0 items-center gap-1">
              <span className="w-6 text-center text-xs font-semibold tabular-nums text-muted-foreground">{index + 1}</span>
              <Button type="button" size="icon-sm" variant="ghost" disabled={action.pending || index === 0} aria-label={`Subir a ${row.name}`} onClick={() => void moveMember(index, -1)}><ArrowUp /></Button>
              <Button type="button" size="icon-sm" variant="ghost" disabled={action.pending || index === members.length - 1} aria-label={`Bajar a ${row.name}`} onClick={() => void moveMember(index, 1)}><ArrowDown /></Button>
            </div>}
            <div className="min-w-0">
              <p className="truncate font-medium">{row.name}</p>
              {row.description && <p className="truncate text-sm text-muted-foreground">{row.description}</p>}
            </div>
          </div>
          <div className="flex gap-2">
            <Button size="sm" variant="outline" onClick={row.edit}><Pencil />Editar</Button>
            <Button size="icon-sm" variant="ghost" className="text-destructive" aria-label="Eliminar" onClick={() => { deletion.clearError(); setDeleteTarget(row.id); }}><Trash2 /></Button>
          </div>
        </div>)}
      </div>}
    {editor?.type === "members" && <MemberEditor member={editor.record} onSaved={onSaved} onCancel={() => setEditor(null)} />}
    {editor?.type === "testimonials" && <TestimonialEditor testimonial={editor.record} members={members} testimonials={testimonials} onSaved={onSaved} onCancel={() => setEditor(null)} />}
    <AdminDeleteDialog open={deleteTarget !== null} onClose={() => setDeleteTarget(null)} title={isMembers ? "Eliminar integrante" : "Eliminar testimonio"}
      description={isMembers ? "Se eliminará su perfil. Si tiene un testimonio, elimínalo primero." : "Se eliminará el texto y la integrante quedará disponible para un nuevo testimonio."}
      pending={deletion.pending} error={deletion.error} onConfirm={() => {
        if (!deleteTarget) return;
        void deletion.run(async () => {
          await (isMembers ? deleteCommunityMember(deleteTarget) : deleteCommunityTestimonial(deleteTarget));
          await resource.reload(); setDeleteTarget(null); toast.success("Registro eliminado.");
        });
      }} />
  </div>;
}
