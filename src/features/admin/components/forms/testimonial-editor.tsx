"use client";

import { Controller, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { z } from "zod";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TestimonialCard } from "@/features/landing/components/testimonial-card";
import { testimonialEditorSchema } from "../../editor-schemas";
import { saveCommunityTestimonial, type CommunityMember, type CommunityTestimonial } from "../../community-repository";
import { useAdminAction } from "../../hooks/use-admin-action";
import { AdminFormDialog } from "../admin-form-dialog";
import { EditorField } from "./editor-field";
import { EditorForm } from "./editor-form";

type Values = z.infer<typeof testimonialEditorSchema>;

export function TestimonialEditor({ testimonial, members, testimonials, onSaved, onCancel }: {
  testimonial: CommunityTestimonial | null;
  members: CommunityMember[];
  testimonials: CommunityTestimonial[];
  onSaved: () => Promise<void>;
  onCancel: () => void;
}) {
  const form = useForm<Values>({ resolver: zodResolver(testimonialEditorSchema), defaultValues: {
    memberId: testimonial?.memberId ?? "", text: testimonial?.text ?? "",
  } });
  const values = useWatch({ control: form.control });
  const action = useAdminAction();
  const selected = members.find((member) => member.id === values.memberId);
  const available = members.filter((member) => !testimonials.some((item) => item.memberId === member.id && item.id !== testimonial?.id));

  return <AdminFormDialog open title={testimonial ? "Editar testimonio" : "Crear testimonio"}
    description="Elige una integrante y comparte su historia con la comunidad." busy={action.pending} onOpenChange={(open) => { if (!open) onCancel(); }}>
    <EditorForm pending={action.pending} error={action.error} onCancel={onCancel}
      onSubmit={form.handleSubmit(async (data) => {
        await action.run(async () => { await saveCommunityTestimonial(testimonial?.id ?? null, data.memberId, data.text); await onSaved(); });
      })}
      preview={<TestimonialCard index={0} isCurrent testimonial={{ name: selected?.name ?? "Integrante", image: selected?.imageUrl, text: values.text || "Su historia aparecerá aquí.", tag: "Chica SC" }} />}>
      <Controller control={form.control} name="memberId" render={({ field, fieldState }) => (
        <EditorField label="Integrante" error={fieldState.error?.message}
          description={available.length ? "Cada integrante puede tener un testimonio. Usaremos su foto de perfil." : "Todas las integrantes ya tienen testimonio, o aún no has agregado integrantes."}>
          {(props) => <Select name={field.name} value={field.value} onValueChange={field.onChange} disabled={action.pending || !available.length}>
            <SelectTrigger {...props} ref={field.ref} onBlur={field.onBlur}><SelectValue placeholder="Selecciona una integrante" /></SelectTrigger>
            <SelectContent>{available.map((member) => <SelectItem key={member.id} value={member.id}>{member.name}</SelectItem>)}</SelectContent>
          </Select>}
        </EditorField>
      )} />
      <EditorField label="Testimonio" error={form.formState.errors.text?.message} description={`${values.text?.length ?? 0}/2000 caracteres`}>
        {(props) => <Textarea {...props} {...form.register("text")} maxLength={2000} placeholder="Escribe su experiencia…" className="min-h-40 resize-y" />}
      </EditorField>
    </EditorForm>
  </AdminFormDialog>;
}
