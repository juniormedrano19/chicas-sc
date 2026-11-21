import type { MetadataRoute } from "next";
import { getPublicAlbums } from "@/lib/public-content";
import { absoluteUrl, isIndexable } from "@/lib/seo";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  if (!isIndexable) return [];
  // Let failures return an error rather than caching a truncated sitemap.
  const albums = await getPublicAlbums();
  return [
    { url: absoluteUrl("/"), changeFrequency: "weekly", priority: 1 },
    { url: absoluteUrl("/albumes"), changeFrequency: "weekly", priority: 0.8 },
    ...albums.map((album) => ({
      url: absoluteUrl(`/albumes/${album.slug}`),
      ...(album.updatedAt ? { lastModified: album.updatedAt } : {}),
      images: [...new Set(album.photos.map((photo) => photo.src))],
    })),
  ];
}
