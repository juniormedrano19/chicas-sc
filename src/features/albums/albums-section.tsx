"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Images, Plus, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollReveal } from "@/components/motion/scroll-reveal";
import type { Album } from "./content";

const INITIAL_COUNT = 3;

export function AlbumsSection({ albums }: { albums: Album[] }) {
  const [expanded, setExpanded] = useState(false);
  const visible = expanded ? albums : albums.slice(0, INITIAL_COUNT);

  return (
    <section id="recuerdos" className="section bg-secondary text-white">
      <div className="wrap">
        <ScrollReveal>
          <div className="mb-10 flex flex-wrap items-end justify-between gap-6 ">
            <div className="text-center lg:text-left  w-full">
              <p className="eyebrow mb-4 text-primary">Momentos que se quedan</p>
              <h2 className="section-title">Nuestros recuerdos<span className="text-accent">.</span></h2>
            </div>

          </div>

          <div id="albums-list" className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {visible.map((album) => (
              <Link key={album.slug} href={`/albumes/${album.slug}`} className="group block min-w-0 rounded-xl border border-white/20 bg-white/5 transition-colors hover:bg-white/10 focus-visible:outline-primary">
                <div className="relative aspect-[4/3] overflow-hidden rounded-t-xl bg-primary/20">
                  <Image src={album.cover} alt="" fill sizes="(min-width: 1320px) 392px, (min-width: 1024px) 31vw, (min-width: 640px) 46vw, 100vw" className="object-cover transition-transform duration-300 motion-safe:group-hover:scale-105" />
                  <span className="absolute bottom-4 left-4 inline-flex items-center gap-2 rounded-full bg-secondary/95 px-3 py-2 text-xs"><Images className="size-4" />{album.photos.length} {album.photos.length === 1 ? "foto" : "fotos"}</span>
                </div>
                <div className="flex items-start justify-between gap-4 p-5 sm:p-6">
                  <div className="min-w-0"><h3 className="font-display text-xl font-semibold uppercase sm:text-2xl">{album.title}</h3><p className="mt-2 text-sm leading-relaxed text-white/70">{album.description}</p><span className="mt-4 inline-block text-sm font-semibold text-primary">Ver álbum</span></div>
                  <ArrowRight className="mt-1 size-5 shrink-0 text-primary" />
                </div>
              </Link>
            ))}
          </div>
          {!albums.length && <p role="status" className="rounded-xl border border-white/20 p-6">Pronto compartiremos nuestros primeros álbumes.</p>}
          {albums.length > INITIAL_COUNT && (
            <div className="mt-9 text-center">
              <Button variant="outline" className="rounded-full border-white/40 bg-transparent px-7 text-white hover:bg-white hover:text-secondary" aria-expanded={expanded} aria-controls="albums-list" onClick={() => setExpanded((value) => !value)}>
                {expanded ? "Ver menos" : "Ver más álbumes"}{expanded ? <Minus /> : <Plus />}
              </Button>
            </div>
          )}
        </ScrollReveal>
      </div>
    </section>
  );
}
