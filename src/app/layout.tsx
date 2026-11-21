import type { Metadata } from "next";
import { Bai_Jamjuree } from "next/font/google";
import { Toaster } from "sonner";
import { PageLoader } from "@/components/page-loader";
import { isIndexable, pageMetadata, site } from "@/lib/seo";
import "./globals.css";

const baiJamjuree = Bai_Jamjuree({
  variable: "--font-bai-jamjuree",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
});

export const metadata: Metadata = {
  ...pageMetadata({ title: site.title, description: site.description, path: "/" }),
  metadataBase: new URL(site.url),
  applicationName: site.name,
  title: { default: site.title, template: "%s | Chicas SC" },
  category: "sports",
  robots: { index: isIndexable, follow: isIndexable, googleBot: { index: isIndexable, follow: isIndexable, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 } },
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION || undefined,
    other: process.env.BING_SITE_VERIFICATION ? { "msvalidate.01": process.env.BING_SITE_VERIFICATION } : undefined,
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang={site.language} className={baiJamjuree.variable}>
      <body className="font-sans antialiased">
        <PageLoader />
        {children}
        <Toaster richColors position="top-right" duration={4000} closeButton />
      </body>
    </html>
  );
}
