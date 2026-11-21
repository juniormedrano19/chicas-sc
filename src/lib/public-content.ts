import "server-only";
import { cache } from "react";
import { getCommunityContent } from "@/features/admin/community-repository";
import { getStoredAlbum, getStoredAlbums } from "@/features/albums/repository";
import { matchRepository } from "@/features/matches/repository";
import type { Member, Testimonial } from "@/features/landing/content";

export const getPublicAlbums = cache(getStoredAlbums);
export const getPublicAlbum = cache(getStoredAlbum);
export const getPublicMatches = cache(() => matchRepository.latest());
export const getPublicCommunity = cache(async () => {
  const data = await getCommunityContent();
  // Only send public presentation fields to client components.
  const members: Member[] = data.members.map((member) => ({
    name: member.name, image: member.imageUrl, role: "Integrante", initials: "", number: "",
    quote: data.testimonials.find((item) => item.memberId === member.id)?.text ?? "",
  }));
  const testimonials: Testimonial[] = data.testimonials.flatMap((item) => {
    const member = data.members.find((member) => member.id === item.memberId);
    return member ? [{ name: member.name, image: member.imageUrl, text: item.text, tag: "Chica SC" }] : [];
  });
  return { members, testimonials };
});
