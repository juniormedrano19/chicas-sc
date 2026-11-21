"use client";

import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { z } from "zod";
import { Input } from "@/components/ui/input";
import { MemberCard } from "@/features/landing/components/member-card";
import { memberEditorSchema } from "../../editor-schemas";
import { saveCommunityMember, type CommunityMember } from "../../community-repository";
import { useImageUpload } from "../../hooks/use-image-upload";
import { useAdminAction } from "../../hooks/use-admin-action";
import { AdminFormDialog } from "../admin-form-dialog";
import { EditorField } from "./editor-field";
import { EditorForm } from "./editor-form";
import { ImageUploadField } from "./image-upload-field";

type Values = z.infer<typeof memberEditorSchema>;

export function MemberEditor({ member, onSaved, onCancel }: {
  member: CommunityMember | null;
  onSaved: () => Promise<void>;
  onCancel: () => void;
}) {
  const form = useForm<Values>({ resolver: zodResolver(memberEditorSchema), defaultValues: {
    name: member?.name ?? "", imageUrl: member?.imageUrl ?? "", birthDate: member?.birthDate ?? "",
  } });
  const values = useWatch({ control: form.control });
  const action = useAdminAction();
  const upload = useImageUpload("members", (image) => form.setValue("imageUrl", image.imageUrl, { shouldValidate: true, shouldDirty: true }));
  const pending = action.pending || upload.uploading;
  const { errors } = form.formState;

  return <AdminFormDialog open title={member ? "Editar integrante" : "Agregar integrante"}
    description="Completa su perfil y revisa cómo se verá en la comunidad." busy={pending} onOpenChange={(open) => { if (!open) onCancel(); }}>
    <EditorForm pending={pending} error={action.error || upload.error} onCancel={onCancel}
      onSubmit={form.handleSubmit(async (data) => {
        await action.run(async () => { await saveCommunityMember(member?.id ?? null, { ...data, birthDate: data.birthDate || null }); await onSaved(); });
      })}
      preview={<div className="mx-auto grid max-w-64"><MemberCard index={0} member={{ name: values.name || "Nombre de la integrante", image: values.imageUrl || undefined, quote: "", role: "Integrante", initials: "", number: "" }} /></div>}>
      <EditorField label="Nombre" error={errors.name?.message}>{(props) => <Input {...props} {...form.register("name")} maxLength={100} placeholder="Nombre de la integrante" autoComplete="name" className="h-10" />}</EditorField>
      <ImageUploadField count={values.imageUrl ? 1 : 0} disabled={pending} uploading={upload.uploading} error={errors.imageUrl?.message} onFiles={(files) => void upload.upload(files.slice(0, 1))} />
      <EditorField label="Fecha de nacimiento" description="Opcional. No aparece en la tarjeta pública." error={errors.birthDate?.message}>{(props) => <Input {...props} {...form.register("birthDate")} type="date" className="h-10" />}</EditorField>
    </EditorForm>
  </AdminFormDialog>;
}
