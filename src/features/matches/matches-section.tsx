import { format, parseISO } from "date-fns";
import { es } from "date-fns/locale";
import { ArrowRight } from "lucide-react";
import { ScrollReveal } from "@/components/motion/scroll-reveal";
import type { MatchResult } from "./repository";
export function MatchesSection({ matches, state }: MatchResult) {
  return (
    <section
      id="partidos"
      className="bg-[url('/images/terrace.jpg')] bg-cover bg-center py-16"
    >
      <div className="wrap">
        <ScrollReveal>
          <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="eyebrow mb-3">90 minutos. Una misma emoción.</p>
              <h2 className="section-title">
                Últimos partidos
              </h2>
            </div>
            <span className="text-xs text-muted-foreground">
              {state === "demo"
                ? "Resultados ilustrativos · no oficiales"
                : "Sporting Cristal"}
            </span>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {matches.map((m) => (
              <article
                key={m.id}
                className="rounded-xl border border-secondary/15 bg-white/90 p-5"
              >
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>
                    {format(parseISO(m.played_at), "dd MMM yyyy", { locale: es })}
                  </span>
                  <span className="text-secondary">Finalizado</span>
                </div>
                <div className="my-6 flex items-center justify-between gap-3">
                  <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-primary font-display text-lg font-bold">
                    SC
                  </span>
                  <span className="font-display text-3xl font-semibold tabular-nums">
                    {m.goals_for} <span className="mx-1 text-border">:</span>{" "}
                    {m.goals_against}
                  </span>
                  <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-muted text-sm font-bold">
                    EQ
                  </span>
                </div>
                <div className="flex justify-between gap-2 text-xs font-semibold">
                  <span>Sporting Cristal</span>
                  <span className="text-right">{m.opponent}</span>
                </div>
                <div className="mt-5 border-t pt-3 text-xs text-muted-foreground">
                  {m.competition} · {m.home ? "Local" : "Visita"}
                </div>
              </article>
            ))}
          </div>
          {!matches.length && (
            <p role="status" className="rounded-xl border bg-white p-8">
              {state === "error"
                ? "No pudimos cargar los partidos. Intenta nuevamente más tarde."
                : "Pronto publicaremos los primeros resultados."}
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
