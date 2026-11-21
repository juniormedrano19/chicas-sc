"use client";

import { useState } from "react";
import Image from "next/image";
import { MemberPhotoViewer } from "@/features/landing/components/member-photo-viewer";
import type { AlbumPhoto } from "./content";

const layout = ["col-span-2 row-span-2", "row-span-2", "row-span-1", "row-span-1", "col-span-2 row-span-2"];

export function AlbumGallery({ photos }: { photos: AlbumPhoto[] }) {
  const [selected, setSelected] = useState<number | null>(null);
  const images = photos.map((photo, index) => ({
    name: photo.alt || `Foto ${index + 1}`, image: photo.src,
    role: "", quote: "", initials: "", number: "",
  }));
  return <>
    <div className="grid auto-rows-[9rem] grid-cols-2 gap-3 rounded-[1.75rem] sm:auto-rows-[11rem] md:grid-cols-4 md:auto-rows-[10rem] md:gap-4 lg:auto-rows-[12rem]">
      {photos.map((photo, index) => <button key={`${photo.src}-${index}`} type="button" onClick={() => setSelected(index)} aria-label={`Ver ${photo.alt || `foto ${index + 1}`}`} className={`group relative min-h-0 overflow-hidden rounded-2xl bg-muted focus-visible:outline-2 focus-visible:outline-primary ${layout[index % layout.length]}`}>
        <Image src={photo.src} alt={photo.alt} fill sizes="(min-width: 1024px) 34vw, (min-width: 768px) 45vw, 50vw" className="object-cover transition-transform duration-500 group-hover:scale-105" />
      </button>)}
    </div>
    <MemberPhotoViewer members={images} selectedIndex={selected} onSelect={setSelected} />
  </>;
}
