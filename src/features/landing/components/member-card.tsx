import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import type { Member } from "../content";

export interface MemberCardProps {
  member: Member;
  index: number;
}

export function MemberCard({ member, index }: MemberCardProps) {
  const isEven = index % 2 === 0;

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
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
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="font-display text-lg sm:text-2xl uppercase">
            {member.name}
          </DialogTitle>
        </DialogHeader>
        {member.image && (
          <div className="relative aspect-[4/3] overflow-hidden rounded-lg bg-muted">
            <Image
              src={member.image}
              alt={`Foto de ${member.name}`}
              fill
              sizes="(min-width: 640px) 512px, calc(100vw - 4rem)"
              className="object-cover"
            />
          </div>
        )}
        <p className="py-5 text-lg">“{member.quote}”</p>
      </DialogContent>
    </Dialog>
  );
}
