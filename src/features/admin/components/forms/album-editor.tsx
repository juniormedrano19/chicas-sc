"use client";

import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { z } from "zod";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { AlbumGallery } from "@/features/albums/album-gallery";
import type { Album } from "@/features/albums/content";
import { saveStoredAlbum } from "@/features/albums/repository";
import { albumEditorSchema } from "../../editor-schemas";
import { useImageUpload } from "../../hooks/use-image-upload";
import { useAdminAction } from "../../hooks/use-admin-action";
import { AdminFormDialog } from "../admin-form-dialog";
import { EditorField } from "./editor-field";
import { EditorForm } from "./editor-form";
import { ImageUploadField } from "./image-upload-field";
import { AlbumPhotoList } from "./album-photo-list";

type Values = z.infer<typeof albumEditorSchema>;

export function AlbumEditor({ album, onSaved, onCancel }: { album: Album | null; onSaved: () => Promise<void>; onCancel: () => void }) {
  const form = useForm<Values>({ resolver: zodResolver(albumEditorSchema), defaultValues: {
    title: album?.title ?? "", description: album?.description ?? "", slug: album?.slug ?? "", photos: album?.photos ?? [],
  } });
  const photos = useWatch({ control: form.control, name: "photos" });
  const action = useAdminAction();
  const [limitError, setLimitError] = useState<string | null>(null);
  const upload = useImageUpload("albums", (image) => form.setValue("photos", [...form.getValues("photos"), {
    src: image.imageUrl, alt: `${form.getValues("title").trim() || "Álbum de Chicas SC"} · Foto ${form.getValues("photos").length + 1}`, caption: "", width: image.width, height: image.height,
  }], { shouldValidate: true, shouldDirty: true }));
  const pending = action.pending || upload.uploading;
  const { errors } = form.formState;

  return <AdminFormDialog open title={album ? "Editar álbum" : "Crear álbum"}
    description="Organiza tus recuerdos, elige una portada y revisa las fotos antes de publicar." busy={pending} onOpenChange={(open) => { if (!open) onCancel(); }}>
    <EditorForm pending={pending} error={action.error || limitError || upload.error} onCancel={onCancel}
      onSubmit={form.handleSubmit(async (data) => {
        await action.run(async () => { await saveStoredAlbum(album?.slug ?? null, { ...data, cover: data.photos[0].src, isExample: false }); await onSaved(); });
      })}
      preview={photos.length ? <AlbumGallery photos={photos} /> : <div className="flex min-h-48 items-center justify-center rounded-lg border border-dashed p-6 text-center text-sm text-muted-foreground">Las fotos del álbum aparecerán aquí.</div>}>
      <EditorField label="Título" error={errors.title?.message}>{(props) => <Input {...props} {...form.register("title")} maxLength={120} placeholder="Un recuerdo para compartir" className="h-10" />}</EditorField>
      <EditorField label="Descripción" error={errors.description?.message}>{(props) => <Textarea {...props} {...form.register("description")} maxLength={1000} placeholder="Cuéntanos qué hizo especial este encuentro…" className="min-h-24 resize-y" />}</EditorField>
      <EditorField label="Slug" description="Identifica la dirección del álbum: /albumes/nuestras-previas" error={errors.slug?.message}>{(props) => <Input {...props} {...form.register("slug")} placeholder="nuestras-previas" className="h-10" autoCapitalize="none" spellCheck={false} />}</EditorField>
      <ImageUploadField multiple count={photos.length} disabled={pending} uploading={upload.uploading} error={errors.photos?.message || errors.photos?.root?.message} onFiles={(files) => {
        setLimitError(null);
        if (photos.length + files.length > 100) { setLimitError("El máximo es 100 fotos por álbum."); return; }
        void upload.upload(files);
      }} />
      <AlbumPhotoList photos={photos} disabled={pending} onChange={(next) => form.setValue("photos", next, { shouldValidate: true, shouldDirty: true })} />
    </EditorForm>
  </AdminFormDialog>;
}
