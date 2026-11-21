import type { Metadata } from "next";

export const site = {
  name: "Chicas SC",
  title: "Chicas SC | Comunidad de hinchas de Sporting Cristal",
  description: "Somos Chicas SC, una comunidad de mujeres hinchas de Sporting Cristal. Compartimos la pasión celeste, encuentros, partidos y recuerdos en la tribuna.",
  url: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://chicassc.com").origin,
  locale: "es_PE",
  language: "es-PE",
  socials: [
    "https://www.instagram.com/chicassc_oficial/",
    "https://www.tiktok.com/@chicassc",
    "https://www.facebook.com/profile.php?id=61591538154552",
  ],
};

export const isIndexable = process.env.VERCEL_ENV !== "preview";
export function absoluteUrl(path: string) { return new URL(path, `${site.url}/`).href; }

export function pageMetadata({ title, description, path, image = "/opengraph-image" }: {
  title: string;
  description: string;
  path: string;
  image?: string;
}): Metadata {
  const url = absoluteUrl(path);
  return {
    title: { absolute: title }, description,
    alternates: { canonical: url },
    openGraph: {
      type: "website", siteName: site.name, locale: site.locale,
      title, description, url, images: [{ url: absoluteUrl(image), alt: title }],
    },
    twitter: { card: "summary_large_image", title, description, images: [absoluteUrl(image)] },
  };
}

export function serializeJsonLd(data: unknown) {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
