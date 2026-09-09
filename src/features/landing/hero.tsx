"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { ParallaxLayer } from "@/components/motion/scroll-reveal";
import { useHeroSlider } from "./hooks/use-hero-slider";

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
  },
] as const;

export function Hero() {
  const { slides, selectSlide, prefersReducedMotion } = useHeroSlider(
    mobileHeroSlides.length,
    5000,
  );

  return (
    <div id="inicio">
      {/* Mobile Hero Slider */}
      <section
        aria-label="Galería de Chicas SC"
        className="relative isolate flex min-h-[100svh] overflow-hidden bg-black sm:hidden"
      >
        {mobileHeroSlides.map((slide, index) => {
          const isCurrent = index === slides.current;
          const isPrev = index === slides.prev;

          return (
            <motion.div
              key={slide.src}
              className="absolute inset-0"
              style={{
                zIndex: isCurrent ? 20 : isPrev ? 10 : 0,
                pointerEvents: isCurrent ? "auto" : "none",
              }}
              initial={false}
              animate={{
                opacity: isCurrent ? 1 : isPrev ? 1 : 0,
                scale: isCurrent ? 1 : 1.04,
              }}
              transition={{
                opacity: {
                  duration: prefersReducedMotion ? 0 : 0.85,
                  ease: "easeInOut",
                },
                scale: {
                  duration: prefersReducedMotion ? 0 : 1.2,
                  ease: [0.22, 1, 0.36, 1],
                },
              }}
            >
              <Image
                src={slide.src}
                alt={slide.alt}
                fill
                priority
                sizes="100vw"
                className="object-cover object-center"
              />
            </motion.div>
          );
        })}

        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-0 z-20 h-1/3 bg-linear-to-t from-black/50 to-transparent"
        />

        <div className="absolute bottom-8 left-1/2 z-30 flex -translate-x-1/2 items-center gap-3">
          {mobileHeroSlides.map((slide, index) => (
            <motion.button
              key={slide.src}
              type="button"
              aria-label={`Mostrar imagen ${index + 1}`}
              aria-current={index === slides.current ? "true" : undefined}
              className="h-2.5 rounded-full bg-white"
              animate={{
                width: index === slides.current ? "2rem" : "0.625rem",
                opacity: index === slides.current ? 1 : 0.5,
              }}
              transition={{ duration: 0.3 }}
              onClick={() => selectSlide(index)}
            />
          ))}
        </div>
      </section>

      {/* Desktop Hero */}
      <section className="relative isolate hidden min-h-[100svh] overflow-hidden bg-secondary sm:flex">
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
