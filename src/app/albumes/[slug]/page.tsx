import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Images } from "lucide-react";
import { Brand } from "@/components/brand/brand";
import { Button } from "@/components/ui/button";
import { getPublicAlbum } from "@/lib/public-content";
import { AlbumGallery } from "@/features/albums/album-gallery";
import { JsonLd } from "@/components/seo/json-ld";
import { absoluteUrl, pageMetadata, site } from "@/lib/seo";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const album = await getPublicAlbum((await params).slug);
  if (!album) notFound();
  return pageMetadata({ title: `${album.title} | Álbumes de Chicas SC`, description: album.description, path: `/albumes/${album.slug}`, image: album.cover || "/opengraph-image" });
}

export default async function AlbumPage({ params }: Props) {
  const album = await getPublicAlbum((await params).slug);
  if (!album) notFound();

  return (
    <main className="min-h-dvh bg-muted/50 pb-16">
      <JsonLd data={{
        "@context": "https://schema.org",
        "@graph": [
          { "@type": "ImageGallery", url: absoluteUrl(`/albumes/${album.slug}`), name: album.title, description: album.description, inLanguage: site.language,
            ...(album.updatedAt ? { dateModified: album.updatedAt } : {}),
            image: album.photos.map((photo) => ({ "@type": "ImageObject", contentUrl: photo.src, name: photo.alt || album.title, width: photo.width, height: photo.height })),
          },
          { "@type": "BreadcrumbList", itemListElement: [
            { "@type": "ListItem", position: 1, name: "Inicio", item: site.url },
            { "@type": "ListItem", position: 2, name: "Álbumes", item: absoluteUrl("/albumes") },
            { "@type": "ListItem", position: 3, name: album.title, item: absoluteUrl(`/albumes/${album.slug}`) },
          ] },
        ],
      }} />
      <header className="bg-primary py-8 text-white sm:py-12">
        <div className="wrap">
          <div className="mb-10 flex flex-wrap items-center justify-between gap-5">
            <Brand />
            <Button asChild variant="outline" className=" rounded-full border-white/40 bg-transparent text-white hover:bg-white hover:text-secondary"><Link href="/albumes"><ArrowLeft />Volver a los álbumes</Link></Button>
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
