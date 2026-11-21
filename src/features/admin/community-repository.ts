import { collection, doc, getDocs, runTransaction, setDoc } from "firebase/firestore";
import { firestore } from "@/lib/firebase/client";

export interface CommunityMember {
  id: string;
  name: string;
  imageUrl: string;
  birthDate: string | null;
  order?: number;
}
export interface CommunityTestimonial {
  id: string;
  memberId: string;
  text: string;
}

export async function getCommunityContent() {
  const [members, testimonials] = await Promise.all([
    getDocs(collection(firestore, "members")),
    getDocs(collection(firestore, "testimonials")),
  ]);
  return {
    members: members.docs.map((item) => ({ ...item.data(), id: item.id }) as CommunityMember)
      .sort((a, b) => (a.order ?? Number.MAX_SAFE_INTEGER) - (b.order ?? Number.MAX_SAFE_INTEGER)
        || a.id.localeCompare(b.id)),
    testimonials: testimonials.docs.map((item) => ({ ...item.data(), id: item.id }) as CommunityTestimonial),
  };
}

export async function saveCommunityMember(id: string | null, data: Omit<CommunityMember, "id">) {
  if (!data.name.trim() || !data.imageUrl) throw new Error("El nombre y la foto son obligatorios.");
  const ref = id ? doc(firestore, "members", id) : doc(collection(firestore, "members"));
  if (id) {
    await setDoc(ref, { ...data, name: data.name.trim() }, { merge: true });
  } else {
    const { members } = await getCommunityContent();
    const needsOrdering = members.some((member) => member.order === undefined);
    if (needsOrdering) await reorderCommunityMembers(members.map((member) => member.id));
    const order = needsOrdering
      ? members.length
      : Math.max(-1, ...members.map((member) => member.order ?? 0)) + 1;
    await setDoc(ref, { ...data, name: data.name.trim(), order });
  }
}

export async function reorderCommunityMembers(memberIds: string[]) {
  if (new Set(memberIds).size !== memberIds.length) throw new Error("El orden contiene integrantes duplicadas.");
  await runTransaction(firestore, async (transaction) => {
    const refs = memberIds.map((id) => doc(firestore, "members", id));
    const snapshots = await Promise.all(refs.map((ref) => transaction.get(ref)));
    if (snapshots.some((snapshot) => !snapshot.exists())) {
      throw new Error("La lista de integrantes cambió. Recarga la página e intenta nuevamente.");
    }
    refs.forEach((ref, order) => transaction.update(ref, { order }));
  });
}

export async function deleteCommunityMember(id: string) {
  await runTransaction(firestore, async (transaction) => {
    const testimonial = await transaction.get(doc(firestore, "testimonials", id));
    if (testimonial.exists()) throw new Error("Elimina primero el testimonio de esta integrante.");
    transaction.delete(doc(firestore, "members", id));
  });
}

// One document per member enforces one testimonial per member, including
// concurrent edits. Reassigning deletes the old association atomically.
export async function saveCommunityTestimonial(previousId: string | null, memberId: string, text: string) {
  if (!memberId || !text.trim()) throw new Error("Selecciona una integrante y escribe su testimonio.");
  await runTransaction(firestore, async (transaction) => {
    const ref = doc(firestore, "testimonials", memberId);
    const member = await transaction.get(doc(firestore, "members", memberId));
    const existing = await transaction.get(ref);
    if (!member.exists()) throw new Error("La integrante ya no existe.");
    if (existing.exists() && previousId !== memberId) throw new Error("Esta integrante ya tiene un testimonio.");
    if (previousId && previousId !== memberId) transaction.delete(doc(firestore, "testimonials", previousId));
    transaction.set(ref, { memberId, text: text.trim() });
  });
}

export async function deleteCommunityTestimonial(id: string) {
  await runTransaction(firestore, async (transaction) => {
    transaction.delete(doc(firestore, "testimonials", id));
  });
}
