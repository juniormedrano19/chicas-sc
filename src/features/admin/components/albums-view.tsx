"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AlbumGallery } from "@/features/albums/album-gallery";
import { getStoredAlbums, saveStoredAlbum, deleteStoredAlbum } from "@/features/albums/repository";
import type { Album, AlbumPhoto } from "@/features/albums/content";
import { useAdminStore } from "../store/use-admin-store";

export function AlbumsView() {
  const session = useAdminStore((state) => state.session);
  const [albums, setAlbums] = useState<Album[]>([]);
  const [editing, setEditing] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [slug, setSlug] = useState("");
  const [photos, setPhotos] = useState<AlbumPhoto[]>([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  useEffect(() => {
    let active = true;
    getStoredAlbums().then((data) => { if (active) setAlbums(data); }).catch(() => { if (active) setError("No pudimos cargar los álbumes."); });
    return () => { active = false; };
  }, []);
  function reset() { setEditing(null); setTitle(""); setDescription(""); setSlug(""); setPhotos([]); }
  async function upload(files: File[]) {
    if (files.length + photos.length > 100) { setError("El máximo es 100 fotos por álbum."); return; }
    setBusy(true); setError("");
    try {
      for (const file of files) {
        const form = new FormData(); form.set("image", file); form.set("section", "albums");
        const response = await fetch("/api/admin/member-image", { method: "POST", headers: { "x-admin-code": session?.user.codigo ?? "" }, body: form });
        const result = await response.json();
        if (!response.ok) throw new Error(`${file.name}: ${result.error}`);
        setPhotos((current) => [...current, { src: result.imageUrl, alt: file.name.replace(/\.[^.]+$/, ""), caption: "", width: result.width, height: result.height }]);
      }
    } catch (error) { setError(error instanceof Error ? error.message : "No se pudieron subir las fotos."); }
    finally { setBusy(false); }
  }
  async function persist(action: () => Promise<void>) {
    setBusy(true); setError("");
    try { await action(); setAlbums(await getStoredAlbums()); reset(); toast.success("Álbumes actualizados."); }
    catch (error) { setError(error instanceof Error ? error.message : "No se pudo guardar."); }
    finally { setBusy(false); }
  }
  return <div className="flex-1 overflow-y-auto p-6">
    <h2 className="mb-4 text-lg font-semibold">{editing ? "Editar álbum" : "Crear álbum"}</h2>
    {error && <p role="alert" className="mb-4 rounded bg-red-50 p-3 text-red-700">{error}</p>}
    <form className="space-y-4" onSubmit={(event) => { event.preventDefault(); void persist(() => saveStoredAlbum(editing, { title, description, slug, photos, cover: photos[0]?.src ?? "", isExample: false })); }}>
      <fieldset disabled={busy} className="space-y-4 disabled:opacity-60">
        <label className="block space-y-2">Título<Input required maxLength={120} value={title} onChange={(event) => setTitle(event.target.value)} /></label>
        <label className="block space-y-2">Descripción<textarea required maxLength={1000} className="block min-h-24 w-full rounded border p-3" value={description} onChange={(event) => setDescription(event.target.value)} /></label>
        <label className="block space-y-2">Slug<Input required pattern="[a-z0-9]+(-[a-z0-9]+)*" placeholder="nuestras-previas" value={slug} onChange={(event) => setSlug(event.target.value)} /></label>
        <label className="block space-y-2">Fotos<input type="file" multiple accept="image/*" className="block" onChange={(event) => { const files = Array.from(event.target.files ?? []); event.target.value = ""; void upload(files); }} /></label>
        <p className="text-xs text-slate-500">Hasta 100 fotos, 10 MB por foto. La primera foto será la portada.</p>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-6">{photos.map((photo, index) => <div key={`${photo.src}-${index}`} className="rounded border p-2">
          <div className="relative aspect-square"><Image src={photo.src} alt={photo.alt} fill sizes="160px" className="rounded object-cover" /></div>
          <p className="my-2 text-xs">{index === 0 ? "Portada" : `Foto ${index + 1}`}</p>
          <div className="flex flex-wrap gap-1"><Button type="button" size="sm" variant="outline" onClick={() => setPhotos([photo, ...photos.filter((_, i) => i !== index)])}>Portada</Button><Button type="button" size="sm" variant="outline" onClick={() => setPhotos(photos.filter((_, i) => i !== index))}>Quitar</Button></div>
        </div>)}</div>
        <div className="flex gap-2"><Button disabled={!photos.length}>Guardar álbum</Button><Button type="button" variant="outline" onClick={reset}>Cancelar edición</Button></div>
      </fieldset>
    </form>
    {busy && <p role="status" className="my-4">Procesando…</p>}
    {!!photos.length && <div className="my-8"><h3 className="mb-4 font-semibold">Previsualización</h3><AlbumGallery photos={photos} /></div>}
    <h3 className="mb-3 mt-8 font-semibold">Álbumes guardados</h3>
    <div className="divide-y rounded border">{albums.map((album) => <div key={album.slug} className="flex flex-wrap items-center justify-between gap-3 p-3"><div><strong>{album.title}</strong><p className="text-xs text-slate-500">/albumes/{album.slug} · {album.photos.length} fotos</p></div><div className="flex gap-2"><Button size="sm" variant="outline" disabled={busy} onClick={() => { setEditing(album.slug); setTitle(album.title); setDescription(album.description); setSlug(album.slug); setPhotos(album.photos); }}>Editar</Button><Button size="sm" variant="destructive" disabled={busy} onClick={() => { if (window.confirm(`¿Eliminar el álbum «${album.title}»?`)) void persist(() => deleteStoredAlbum(album.slug)); }}>Eliminar</Button></div></div>)}</div>
  </div>;
}
