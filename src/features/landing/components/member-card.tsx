"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { MemberPhotoViewer } from "./member-photo-viewer";
import type { Member } from "../content";

export interface MemberCardProps {
  member: Member;
  index: number;
  onView?: () => void;
}

export function MemberCard({ member, index, onView }: MemberCardProps) {
  const [open, setOpen] = useState(false);
  const isEven = index % 2 === 0;

  return (
    <>
        <Button
          type="button"
          aria-label={`Ver foto de ${member.name}`}
          onClick={() => { if (member.image) { if (onView) onView(); else setOpen(true); } }}
          variant="ghost"
          className={`group relative h-auto min-w-0 overflow-hidden rounded-none p-0 text-left whitespace-normal ${
            member.image
              ? "bg-secondary text-white hover:text-white"
              : isEven
                ? "bg-primary/25 hover:bg-primary/35"
                : "bg-secondary text-white hover:bg-secondary/95 hover:text-white"
          }`}
        >
          {member.image && (
            <Image
              src={member.image}
              alt=""
              fill
              sizes="(min-width: 1280px) 300px, (min-width: 1024px) 23vw, (min-width: 480px) 46vw, 100vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          )}
          <div className="relative z-10 flex aspect-[.9] w-full justify-between gap-6 p-5 sm:aspect-[.85] xl:aspect-[.74] xl:p-7">
            <span className="flex h-fit w-fit self-end items-end justify-between gap-2 rounded-lg bg-black/10 px-3 py-2 text-white backdrop-blur-md">
              <span className="block font-display text-xl font-semibold uppercase sm:text-2xl lg:text-xl">
                {member.name}
              </span>
            </span>
          </div>
        </Button>
      {!onView && <MemberPhotoViewer members={[member]} selectedIndex={open ? 0 : null} onSelect={(index) => setOpen(index !== null)} />}
    </>
  );
}
