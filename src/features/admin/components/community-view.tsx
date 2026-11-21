"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { ArrowUp, ArrowDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MemberCard } from "@/features/landing/components/member-card";
import { TestimonialCard } from "@/features/landing/components/testimonial-card";
import { useAdminStore } from "../store/use-admin-store";
import {
  getCommunityContent, saveCommunityMember, deleteCommunityMember,
  reorderCommunityMembers,
  saveCommunityTestimonial, deleteCommunityTestimonial,
  type CommunityMember, type CommunityTestimonial,
} from "../community-repository";

export function CommunityView({ section }: { section: "members" | "testimonials" }) {
  const session = useAdminStore((state) => state.session);
  const [members, setMembers] = useState<CommunityMember[]>([]);
  const [testimonials, setTestimonials] = useState<CommunityTestimonial[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [memberId, setMemberId] = useState("");
  const [text, setText] = useState("");
  const [busy, setBusy] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isMembers = section === "members";

  async function reload() {
    const data = await getCommunityContent();
    setMembers(data.members);
    setTestimonials(data.testimonials);
  }
  useEffect(() => {
    let active = true;
    getCommunityContent().then((data) => {
      if (active) { setMembers(data.members); setTestimonials(data.testimonials); }
    }).catch(() => { if (active) setError("No pudimos cargar los datos. Revisa la conexión y los permisos de Firestore."); });
    return () => { active = false; };
  }, []);

  function reset() {
    setEditingId(null); setName(""); setImageUrl(""); setBirthDate(""); setMemberId(""); setText("");
  }
  async function perform(action: () => Promise<void>) {
    setBusy(true); setError(null);
    try { await action(); await reload(); reset(); toast.success("Cambios guardados."); }
    catch (error) { setError(error instanceof Error ? error.message : "No se pudo guardar."); }
    finally { setBusy(false); }
  }
  async function upload(file?: File) {
    if (!file) return;
    setUploading(true); setError(null);
    try {
      const form = new FormData(); form.set("image", file);
      const response = await fetch("/api/admin/member-image", {
        method: "POST", headers: { "x-admin-code": session?.user.codigo ?? "" }, body: form,
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error);
      setImageUrl(result.imageUrl);
    } catch (error) { setError(error instanceof Error ? error.message : "No se pudo subir la foto."); }
    finally { setUploading(false); }
  }
  async function moveMember(index: number, direction: -1 | 1) {
    const target = index + direction;
    if (target < 0 || target >= members.length) return;
    const reordered = [...members];
    [reordered[index], reordered[target]] = [reordered[target], reordered[index]];
    setBusy(true); setError(null);
    try {
      await reorderCommunityMembers(reordered.map((member) => member.id));
      setMembers(reordered);
      toast.success("Orden de integrantes guardado.");
    } catch (error) {
      setError(error instanceof Error ? error.message : "No se pudo guardar el orden.");
    } finally { setBusy(false); }
  }
  const selected = members.find((member) => member.id === memberId);
  const available = members.filter((member) => !testimonials.some((item) => item.memberId === member.id && item.id !== editingId));

  return (
    <div className="flex-1 overflow-y-auto p-6">
      {error && <p role="alert" className="mb-4 rounded-lg bg-red-50 p-3 text-red-700">{error}</p>}
      <div className="grid gap-8 xl:grid-cols-2">
        <div>
          <h2 className="mb-4 text-lg font-semibold">{editingId ? "Editar" : "Agregar"} {isMembers ? "integrante" : "testimonio"}</h2>
          <form className="space-y-4" onSubmit={(event) => {
            event.preventDefault();
            void perform(() => isMembers
              ? saveCommunityMember(editingId, { name, imageUrl, birthDate: birthDate || null })
              : saveCommunityTestimonial(editingId, memberId, text));
          }}>
            {isMembers ? <>
              <label className="block space-y-2">Nombre<Input required maxLength={100} value={name} onChange={(event) => setName(event.target.value)} /></label>
              <label className="block space-y-2">Foto<input className="block w-full rounded border p-2" type="file" accept="image/*" disabled={uploading || busy} onChange={(event) => void upload(event.target.files?.[0])} /></label>
              <p className="text-xs text-slate-500">{uploading ? "Subiendo foto…" : imageUrl ? "Foto cargada." : "Selecciona una foto de hasta 10 MB."}</p>
              <label className="block space-y-2">Fecha de nacimiento (opcional)<Input type="date" value={birthDate} onChange={(event) => setBirthDate(event.target.value)} /></label>
            </> : <>
              <label className="block space-y-2">Integrante<select required className="block w-full rounded border p-2" value={memberId} onChange={(event) => setMemberId(event.target.value)}>
                <option value="">Selecciona una integrante</option>
                {available.map((member) => <option key={member.id} value={member.id}>{member.name}</option>)}
              </select></label>
              <p className="text-xs text-slate-500">Cada integrante puede tener un testimonio. Edita o elimina el existente para liberar su asociación.</p>
              <label className="block space-y-2">Testimonio<textarea required maxLength={2000} className="block min-h-32 w-full rounded border p-3" value={text} onChange={(event) => setText(event.target.value)} /></label>
            </>}
            <div className="flex gap-2"><Button disabled={busy || uploading || (isMembers && !imageUrl)}>{busy ? "Guardando…" : "Guardar"}</Button><Button type="button" variant="outline" onClick={reset} disabled={busy}>Cancelar edición</Button></div>
          </form>
        </div>
        <div><h3 className="mb-4 font-semibold">Previsualización</h3>
          {isMembers ? <div className="grid max-w-xs"><MemberCard index={0} member={{ name: name || "Nombre", image: imageUrl || undefined, quote: "", role: "Integrante", initials: "", number: "" }} /></div>
            : <TestimonialCard index={0} isCurrent testimonial={{ name: selected?.name || "Integrante", image: selected?.imageUrl, text: text || "Tu testimonio aparecerá aquí.", tag: "Chica SC" }} />}
        </div>
      </div>
      <h3 className="mb-3 mt-10 font-semibold">{isMembers ? "Integrantes" : "Testimonios"}</h3>
      {isMembers && <p className="mb-3 text-xs text-slate-500">Usa las flechas para cambiar el orden en la web. La posición 1 aparece primero. Los cambios se guardan automáticamente.</p>}
      <div className="divide-y rounded-lg border">
        {isMembers ? members.map((member, index) => <div key={member.id} className="flex flex-wrap items-center justify-between gap-3 p-3">
          <div className="flex items-center gap-2">
            <span className="w-6 text-center text-xs font-semibold text-slate-500">{index + 1}</span>
            <Button type="button" size="icon" variant="outline" disabled={busy || uploading || index === 0} aria-label={`Subir a ${member.name}`} onClick={() => void moveMember(index, -1)}><ArrowUp className="size-4" /></Button>
            <Button type="button" size="icon" variant="outline" disabled={busy || uploading || index === members.length - 1} aria-label={`Bajar a ${member.name}`} onClick={() => void moveMember(index, 1)}><ArrowDown className="size-4" /></Button>
          </div>
          <span>{member.name}</span><div className="flex gap-2"><Button size="sm" variant="outline" disabled={busy || uploading} onClick={() => { setEditingId(member.id); setName(member.name); setImageUrl(member.imageUrl); setBirthDate(member.birthDate ?? ""); }}>Editar</Button><Button size="sm" variant="destructive" disabled={busy} onClick={() => { if (window.confirm(`¿Eliminar a ${member.name}?`)) void perform(() => deleteCommunityMember(member.id)); }}>Eliminar</Button></div>
        </div>) : testimonials.map((item) => <div key={item.id} className="flex items-center justify-between gap-3 p-3">
          <div className="min-w-0"><strong>{members.find((member) => member.id === item.memberId)?.name ?? "Integrante"}</strong><p className="truncate">{item.text}</p></div><div className="flex gap-2"><Button size="sm" variant="outline" disabled={busy} onClick={() => { setEditingId(item.id); setMemberId(item.memberId); setText(item.text); }}>Editar</Button><Button size="sm" variant="destructive" disabled={busy} onClick={() => { if (window.confirm("¿Eliminar este testimonio y liberar a la integrante?")) void perform(() => deleteCommunityTestimonial(item.id)); }}>Eliminar</Button></div>
        </div>)}
      </div>
    </div>
  );
}
