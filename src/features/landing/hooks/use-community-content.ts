"use client";

import { useEffect, useState } from "react";
import { getCommunityContent } from "@/features/admin/community-repository";
import type { Member, Testimonial } from "../content";

export function useCommunityContent() {
  const [members, setMembers] = useState<Member[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  useEffect(() => {
    let active = true;
    getCommunityContent().then((data) => {
      if (!active) return;
      setMembers(data.members.map((member) => ({
        name: member.name, image: member.imageUrl, role: "Integrante",
        initials: "", number: "", quote: data.testimonials.find((item) => item.memberId === member.id)?.text ?? "",
      })));
      setTestimonials(data.testimonials.flatMap((item) => {
        const member = data.members.find((member) => member.id === item.memberId);
        return member ? [{ name: member.name, image: member.imageUrl, text: item.text, tag: "Chica SC" }] : [];
      }));
    }).catch((error) => console.error("No se pudo cargar la comunidad:", error));
    return () => { active = false; };
  }, []);
  return { members, testimonials };
}
