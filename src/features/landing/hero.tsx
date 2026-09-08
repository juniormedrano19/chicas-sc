"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { PaintReveal, ParallaxLayer } from "@/components/motion/scroll-reveal";

const mobileHeroSlides = [
  {
    src: "/images/hero/hero1.png",
    alt: "Integrantes de Chicas SC compartiendo su pasión por Sporting Cristal",
  },
  {
    src: "/images/hero/hero2.png",
    alt: "Integrantes de Chicas SC compartiendo su pasión por Sporting Cristal",
  },

  {
    src: "/images/hero/hero4.jpg",
    alt: "Integrantes de Chicas SC compartiendo su pasión por Sporting Cristal",
  },
  {
    src: "/images/hero/hero5.png",
    alt: "Integrante de Chicas SC con la camiseta celeste",
  }
] as const;

export function Hero() {
  const [activeSlide, setActiveSlide] = useState(0);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    const interval = window.setInterval(() => {
      setActiveSlide((current) => (current + 1) % mobileHeroSlides.length);
    }, 5000);

    return () => window.clearInterval(interval);
  }, []);

  return (
    <div id="inicio">
      <section
        aria-label="Galería de Chicas SC"
        className="relative isolate flex min-h-[100svh] overflow-hidden bg-secondary sm:hidden"
      >
        <AnimatePresence initial={false} mode="sync">
          <motion.div
            key={mobileHeroSlides[activeSlide].src}
            className="absolute inset-0"
            initial={prefersReducedMotion ? false : { opacity: 0, scale: 1.035 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={prefersReducedMotion ? undefined : { opacity: 0, scale: 1.015 }}
            transition={{ duration: prefersReducedMotion ? 0 : 0.75, ease: [0.22, 1, 0.36, 1] }}
          >
            <Image
              src={mobileHeroSlides[activeSlide].src}
              alt={mobileHeroSlides[activeSlide].alt}
              fill
              priority={activeSlide === 0}
              sizes="100vw"
              className="object-cover object-center"
            />
          </motion.div>
        </AnimatePresence>
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-linear-to-t from-black/45 to-transparent"
        />
        <div className="absolute bottom-8 left-1/2 z-10 flex -translate-x-1/2 items-center gap-3">
          {mobileHeroSlides.map((slide, index) => (
            <motion.button
              key={slide.src}
              type="button"
              aria-label={`Mostrar imagen ${index + 1}`}
              aria-current={index === activeSlide ? "true" : undefined}
              className="h-2.5 rounded-full bg-white"
              animate={{ width: index === activeSlide ? "2rem" : "0.625rem", opacity: index === activeSlide ? 1 : 0.6 }}
              transition={{ duration: 0.3 }}
              onClick={() => setActiveSlide(index)}
            />
          ))}
        </div>
      </section>

      <section
        className="relative isolate hidden min-h-[100svh] overflow-hidden bg-secondary sm:flex"
      >
        <div className="flex min-h-[100svh] w-full flex-1">
          <div className="relative flex min-h-[100svh] w-full overflow-hidden bg-white">
            <ParallaxLayer
              imageUrl="/images/chicas-sc-hero-stadium.png"
              className="absolute -inset-y-[6%] inset-x-0 bg-cover bg-[position:58%_center] sm:bg-center"
            />
            <p
              aria-hidden="true"
              className="pointer-events-none absolute bottom-[3%] left-[47%] -translate-x-1/2 whitespace-nowrap font-display text-[clamp(4.5rem,65vw,75rem)] font-bold uppercase leading-[.75] tracking-[-.08em] text-white"
            >
              SC
            </p>
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 bg-[url('/images/chicas-sc-hero-foreground-transparent-v3.png')] bg-cover bg-[position:58%_center] brightness-110 contrast-105 drop-shadow-[0_12px_24px_rgba(0,0,0,0.35)] sm:bg-center"
            />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute left-0 top-0 h-[42%] w-[78%] bg-[radial-gradient(ellipse_75%_85%_at_8%_0%,rgba(0,0,0,0.72)_0%,rgba(0,0,0,0.38)_45%,transparent_78%)]"
            />
          </div>
        </div>
      </section>
    </div>
  );
}

export function PassionIntro() {
  return (
    <PaintReveal className="text-secondary">
      <div className="wrap flex min-h-[min(48rem,100svh)] flex-col py-16 sm:py-20 lg:py-24 ">

        {/* font-[family-name:var(--font-sacramento)] */}

        <h2 className="font-[family-name:var(--font-sacramento)] text-[100px] font-normal leading-[.95] tracking-normal text-white">
          &ldquo;Somos la fuerza ganadora

          siempre <span className="text-secondary [-webkit-text-stroke:2px_#fff] [paint-order:stroke_fill]">campeones  </span> siempre primeros, [...] , la actitud positiva que tenemos hará que siempre seamos      <span className="text-secondary [-webkit-text-stroke:2px_#fff] [paint-order:stroke_fill]">campeones  </span>...&rdquo;



        </h2>





      </div>
    </PaintReveal>
  );
}
