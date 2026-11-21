import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Brand } from "@/components/brand/brand";
import { JsonLd } from "@/components/seo/json-ld";
import { AlbumsSection } from "@/features/albums/albums-section";
import { getPublicAlbums } from "@/lib/public-content";
import { absoluteUrl, pageMetadata, site } from "@/lib/seo";

export const dynamic = "force-dynamic";
export const metadata: Metadata = pageMetadata({
  title: "Álbumes y recuerdos de la comunidad | Chicas SC",
  description: "Descubre los álbumes de Chicas SC: nuestras previas, encuentros y recuerdos compartiendo la pasión por Sporting Cristal.",
  path: "/albumes",
});

export default async function AlbumsPage() {
  const albums = await getPublicAlbums();
  return <main className="min-h-dvh bg-secondary text-white">
    <header className="wrap pt-8">
      <div className="mb-10 flex items-center justify-between gap-4"><Brand /><Link href="/" className="inline-flex items-center gap-2 text-sm hover:underline"><ArrowLeft className="size-4" />Volver al inicio</Link></div>
      <h1 className="section-title">Álbumes de Chicas SC</h1>
      <p className="mt-4 max-w-xl text-white/75">Nuestros encuentros y recuerdos compartiendo la pasión celeste.</p>
    </header>
    <JsonLd data={{
      "@context": "https://schema.org", "@type": "CollectionPage", url: absoluteUrl("/albumes"), name: "Álbumes de Chicas SC", inLanguage: site.language,
      mainEntity: { "@type": "ItemList", itemListElement: albums.map((album, index) => ({ "@type": "ListItem", position: index + 1, name: album.title, url: absoluteUrl(`/albumes/${album.slug}`) })) },
    }} />
    <AlbumsSection albums={albums} initialCount={albums.length} />
  </main>;
}
