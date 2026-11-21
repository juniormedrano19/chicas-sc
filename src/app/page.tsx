import Link from "next/link";
import { AlbumsSection } from "@/features/albums/albums-section";
import { getPublicAlbums, getPublicCommunity, getPublicMatches } from "@/lib/public-content";
import { JsonLd } from "@/components/seo/json-ld";
import { absoluteUrl, site } from "@/lib/seo";
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
  const [albums, community, matches] = await Promise.all([
    getPublicAlbums().catch((error) => { console.error("No se pudieron cargar los álbumes:", error); return []; }),
    getPublicCommunity().catch((error) => { console.error("No se pudo cargar la comunidad:", error); return { members: [], testimonials: [] }; }),
    getPublicMatches(),
  ]);
  const contactEnabled = process.env.CONTACT_ENABLED !== "false";

  return (
    <>
      <JsonLd data={{
        "@context": "https://schema.org",
        "@graph": [
          { "@type": "Organization", "@id": absoluteUrl("/#organization"), name: site.name, alternateName: site.alternateNames, url: site.url, description: "Comunidad independiente de mujeres hinchas de Sporting Cristal.", logo: cloudinaryAsset("/images/chicas-sc-logo-transparent.png"), sameAs: site.socials },
          { "@type": "WebSite", "@id": absoluteUrl("/#website"), url: site.url, name: site.name, alternateName: site.alternateNames, inLanguage: site.language, publisher: { "@id": absoluteUrl("/#organization") } },
          { "@type": "WebPage", "@id": absoluteUrl("/#webpage"), url: site.url, name: site.title, description: site.description, inLanguage: site.language, isPartOf: { "@id": absoluteUrl("/#website") } },
        ],
      }} />
      <Link
        href="#contenido"
        className="sr-only fixed z-50 bg-white p-4 focus:not-sr-only"
      >
        Saltar al contenido
      </Link>
      <Header />
      <main id="contenido">
        <h1 className="sr-only">Chicas SC: comunidad de mujeres hinchas de Sporting Cristal</h1>
        <Hero />
        <ChicasSCBanner />
        <AboutSection />
        <MatchesSection result={matches} />
        <MembersSection members={community.members} />
        <TestimonialsSection testimonials={community.testimonials} />
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
