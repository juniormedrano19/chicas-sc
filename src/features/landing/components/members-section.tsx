"use client";

import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollReveal } from "@/components/motion/scroll-reveal";
import { members } from "../content";
import { useMembersExpand } from "../hooks/use-members-expand";
import { MemberCard } from "./member-card";

export function MembersSection() {
  const { expanded, toggleExpand } = useMembersExpand();
  const visibleMembers = members.slice(0, expanded ? 6 : 4);

  return (
    <section id="nosotras" className="section pt-0 sm:pt-14">
      <div className="wrap">
        <ScrollReveal>
          <div className="mb-12 grid items-end gap-6 md:grid-cols-2">
            <div className="w-full text-center sm:w-auto sm:text-left">
              <p className="eyebrow mb-4">¡Fuerza Cristal!</p>
              <h2 className="section-title">
                Distintas historias.
                <br />
                <span className="text-primary">La misma celeste.</span>
              </h2>
            </div>
            <div className="max-w-md md:ml-auto">
              <p className="leading-relaxed text-muted-foreground text-center lg:text-left">
                En la tribuna encontramos mucho más que fútbol. Encontramos
                amigas, cómplices y una familia que sigue creciendo.
              </p>
            </div>
          </div>

          <div
            id="member-list"
            className="grid grid-cols-1 gap-4 min-[480px]:grid-cols-2 lg:grid-cols-4 lg:gap-5"
          >
            {visibleMembers.map((member, index) => (
              <MemberCard key={member.name} member={member} index={index} />
            ))}
          </div>

          <div className="mt-8 text-center">
            <Button
              variant="outline"
              className="rounded-full border-secondary px-7"
              aria-expanded={expanded}
              aria-controls="member-list"
              onClick={toggleExpand}
            >
              {expanded ? "Ver menos" : "Ver más integrantes"}
              <Plus className="size-4" />
            </Button>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
