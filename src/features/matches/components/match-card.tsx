import Image from "next/image";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import type { Match } from "../schema";

const statusLabel = {
  scheduled: "Próximo",
  live: "En juego",
  finished: "Finalizado",
  postponed: "Postergado",
  cancelled: "Cancelado",
} as const;

export interface MatchCardProps {
  match: Match;
}

export function MatchCard({ match }: MatchCardProps) {
  return (
    <article className="min-w-[82%] sm:min-w-[calc(50%-10px)] lg:min-w-[calc(25%-12px)] shrink-0 snap-start rounded-xl border border-secondary/15 bg-white/95 p-4 sm:p-5 shadow-sm hover:shadow-md hover:border-primary/40 transition-all duration-300">
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>{format(match.kickoffAt, "dd MMM yyyy", { locale: es })}</span>
        <span className="text-secondary font-medium">{statusLabel[match.status]}</span>
      </div>

      <div className="my-6 flex items-center justify-between gap-3">
        <Image
          className="size-11 shrink-0 object-contain"
          src={match.homeTeamLogoUrl}
          alt={`Escudo de ${match.homeTeam}`}
          width={44}
          height={44}
        />
        <span className="font-display text-3xl font-semibold tabular-nums">
          {match.homeScore ?? "–"} <span className="mx-1 text-border">:</span>{" "}
          {match.awayScore ?? "–"}
        </span>
        <Image
          className="size-11 shrink-0 object-contain"
          src={match.awayTeamLogoUrl}
          alt={`Escudo de ${match.awayTeam}`}
          width={44}
          height={44}
        />
      </div>

      <div className="flex justify-between gap-2 text-xs font-semibold">
        <span className="truncate">{match.homeTeam}</span>
        <span className="truncate text-right">{match.awayTeam}</span>
      </div>

      <div className="mt-5 border-t pt-3 text-xs text-muted-foreground">
        {match.competition}
      </div>
    </article>
  );
}
