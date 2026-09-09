"use client";

import Link from "next/link";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { ScrollReveal } from "@/components/motion/scroll-reveal";
import { Button } from "@/components/ui/button";
import { useMatchesCarousel } from "./hooks/use-matches-carousel";
import { MatchCard } from "./components/match-card";

export function MatchesSection() {
  const {
    matches,
    state,
    carouselRef,
    canScrollLeft,
    canScrollRight,
    scroll,
    updateScrollState,
  } = useMatchesCarousel();

  return (
    <section
      id="partidos"
      className="bg-[url('/images/terrace.jpg')] bg-cover bg-center py-16"
    >
      <div className="wrap">
        <ScrollReveal>
          <div className="mb-8">
            <div className="flex w-full flex-col items-center justify-center gap-4 lg:flex-row lg:items-start lg:justify-between">
              <h2 className="section-title">Últimos partidos</h2>
              {matches.length > 0 && (
                <div className="flex items-center gap-3" aria-label="Navegación de partidos">
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    className="size-11 sm:size-12 rounded-full border-secondary bg-white text-secondary shadow-sm hover:bg-primary hover:text-white disabled:opacity-35 transition-colors"
                    onClick={() => scroll("left")}
                    disabled={!canScrollLeft}
                    aria-label="Ver partidos anteriores"
                  >
                    <ChevronLeft className="size-5 sm:size-6" />
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    className="size-11 sm:size-12 rounded-full border-secondary bg-white text-secondary shadow-sm hover:bg-primary hover:text-white disabled:opacity-35 transition-colors"
                    onClick={() => scroll("right")}
                    disabled={!canScrollRight}
                    aria-label="Ver próximos partidos"
                  >
                    <ChevronRight className="size-5 sm:size-6" />
                  </Button>
                </div>
              )}
            </div>
          </div>

          <div
            ref={carouselRef}
            onScroll={updateScrollState}
            className="flex snap-x snap-mandatory scroll-px-4 gap-4 overflow-x-auto py-3 px-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {matches.map((match) => (
              <MatchCard key={match.id} match={match} />
            ))}
          </div>

          {!matches.length && (
            <p role="status" className="rounded-xl border bg-white p-8">
              {state === "loading"
                ? "Cargando partidos..."
                : state === "error"
                  ? "No pudimos cargar los partidos. Intenta nuevamente más tarde."
                  : "Aún no hay resultados publicados."}
            </p>
          )}

          <Link href="/#contacto" className="pill-link mt-6">
            Vivamos juntas el próximo encuentro <ArrowRight className="size-4" />
          </Link>
        </ScrollReveal>
      </div>
    </section>
  );
}
