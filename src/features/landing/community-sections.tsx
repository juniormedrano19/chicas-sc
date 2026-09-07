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
          <p className="eyebrow mb-4">Una comunidad, un mismo corazón</p>
          <h2 className="section-title">
            ¿Quiénes
            <br />
            somos<span className="text-primary">?</span>
          </h2>
          <p className="mt-7 max-w-2xl text-lg leading-relaxed text-muted-foreground">
            Somos Chicas SC, una comunidad de hinchas que vive y comparte la
            pasión por Sporting Cristal. Nos encontramos para alentar, crear
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
                <span className="text-[#278ac8]">La misma celeste.</span>
              </h2>
            </div>
            <div className="max-w-md md:ml-auto">
              <p className="leading-relaxed text-muted-foreground">
                En la tribuna encontramos mucho más que fútbol. Encontramos
                amigas, cómplices y una familia que sigue creciendo.
              </p>
              <p className="mt-3 text-xs text-muted-foreground">
                Perfiles de muestra · pronto conocerás a las integrantes.
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
                    className={`group relative h-auto min-w-0 overflow-hidden rounded-none p-0 text-left whitespace-normal ${i % 2 === 0 ? "bg-primary/25 hover:bg-primary/35" : "bg-secondary text-white hover:bg-secondary/95 hover:text-white"}`}
                  >
                    <div className="flex aspect-[.9] w-full flex-col justify-between gap-6 p-5 sm:aspect-[.85] xl:aspect-[.74] xl:p-7">
                      <span className="flex flex-wrap justify-between gap-2 text-xs tracking-widest">
                        <span>CHICAS SC</span>
                        <span>/{m.number}</span>
                      </span>
                      <span
                        className={`font-display text-[clamp(3rem,7vw,7rem)] font-bold italic leading-none transition-transform group-hover:scale-105 ${i % 2 === 0 ? "text-secondary/20" : "text-primary/35"}`}
                      >
                        {m.initials}
                        <span className="text-accent">.</span>
                      </span>
                      <span className="flex items-end justify-between gap-2">
                        <span>
                          <span className="block font-display text-xl font-semibold uppercase sm:text-2xl lg:text-xl xl:text-2xl">
                            {m.name}
                          </span>
                          <span className="mt-2 block text-xs font-normal opacity-75">
                            {m.role}
                          </span>
                        </span>
                        <Plus className="size-5 shrink-0" />
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
              <p className="mt-4 text-xs text-muted-foreground">
                Testimonios ilustrativos, pendientes de reemplazar por
                experiencias reales.
              </p>
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
                  <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-primary/30 font-display text-xl font-semibold">
                    0{i + 1}
                  </span>
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
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                name: "Instagram",
                icon: Camera,
                copy: "Nuestra vida en celeste",
                bg: "bg-primary",
                href: "https://www.instagram.com/p/DbD51RVR1lb/",
                cta: "Ver publicación",
              },
              {
                name: "TikTok",
                icon: Music2,
                copy: "El lado más espontáneo",
                bg: "bg-secondary text-white",
                href: "https://www.tiktok.com/@chicassc",
                cta: "@chicassc",
              },
              {
                name: "Facebook",
                icon: Users,
                copy: "Un lugar para encontrarnos",
                bg: "bg-muted",
                href: undefined,
                cta: undefined,
              },
            ].map((s) => {
              const content = (
                <>
                  <s.icon className="mb-10 size-8" />
                  <h3 className="font-display text-3xl font-semibold uppercase">
                    {s.name}
                  </h3>
                  <p className="mt-2 text-sm opacity-75">{s.copy}</p>
                  <span className="mt-7 inline-flex items-center gap-2 rounded-full border border-current/20 px-3 py-1 text-xs">
                    {s.href ? s.cta : "Canal por confirmar"}
                    {s.href && <ArrowUpRight className="size-3" />}
                  </span>
                </>
              );

              return s.href ? (
                <a
                  key={s.name}
                  href={s.href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={`Abrir ${s.name} de Chicas SC`}
                  className={`block rounded-xl p-7 transition-transform hover:-translate-y-1 focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-secondary ${s.bg}`}
                >
                  {content}
                </a>
              ) : (
                <div key={s.name} className={`rounded-xl p-7 ${s.bg}`}>
                  {content}
                </div>
              );
            })}
          </div>
          <div className="mt-10 grid items-start gap-8 rounded-2xl border border-secondary/15 bg-muted p-5 sm:p-8 lg:grid-cols-[.75fr_1.25fr]">
            <div>
              <p className="eyebrow mb-4">TikTok oficial</p>
              <h3 className="font-display text-4xl font-semibold uppercase">
                Chicas SC en movimiento.
              </h3>
              <p className="mt-4 max-w-sm leading-relaxed text-muted-foreground">
                Goles, previas y momentos que se viven en celeste.
              </p>
              <a
                href="https://www.tiktok.com/@chicassc"
                target="_blank"
                rel="noreferrer"
                className="pill-link mt-6 underline underline-offset-4"
              >
                Seguir a @chicassc <ArrowUpRight className="size-4" />
              </a>
            </div>
            <div className="min-w-0 overflow-hidden rounded-xl bg-white p-2">
              <blockquote
                className="tiktok-embed"
                cite="https://www.tiktok.com/@chicassc"
                data-unique-id="chicassc"
                data-embed-type="creator"
                style={{ maxWidth: "720px", minWidth: "288px" }}
              >
                <section>
                  <a
                    href="https://www.tiktok.com/@chicassc"
                    target="_blank"
                    rel="noreferrer"
                  >
                    @chicassc en TikTok
                  </a>
                </section>
              </blockquote>
            </div>
          </div>
          <div className="mt-6 grid gap-6 rounded-2xl border border-secondary/15 bg-white p-5 sm:p-8 md:grid-cols-[minmax(0,1fr)_minmax(0,.7fr)]">
            <div className="self-center">
              <p className="eyebrow mb-4">Video destacado</p>
              <h3 className="font-display text-4xl font-semibold uppercase">
                Vive la pasión celeste.
              </h3>
              <p className="mt-4 max-w-lg leading-relaxed text-muted-foreground">
                Mira el último video publicado por Chicas SC en TikTok.
              </p>
              <a
                href="https://www.tiktok.com/@chicassc/video/7679909809755327765"
                target="_blank"
                rel="noreferrer"
                className="pill-link mt-6 underline underline-offset-4"
              >
                Ver en TikTok <ArrowUpRight className="size-4" />
              </a>
            </div>
            <div className="mx-auto w-full max-w-[360px] overflow-hidden rounded-xl bg-black shadow-lg">
              <iframe
                src="https://www.tiktok.com/player/v1/7679909809755327765?music_info=1&description=1"
                title="Video destacado de Chicas SC en TikTok"
                className="aspect-[9/16] w-full border-0"
                loading="lazy"
                allow="fullscreen"
                allowFullScreen
                referrerPolicy="strict-origin-when-cross-origin"
              />
            </div>
          </div>
          <div className="mt-6 grid gap-6 rounded-2xl border border-secondary/15 bg-white p-5 sm:p-8 md:grid-cols-[minmax(0,1fr)_minmax(0,.7fr)]">
            <div className="self-center">
              <p className="eyebrow mb-4">Instagram destacado</p>
              <h3 className="font-display text-4xl font-semibold uppercase">
                El celeste también se comparte.
              </h3>
              <p className="mt-4 max-w-lg leading-relaxed text-muted-foreground">
                Mira la publicación destacada que compartió la comunidad.
              </p>
              <a
                href="https://www.instagram.com/p/DbD51RVR1lb/"
                target="_blank"
                rel="noreferrer"
                className="pill-link mt-6 underline underline-offset-4"
              >
                Ver en Instagram <ArrowUpRight className="size-4" />
              </a>
            </div>
            <div className="mx-auto w-full max-w-[540px] overflow-hidden rounded-xl border bg-white shadow-lg">
              <iframe
                src="https://www.instagram.com/p/DbD51RVR1lb/embed/"
                title="Publicación destacada de Chicas SC en Instagram"
                className="h-[520px] w-full border-0 sm:h-[580px]"
                loading="lazy"
                allow="encrypted-media; clipboard-write"
                referrerPolicy="strict-origin-when-cross-origin"
              />
            </div>
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
    <div className="relative flex h-full flex-col justify-between overflow-hidden rounded-2xl bg-primary p-6 sm:p-8 xl:p-12">
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
        <Heart className="size-16 -rotate-12" strokeWidth={1} />
      </div>
    </div>
  );
}
