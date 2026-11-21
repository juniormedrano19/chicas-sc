"use client";

import { useState } from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { getStoredAlbums, deleteStoredAlbum } from "@/features/albums/repository";
import type { Album } from "@/features/albums/content";
import { useAdminResource } from "../hooks/use-admin-resource";
import { useAdminAction } from "../hooks/use-admin-action";
import { AlbumEditor } from "./forms/album-editor";
import { EditorError } from "./forms/editor-form";
import { AdminDeleteDialog } from "./admin-delete-dialog";

const emptyAlbums: Album[] = [];

export function AlbumsView() {
  const resource = useAdminResource(getStoredAlbums, emptyAlbums);
  const deletion = useAdminAction();
  const [editor, setEditor] = useState<Album | null | undefined>();
  const [deleteTarget, setDeleteTarget] = useState<Album | null>(null);
  return <div className="min-w-0 flex-1 overflow-y-auto p-4 md:p-6">
    <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
      <div><h2 className="text-lg font-semibold">Álbumes</h2><p className="mt-1 text-sm text-muted-foreground">Organiza las fotos y los recuerdos de la comunidad.</p></div>
      <Button disabled={resource.loading} onClick={() => setEditor(null)}><Plus />Crear álbum</Button>
    </div>
    <EditorError message={resource.error} />
    {resource.loading ? <p role="status" className="py-8 text-center text-muted-foreground">Cargando…</p> : resource.data.length === 0 ? <p className="rounded-xl border border-dashed p-8 text-center text-sm text-muted-foreground">Todavía no hay álbumes. Crea el primero para compartir tus fotos.</p> :
      <div className="divide-y overflow-hidden rounded-xl border bg-background shadow-xs">{resource.data.map((album) => <div key={album.slug} className="flex flex-wrap items-center justify-between gap-4 px-4 py-3">
        <div className="min-w-0"><p className="truncate font-medium">{album.title}</p><p className="text-xs text-muted-foreground">/albumes/{album.slug} · {album.photos.length} fotos</p></div>
        <div className="flex gap-2">
          <Button size="sm" variant="outline" onClick={() => setEditor(album)}><Pencil />Editar</Button>
          <Button size="icon-sm" variant="ghost" className="text-destructive" aria-label={`Eliminar ${album.title}`} onClick={() => { deletion.clearError(); setDeleteTarget(album); }}><Trash2 /></Button>
        </div>
      </div>)}</div>}
    {editor !== undefined && <AlbumEditor album={editor} onCancel={() => setEditor(undefined)} onSaved={async () => {
      await resource.reload(); setEditor(undefined); toast.success("Álbum guardado.");
    }} />}
    <AdminDeleteDialog open={deleteTarget !== null} onClose={() => setDeleteTarget(null)} title="Eliminar álbum" description={`Se eliminará «${deleteTarget?.title ?? ""}» y sus fotos de la galería.`}
      pending={deletion.pending} error={deletion.error} onConfirm={() => {
        if (!deleteTarget) return;
        void deletion.run(async () => { await deleteStoredAlbum(deleteTarget.slug); await resource.reload(); setDeleteTarget(null); toast.success("Álbum eliminado."); });
      }} />
  </div>;
}
