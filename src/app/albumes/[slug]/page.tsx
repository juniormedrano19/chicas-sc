import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Images } from "lucide-react";
import { Brand } from "@/components/brand/brand";
import { Button } from "@/components/ui/button";
import { albums, getAlbum } from "@/features/albums/content";

type Props = { params: Promise<{ slug: string }> };

const bentoLayout = [
  "col-span-2 row-span-2",
  "row-span-2",
  "row-span-1",
  "row-span-1",
  "col-span-2 row-span-2",
];

export function generateStaticParams() {
  return albums.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const album = getAlbum((await params).slug);
  if (!album) notFound();
  return { title: `${album.title} | Álbumes de Chicas SC`, description: album.description };
}

export default async function AlbumPage({ params }: Props) {
  const album = getAlbum((await params).slug);
  if (!album) notFound();

  return (
    <main className="min-h-dvh bg-muted/50 pb-16">
      <header className="bg-primary py-8 text-white sm:py-12">
        <div className="wrap">
          <div className="mb-10 flex flex-wrap items-center justify-between gap-5">
            <Brand />
            <Button asChild variant="outline" className=" rounded-full border-white/40 bg-transparent text-white hover:bg-white hover:text-secondary"><Link href="/#recuerdos"><ArrowLeft />Volver a los álbumes</Link></Button>
          </div>

          <h1 className="section-title max-w-4xl">{album.title}</h1>
          <p className="mt-5 max-w-xl leading-relaxed text-white/80">{album.description}</p>
          <p className="mt-6 flex items-center gap-2 text-sm text-primary"><Images className="size-4" />{album.photos.length} {album.photos.length === 1 ? "foto" : "fotos"}</p>
        </div>
      </header>
      <div className="wrap pt-8 sm:pt-12">

        <div className="grid auto-rows-[9rem] grid-cols-2 gap-3 rounded-[1.75rem]  sm:auto-rows-[11rem] md:grid-cols-4 md:auto-rows-[10rem] md:gap-4 lg:auto-rows-[12rem]">
          {album.photos.map((photo, index) => (
            <figure
              key={`${photo.src}-${index}`}
              className={`group relative min-h-0 overflow-hidden rounded-2xl bg-muted ${bentoLayout[index % bentoLayout.length]}`}
            >
              <Image
                src={photo.src}
                alt={photo.alt}
                fill
                sizes="(min-width: 1024px) 34vw, (min-width: 768px) 45vw, 50vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </figure>
          ))}
        </div>
        {!album.photos.length && <p role="status" className="rounded-xl border bg-white p-6">Pronto añadiremos las fotografías de este álbum.</p>}
      </div>
    </main>
  );
}
