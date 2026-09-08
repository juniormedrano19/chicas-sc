"use client";

import { format } from "date-fns";
import Image from "next/image";
import { useEffect, useState } from "react";
import { es } from "date-fns/locale";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { ScrollReveal } from "@/components/motion/scroll-reveal";
import { Button } from "@/components/ui/button";
import { matchRepository, type MatchResult } from "./repository";

const initialResult: MatchResult = { matches: [], state: "loading" };
const VISIBLE_MATCHES = 4;

const statusLabel = {
  scheduled: "Próximo",
  live: "En juego",
  finished: "Finalizado",
  postponed: "Postergado",
  cancelled: "Cancelado",
} as const;

function findLastFinishedIndex(matches: MatchResult["matches"]) {
  return matches.reduce(
    (latestIndex, match, index) => match.status === "finished" ? index : latestIndex,
    0,
  );
}

export function MatchesSection() {
  const [{ matches, state }, setResult] = useState<MatchResult>(initialResult);
  const [startIndex, setStartIndex] = useState(0);

  useEffect(() => {
    let isCurrent = true;

    void matchRepository.latest().then((result) => {
      if (isCurrent) {
        setResult(result);
        setStartIndex(findLastFinishedIndex(result.matches));
      }
    });

    return () => {
      isCurrent = false;
    };
  }, []);

  const visibleMatches = matches.slice(startIndex, startIndex + VISIBLE_MATCHES);
  const canGoBack = startIndex > 0;
  const canGoForward = startIndex + VISIBLE_MATCHES < matches.length;
  const canGoForwardOnMobile = startIndex < matches.length - 1;

  return (
    <section
      id="partidos"
      className="bg-[url('/images/terrace.jpg')] bg-cover bg-center py-16"
    >
      <div className="wrap">
        <ScrollReveal>
          <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
            <div>
              <h2 className="section-title">
                Últimos partidos
              </h2>
              {matches.length > 0 && (
                <div className="mt-6 flex items-center gap-4 sm:hidden" aria-label="Navegación de partidos">
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    className="size-14 rounded-full border-primary bg-white text-primary shadow-none hover:bg-primary hover:text-white disabled:opacity-35"
                    onClick={() => setStartIndex((current) => Math.max(0, current - 1))}
                    disabled={!canGoBack}
                    aria-label="Ver partidos anteriores"
                  >
                    <ChevronLeft className="size-7" />
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    className="size-14 rounded-full border-primary bg-white text-primary shadow-none hover:bg-primary hover:text-white disabled:opacity-35"
                    onClick={() => setStartIndex((current) => Math.min(matches.length - 1, current + 1))}
                    disabled={!canGoForwardOnMobile}
                    aria-label="Ver próximos partidos"
                  >
                    <ChevronRight className="size-7" />
                  </Button>
                </div>
              )}
            </div>
            {matches.length > 0 && (
              <div className="hidden items-center gap-3 sm:flex" aria-label="Navegación de partidos">
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  className="size-11 rounded-full border-primary bg-white text-primary shadow-none hover:bg-primary hover:text-white disabled:opacity-35"
                  onClick={() => setStartIndex((current) => Math.max(0, current - 1))}
                  disabled={!canGoBack}
                  aria-label="Ver partidos anteriores"
                >
                  <ChevronLeft className="size-5" />
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  className="size-11 rounded-full border-primary bg-white text-primary shadow-none hover:bg-primary hover:text-white disabled:opacity-35"
                  onClick={() => setStartIndex((current) => Math.min(matches.length - VISIBLE_MATCHES, current + 1))}
                  disabled={!canGoForward}
                  aria-label="Ver próximos partidos"
                >
                  <ChevronRight className="size-5" />
                </Button>
              </div>
            )}

          </div>
          <div key={startIndex} className="-mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:mx-0 sm:grid sm:grid-cols-2 sm:overflow-visible sm:px-0 sm:pb-0 xl:grid-cols-4">
            {visibleMatches.map((m, index) => (
              <article
                key={m.id}
                aria-current={index === 0 ? "true" : undefined}
                className={`animate-in min-w-[78%] snap-start fade-in slide-in-from-right-3 rounded-xl border border-secondary/15 bg-white/90 p-4 transition-all duration-500 sm:min-w-0 sm:p-5 sm:scale-100 sm:opacity-100 ${index === 0 ? "scale-100 opacity-100 shadow-lg" : "scale-[0.96] opacity-55"}`}
              >
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>{format(m.kickoffAt, "dd MMM yyyy", { locale: es })}</span>
                  <span className="text-secondary">{statusLabel[m.status]}</span>
                </div>
                <div className="my-6 flex items-center justify-between gap-3">
                  <Image className="size-11 shrink-0 object-contain" src={m.homeTeamLogoUrl} alt={`Escudo de ${m.homeTeam}`} width={44} height={44} />
                  <span className="font-display text-3xl font-semibold tabular-nums">
                    {m.homeScore ?? "–"} <span className="mx-1 text-border">:</span>{" "}
                    {m.awayScore ?? "–"}
                  </span>
                  <Image className="size-11 shrink-0 object-contain" src={m.awayTeamLogoUrl} alt={`Escudo de ${m.awayTeam}`} width={44} height={44} />
                </div>
                <div className="flex justify-between gap-2 text-xs font-semibold">
                  <span>{m.homeTeam}</span>
                  <span className="text-right">{m.awayTeam}</span>
                </div>
                <div className="mt-5 border-t pt-3 text-xs text-muted-foreground">
                  {m.competition}
                </div>
              </article>
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

          <a href="#contacto" className="pill-link mt-6">
            Vivamos juntas el próximo encuentro{" "}
            <ArrowRight className="size-4" />
          </a>
        </ScrollReveal>
      </div>
    </section>
  );
}
