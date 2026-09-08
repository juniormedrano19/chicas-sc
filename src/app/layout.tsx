import type { Metadata } from "next";
import { Bai_Jamjuree, Sacramento } from "next/font/google";
import { Toaster } from "sonner";
import { PageLoader } from "@/components/page-loader";
import "./globals.css";
const baiJamjuree = Bai_Jamjuree({
  variable: "--font-bai-jamjuree",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
});
const sacramento = Sacramento({
  variable: "--font-sacramento",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});
export const metadata: Metadata = {
  title: "Chicas SC | Una pasión que nos une",
  description:
    "Una comunidad de chicas, una misma pasión celeste. Conoce a Chicas SC, nuestros encuentros y los recuerdos que compartimos.",
};
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es" className={`${baiJamjuree.variable} ${sacramento.variable}`}>
      <body className="font-sans antialiased">
        <PageLoader />
        {children}
        <Toaster richColors position="bottom-right" />
      </body>
    </html>
  );
}
