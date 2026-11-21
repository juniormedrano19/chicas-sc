"use client";

import { useRef } from "react";
import Image from "next/image";
import { Dialog } from "radix-ui";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import type { Member } from "../content";

interface MemberPhotoViewerProps {
  members: Member[];
  selectedIndex: number | null;
  onSelect: (index: number | null) => void;
}

export function MemberPhotoViewer({ members, selectedIndex, onSelect }: MemberPhotoViewerProps) {
  const returnFocus = useRef<HTMLElement | null>(null);
  const touchStart = useRef<number | null>(null);
  const member = selectedIndex === null ? undefined : members[selectedIndex];
  const move = (direction: number) => {
    if (selectedIndex === null || members.length < 2) return;
    for (let step = 1; step < members.length; step++) {
      const index = (selectedIndex + direction * step + members.length) % members.length;
      if (members[index]?.image) { onSelect(index); return; }
    }
  };
  const multiple = members.filter((item) => item.image).length > 1;
  const control = "flex size-11 shrink-0 items-center justify-center rounded-full bg-black/50 text-white transition-colors hover:bg-black/75 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white sm:size-12";

  return (
    <Dialog.Root open={!!member?.image} onOpenChange={(open) => { if (!open) onSelect(null); }}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-[100] bg-zinc-900/95 backdrop-blur-xl" />
        <Dialog.Content
          aria-describedby={undefined}
          className="fixed inset-0 z-[101] flex h-[100dvh] w-full flex-col outline-none"
          onOpenAutoFocus={() => { returnFocus.current = document.activeElement as HTMLElement | null; }}
          onCloseAutoFocus={(event) => { event.preventDefault(); returnFocus.current?.focus(); }}
          onKeyDown={(event) => {
            if (event.key === "ArrowLeft") { event.preventDefault(); move(-1); }
            if (event.key === "ArrowRight") { event.preventDefault(); move(1); }
          }}
        >
          <Dialog.Title className="sr-only">Foto de {member?.name}</Dialog.Title>
          <Dialog.Close aria-label="Cerrar visor de fotos" className={`${control} absolute right-3 top-3 z-20 sm:right-5 sm:top-5`}><X className="size-6" /></Dialog.Close>
          <div
            className="relative m-2 mt-16 min-h-0 flex-1 sm:mx-20 sm:mt-3"
            onTouchStart={(event) => { touchStart.current = event.touches[0]?.clientX ?? null; }}
            onTouchEnd={(event) => {
              const end = event.changedTouches[0]?.clientX;
              if (touchStart.current !== null && end !== undefined && Math.abs(end - touchStart.current) > 50) move(end < touchStart.current ? 1 : -1);
              touchStart.current = null;
            }}
          >
            {member?.image && <Image key={member.image} src={member.image} alt={`Foto de ${member.name}`} fill sizes="100vw" className="select-none object-contain" draggable={false} />}
          </div>
          {multiple && <>
            <button type="button" aria-label="Ver foto anterior" onClick={() => move(-1)} className={`${control} absolute left-2 top-1/2 -translate-y-1/2 sm:left-4`}><ChevronLeft className="size-6" /></button>
            <button type="button" aria-label="Ver siguiente foto" onClick={() => move(1)} className={`${control} absolute right-2 top-1/2 -translate-y-1/2 sm:right-4`}><ChevronRight className="size-6" /></button>
          </>}
          <div className="flex shrink-0 justify-center px-4 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
            <div className="flex max-w-full gap-3 overflow-x-auto p-1" aria-label="Miniaturas de fotos">
              {members.map((item, index) => item.image && <button key={`${item.image}-${index}`} type="button" aria-label={`Ver foto de ${item.name}`} aria-current={index === selectedIndex ? "true" : undefined} onClick={() => onSelect(index)} className={`relative size-12 shrink-0 overflow-hidden rounded-lg outline-offset-2 focus-visible:outline-white sm:size-14 ${index === selectedIndex ? "ring-2 ring-white" : "opacity-45 hover:opacity-100"}`}>
                <Image src={item.image} alt={item.name} fill sizes="56px" className="object-cover" />
              </button>)}
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
