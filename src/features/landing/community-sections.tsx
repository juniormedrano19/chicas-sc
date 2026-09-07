"use client";
import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";
import Script from "next/script";
import Image from "next/image";
import {
  ArrowRight,
  ArrowUpRight,
  Plus,
  Heart,
  Camera,
  ChevronLeft,
  ChevronRight,
  Users,
  Music2,
  Quote,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollReveal } from "@/components/motion/scroll-reveal";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { members, testimonials, faqs } from "./content";

export function AboutSection() {
  return (
    <section id="quienes-somos" className="section overflow-hidden bg-muted">
      <div className="wrap grid items-center gap-10 lg:grid-cols-[minmax(0,.8fr)_minmax(0,1.2fr)] lg:gap-20">
        <ScrollReveal direction="left">
          <div className="relative mx-auto flex aspect-square w-full max-w-[460px] items-center justify-center overflow-hidden rounded-full border-[14px] border-white bg-primary p-12 sm:border-[20px] sm:p-20">
            <span className="absolute inset-6 rounded-full border border-secondary/20 sm:inset-9" />
            <span className="absolute -left-7 top-1/2 size-24 -translate-y-1/2 rounded-full bg-accent sm:size-32" />
            <span className="absolute -right-6 top-10 size-16 rounded-full bg-white/55 sm:size-24" />
            <Image
              src="/images/chicas-sc-logo-transparent.png"
              alt="Logo de Chicas SC"
              width={1080}
              height={1080}
              sizes="(min-width: 1024px) 360px, 75vw"
              className="relative z-10 h-auto w-full object-contain"
            />
          </div>
        </ScrollReveal>

        <ScrollReveal direction="right">

          <h2 className="section-title">
            ¿Quiénes
            <br />
            somos<span className="text-primary">?</span>
          </h2>
          <p className="mt-7 max-w-2xl text-lg leading-relaxed text-muted-foreground">
            Somos Chicas SC, una comunidad de mujeres hinchas que vive y comparte la
            pasión por el único y el más grande; &ldquo;Sporting Cristal&rdquo;. Nos encontramos para alentar, crear
            recuerdos y hacer que cada partido se sienta como casa.
          </p>
          <div className="mt-9 grid gap-4 sm:grid-cols-3">
            {[
              ["Alentamos", "Con la celeste siempre en el corazón."],
              ["Compartimos", "Amistad, previas y momentos inolvidables."],
              ["Crecemos", "Con un espacio abierto para más chicas celestes."],
            ].map(([title, copy], index) => (
              <div key={title} className="border-t-2 border-secondary pt-4">
                <span className="font-display text-2xl font-semibold text-primary">
                  0{index + 1}
                </span>
                <h3 className="mt-2 font-semibold">{title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                  {copy}
                </p>
              </div>
            ))}
          </div>
          <Button asChild variant="outline" className="mt-9 rounded-full border-secondary px-7">
            <a href="#contacto">
              Súmate a la comunidad <ArrowRight />
            </a>
          </Button>
        </ScrollReveal>
      </div>
    </section>
  );
}

export function MembersSection() {
  const [expanded, setExpanded] = useState(false);
  return (
    <section id="nosotras" className="section">
      <div className="wrap">
        <ScrollReveal>
          <div className="mb-12 grid items-end gap-6 md:grid-cols-2">
            <div>
              <p className="eyebrow mb-4">¡Fuerza Cristal!</p>
              <h2 className="section-title">
                Distintas historias.
                <br />
                <span className="text-primary">La misma celeste.</span>
              </h2>
            </div>
            <div className="max-w-md md:ml-auto">
              <p className="leading-relaxed text-muted-foreground">
                En la tribuna encontramos mucho más que fútbol. Encontramos
                amigas, cómplices y una familia que sigue creciendo.
              </p>

            </div>
          </div>
          <div
            id="member-list"
            className="grid grid-cols-1 gap-4 min-[480px]:grid-cols-2 lg:grid-cols-4 lg:gap-5"
          >
            {members.slice(0, expanded ? 6 : 4).map((m, i) => (
              <Dialog key={m.name}>
                <DialogTrigger asChild>
                  <Button
                    variant="ghost"
                    className={`group relative h-auto min-w-0 overflow-hidden rounded-none p-0 text-left whitespace-normal ${m.image ? "bg-secondary text-white hover:text-white" : i % 2 === 0 ? "bg-primary/25 hover:bg-primary/35" : "bg-secondary text-white hover:bg-secondary/95 hover:text-white"}`}
                  >
                    {m.image && (
                      <>
                        <Image
                          src={m.image}
                          alt=""
                          fill
                          sizes="(min-width: 1280px) 300px, (min-width: 1024px) 23vw, (min-width: 480px) 46vw, 100vw"
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />

                      </>
                    )}
                    <div className="relative z-10 flex aspect-[.9] w-full  justify-between gap-6 p-5 sm:aspect-[.85] xl:aspect-[.74] xl:p-7">


                      <span className="flex items-end justify-between gap-2">
                        <span>
                          <span className="block font-display text-xl font-semibold uppercase sm:text-2xl lg:text-xl xl:text-2xl">
                            {m.name}
                          </span>

                        </span>

                      </span>
                    </div>
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle className="font-display text-4xl uppercase">
                      {m.name}
                    </DialogTitle>
                    <DialogDescription>
                      {m.role} · Perfil de muestra
                    </DialogDescription>
                  </DialogHeader>
                  {m.image && (
                    <div className="relative aspect-[4/3] overflow-hidden rounded-lg bg-muted">
                      <Image
                        src={m.image}
                        alt={`Foto de ${m.name}`}
                        fill
                        sizes="(min-width: 640px) 512px, calc(100vw - 4rem)"
                        className="object-cover"
                      />
                    </div>
                  )}
                  <p className="py-5 text-xl">“{m.quote}”</p>
                  <p className="text-sm text-muted-foreground">
                    Este perfil es ilustrativo. El nombre, la historia y la
                    fotografía se reemplazarán con información autorizada de la
                    integrante.
                  </p>
                </DialogContent>
              </Dialog>
            ))}
          </div>
          <div className="mt-8 text-center">
            <Button
              variant="outline"
              className="rounded-full border-secondary px-7"
              aria-expanded={expanded}
              aria-controls="member-list"
              onClick={() => setExpanded(!expanded)}
            >
              {expanded ? "Ver menos" : "Ver más integrantes"}
              <Plus className="size-4" />
            </Button>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
export function TestimonialsSection() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const trackRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  const scrollToIndex = (index: number, behavior: ScrollBehavior) => {
    const track = trackRef.current;
    const card = track?.children[index] as HTMLElement | undefined;
    if (!track || !card) return;

    // scrollIntoView can also move the page vertically. The carousel should
    // only ever control its own horizontal scroll position.
    track.scrollTo({
      left: card.offsetLeft - track.offsetLeft,
      behavior,
    });
  };

  const moveTo = (index: number) => {
    const nextIndex = (index + testimonials.length) % testimonials.length;
    setCurrentIndex(nextIndex);
    scrollToIndex(nextIndex, prefersReducedMotion ? "auto" : "smooth");
  };

  useEffect(() => {
    if (prefersReducedMotion) return;

    const interval = window.setInterval(() => {
      setCurrentIndex((index) => {
        const nextIndex = (index + 1) % testimonials.length;
        scrollToIndex(nextIndex, "smooth");
        return nextIndex;
      });
    }, 5500);

    return () => window.clearInterval(interval);
  }, [prefersReducedMotion]);

  return (
    <section id="testimonios" className="section bg-muted">
      <div className="wrap">
        <ScrollReveal>
          <div className="mb-10 flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="eyebrow mb-4">Voces de nuestra comunidad</p>
              <h2 className="section-title">Se siente. Se comparte.</h2>

            </div>
            <div className="hidden items-center gap-3 sm:flex">
              <Button
                type="button"
                variant="outline"
                size="icon"
                aria-label="Ver testimonio anterior"
                onClick={() => moveTo(currentIndex - 1)}
                className="size-11 rounded-full border-secondary bg-white hover:bg-primary"
              >
                <ChevronLeft className="size-5" />
              </Button>
              <Button
                type="button"
                variant="outline"
                size="icon"
                aria-label="Ver siguiente testimonio"
                onClick={() => moveTo(currentIndex + 1)}
                className="size-11 rounded-full border-secondary bg-white hover:bg-primary"
              >
                <ChevronRight className="size-5" />
              </Button>
            </div>
          </div>
          <div
            ref={trackRef}
            role="region"
            aria-label="Carrusel de testimonios"
            className="-mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8 xl:-mx-12 xl:px-12"
          >
            {testimonials.map((t, i) => (
              <article
                key={t.name}
                aria-current={i === currentIndex ? "true" : undefined}
                className={`flex min-w-[calc(100%-1rem)] snap-start flex-col border-t-2 border-secondary bg-white p-6 transition-all duration-500 sm:min-w-[calc(72%-1rem)] lg:min-w-[calc(52%-1rem)] xl:min-w-[calc(43%-1rem)] xl:p-9 ${i === currentIndex
                  ? "scale-100 opacity-100 shadow-lg"
                  : "scale-[0.96] opacity-55"
                  }`}
              >
                <Quote className="mb-7 size-8 fill-primary text-primary" />
                <p className="text-xl font-semibold leading-snug">“{t.text}”</p>
                <div className="mt-9 flex items-center gap-3">
                  {t.image ? (
                    <Image
                      src={t.image}
                      alt={`Foto de ${t.name}`}
                      width={44}
                      height={44}
                      sizes="44px"
                      className="size-11 shrink-0 rounded-full object-cover"
                    />
                  ) : (
                    <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-primary/30 font-display text-xl font-semibold">
                      0{i + 1}
                    </span>
                  )}
                  <div>
                    <p className="font-semibold">{t.name}</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {t.tag}
                    </p>
                  </div>
                </div>
              </article>
            ))}
          </div>
          <div className="mt-4 flex items-center justify-between gap-4 sm:hidden">
            <Button
              type="button"
              variant="outline"
              aria-label="Ver testimonio anterior"
              onClick={() => moveTo(currentIndex - 1)}
              className="rounded-full border-secondary bg-white px-5 hover:bg-primary"
            >
              <ChevronLeft /> Anterior
            </Button>
            <Button
              type="button"
              variant="outline"
              aria-label="Ver siguiente testimonio"
              onClick={() => moveTo(currentIndex + 1)}
              className="rounded-full border-secondary bg-white px-5 hover:bg-primary"
            >
              Siguiente <ChevronRight />
            </Button>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
export function SocialSection() {
  return (
    <section id="redes" className="section">
      <div className="wrap">
        <ScrollReveal>
          <div className="mb-10 grid gap-6 md:grid-cols-2">
            <div>
              <p className="eyebrow mb-4">Soy celeste, soy celeste…</p>
              <h2 className="section-title">Nos vemos en redes.</h2>
            </div>
            <p className="max-w-sm self-end text-muted-foreground md:ml-auto">
              Previas, goles y momentos entre amigas. Pronto compartiremos aquí
              las cuentas oficiales del grupo.
            </p>
          </div>




          <div className="grid gap-5 md:grid-cols-3">
            {[
              "7682299821155388693",
              "7679909809755327765",
              "7676574849879248149",
            ].map((videoId, index) => (
              <div
                key={videoId}
                className="mx-auto w-full max-w-[360px] overflow-hidden rounded-xl bg-black"
              >
                <iframe
                  src={`https://www.tiktok.com/player/v1/${videoId}?music_info=0&description=0`}
                  title={`Video ${index + 1} de Chicas SC en TikTok`}
                  className="aspect-[9/16] w-full border-0"
                  loading="lazy"
                  allow="fullscreen"
                  allowFullScreen
                  referrerPolicy="strict-origin-when-cross-origin"
                />
              </div>
            ))}
          </div>


          <Script src="https://www.tiktok.com/embed.js" strategy="afterInteractive" />
        </ScrollReveal>
      </div>
    </section>
  );
}
export function FAQSection() {
  return (
    <section id="faq" className="section border-t">
      <div className="wrap grid gap-10 lg:grid-cols-[.85fr_1.15fr]">
        <ScrollReveal direction="left">
          <div>
            <p className="eyebrow mb-4">Resolvemos tus dudas</p>
            <h2 className="section-title">
              Antes del
              <br />
              primer aliento.
            </h2>
            <p className="mt-6 text-muted-foreground">¿Tienes otra pregunta?</p>
            <a
              href="#contacto"
              className="pill-link mt-3 underline underline-offset-4"
            >
              Conversemos <ArrowRight className="size-4" />
            </a>
          </div>
        </ScrollReveal>
        <ScrollReveal direction="right">
          <Accordion type="single" collapsible defaultValue="faq-0">
            {faqs.map((f, i) => (
              <AccordionItem value={`faq-${i}`} key={f.q}>
                <AccordionTrigger className="py-6 text-left text-base font-semibold">
                  {f.q}
                </AccordionTrigger>
                <AccordionContent className="text-base leading-relaxed text-muted-foreground">
                  {f.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </ScrollReveal>
      </div>
    </section>
  );
}
export function ContactIntro() {
  return (
    <div className="relative flex h-full flex-col justify-between overflow-hidden rounded-2xl bg-primary p-6 sm:p-8 xl:p-12 text-white">
      <div>
        <p className="eyebrow mb-6">Con mi Cristal seguiremos adelante</p>
        <h2 className="section-title">
          La próxima
          <br />
          historia,
          <br />
          es contigo<span className="text-white">.</span>
        </h2>
        <p className="mt-7 max-w-xs leading-relaxed">
          Para sumarte, colaborar o simplemente decir hola. Nos encantará
          conocerte.
        </p>
      </div>
      <div className="mt-12 flex items-end justify-between gap-2">
        <span className="text-sm font-medium">
          Porque podemos.
          <br />
          Con gran confianza.
        </span>

      </div>
    </div>
  );
}
