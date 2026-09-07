import { AlbumsSection } from "@/features/albums/albums-section";
import { albums } from "@/features/albums/content";
import { Header } from "@/features/landing/header";
import { Hero } from "@/features/landing/hero";
import {
  MembersSection,
  TestimonialsSection,
  SocialSection,
  FAQSection,
  ContactIntro,
  AboutSection,
} from "@/features/landing/community-sections";
import { Footer } from "@/features/landing/footer";
import { MatchesSection } from "@/features/matches/matches-section";
import { matchRepository } from "@/features/matches/repository";
import { ContactForm } from "@/features/contact/contact-form";
import { ScrollReveal } from "@/components/motion/scroll-reveal";
export const dynamic = "force-dynamic";
export default async function Home() {
  const matches = await matchRepository.latest();
  const contactEnabled = Boolean(
    process.env.SUPABASE_URL &&
    process.env.SUPABASE_SERVICE_ROLE_KEY &&
    process.env.CONTACT_ENABLED === "true",
  );
  return (
    <>
      <a
        href="#contenido"
        className="sr-only fixed z-50 bg-white p-4 focus:not-sr-only"
      >
        Saltar al contenido
      </a>
      <Header />
      <main id="contenido">
        <Hero />
        {/* <PassionIntro /> */}
        <AboutSection />
        <MatchesSection {...matches} />
        <MembersSection />
        <TestimonialsSection />
        <AlbumsSection albums={albums} />
        <SocialSection />
        <FAQSection />
        <section id="contacto" className="section bg-muted/60">
          <div className="wrap grid gap-10 lg:grid-cols-2">
            <ScrollReveal direction="left">
              <ContactIntro />
            </ScrollReveal>
            <ScrollReveal direction="right">
              <ContactForm enabled={contactEnabled} />
            </ScrollReveal>
          </div>
        </section>
      </main>
      <div className="h-[400px] w-full bg-[url('/images/history.jpg')] bg-cover">
      </div>
      <Footer />
    </>
  );
}
