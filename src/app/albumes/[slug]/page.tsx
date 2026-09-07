import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Images } from "lucide-react";
import { Brand } from "@/components/brand/brand";
import { Button } from "@/components/ui/button";
import { albums, getAlbum } from "@/features/albums/content";

type Props = { params: Promise<{ slug: string }> };

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
      <header className="bg-secondary py-8 text-white sm:py-12">
        <div className="wrap">
          <div className="mb-10 flex flex-wrap items-center justify-between gap-5">
          <Brand />
          <Button asChild variant="outline" className=" rounded-full border-white/40 bg-transparent text-white hover:bg-white hover:text-secondary"><Link href="/#recuerdos"><ArrowLeft />Volver a los álbumes</Link></Button>
          </div>
          <p className="eyebrow mb-4 text-primary">Chicas SC · Nuestros recuerdos</p>
          <h1 className="section-title max-w-4xl">{album.title}</h1>
          <p className="mt-5 max-w-xl leading-relaxed text-white/80">{album.description}</p>
          <p className="mt-6 flex items-center gap-2 text-sm text-primary"><Images className="size-4" />{album.photos.length} {album.photos.length === 1 ? "foto" : "fotos"}</p>
        </div>
      </header>
      <div className="wrap pt-8 sm:pt-12">
        {album.isExample && <p className="mb-8 rounded-lg border bg-white p-4 text-sm text-muted-foreground">Álbum de muestra. Estas imágenes son referencias del Club Sporting Cristal y no documentan un encuentro del grupo.</p>}
        <div className="grid items-start gap-6 md:grid-cols-2">
          {album.photos.map((photo, index) => (
            <figure key={`${photo.src}-${index}`} className="overflow-hidden rounded-xl border bg-white">
              <Image src={photo.src} alt={photo.alt} width={photo.width} height={photo.height} sizes="(min-width: 1320px) 600px, (min-width: 768px) 46vw, 100vw" className="h-auto w-full" />
              <figcaption className="p-4 text-sm text-muted-foreground">{photo.caption}</figcaption>
            </figure>
          ))}
        </div>
        {!album.photos.length && <p role="status" className="rounded-xl border bg-white p-6">Pronto añadiremos las fotografías de este álbum.</p>}
      </div>
    </main>
  );
}
