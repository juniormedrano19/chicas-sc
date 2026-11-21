import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Images } from "lucide-react";
import { Brand } from "@/components/brand/brand";
import { Button } from "@/components/ui/button";
import { getStoredAlbum } from "@/features/albums/repository";
import { AlbumGallery } from "@/features/albums/album-gallery";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const album = await getStoredAlbum((await params).slug);
  if (!album) notFound();
  return { title: `${album.title} | Álbumes de Chicas SC`, description: album.description };
}

export default async function AlbumPage({ params }: Props) {
  const album = await getStoredAlbum((await params).slug);
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

        <AlbumGallery photos={album.photos} />
        {!album.photos.length && <p role="status" className="rounded-xl border bg-white p-6">Pronto añadiremos las fotografías de este álbum.</p>}
      </div>
    </main>
  );
}
