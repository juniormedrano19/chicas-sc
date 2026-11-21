import Link from "next/link";
import { AlbumsSection } from "@/features/albums/albums-section";
import { getStoredAlbums } from "@/features/albums/repository";
import {
  Header,
  Hero,
  ChicasSCBanner,
  AboutSection,
  MembersSection,
  TestimonialsSection,
  SocialSection,
  FAQSection,
  ContactIntro,
  Footer,
} from "@/features/landing";
import { MatchesSection } from "@/features/matches/matches-section";
import { ContactForm } from "@/features/contact/contact-form";
import { ScrollReveal } from "@/components/motion/scroll-reveal";
import { cloudinaryAsset } from "@/lib/cloudinary-assets";

export const dynamic = "force-dynamic";

export default async function Home() {
  const albums = await getStoredAlbums().catch((error) => {
    console.error("No se pudieron cargar los álbumes:", error);
    return [];
  });
  const contactEnabled = process.env.CONTACT_ENABLED !== "false";

  return (
    <>
      <Link
        href="#contenido"
        className="sr-only fixed z-50 bg-white p-4 focus:not-sr-only"
      >
        Saltar al contenido
      </Link>
      <Header />
      <main id="contenido">
        <Hero />
        <ChicasSCBanner />
        <AboutSection />
        <MatchesSection />
        <MembersSection />
        <TestimonialsSection />
        <AlbumsSection albums={albums} />
        <SocialSection />
        <FAQSection />
        <section id="contacto" className="section overflow-x-clip bg-muted/60">
          <div className="wrap grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
            <ScrollReveal direction="left" className="h-full">
              <ContactIntro />
            </ScrollReveal>
            <ScrollReveal direction="right">
              <ContactForm enabled={contactEnabled} />
            </ScrollReveal>
          </div>
        </section>
      </main>
      <div
        className="aspect-[21/5] w-full bg-muted bg-contain bg-center bg-no-repeat sm:h-[400px] sm:aspect-auto sm:bg-cover"
        style={{ backgroundImage: `url(${cloudinaryAsset("/images/history.jpg")})` }}
      />
      <Footer />
    </>
  );
}
