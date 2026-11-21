"use client";

import { useCallback, useState } from "react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import type { Match } from "../schema";
import { MatchCardSkeletonContent, matchCardClassName } from "./match-card-skeleton";
import { TeamLogo, type LogoStatus } from "./team-logo";

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
  const [logos, setLogos] = useState<Record<string, LogoStatus>>({});
  const loading = !logos[match.homeTeamLogoUrl] || !logos[match.awayTeamLogoUrl];
  const settleLogo = useCallback((src: string, status: LogoStatus) => {
    setLogos((current) => current[src] === status ? current : { ...current, [src]: status });
  }, []);
  return (
    <article aria-busy={loading} className={`${matchCardClassName} relative hover:shadow-md hover:border-primary/40 transition-all duration-300`}>
      {loading && <div className="pointer-events-none absolute inset-0 rounded-xl bg-white/95 p-4 sm:p-5"><MatchCardSkeletonContent /><span role="status" className="sr-only">Cargando escudos de {match.homeTeam} y {match.awayTeam}</span></div>}
      <div className={loading ? "opacity-0" : "opacity-100 transition-opacity duration-200 motion-reduce:transition-none"}>
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>{format(match.kickoffAt, "dd MMM yyyy", { locale: es })}</span>
        <span className="text-secondary font-medium">{statusLabel[match.status]}</span>
      </div>

      <div className="my-6 flex items-center justify-between gap-3">
        <TeamLogo src={match.homeTeamLogoUrl} name={match.homeTeam} status={logos[match.homeTeamLogoUrl]} onSettled={settleLogo} />
        <span className="font-display text-3xl font-semibold tabular-nums">
          {match.homeScore ?? "–"} <span className="mx-1 text-border">:</span>{" "}
          {match.awayScore ?? "–"}
        </span>
        <TeamLogo src={match.awayTeamLogoUrl} name={match.awayTeam} status={logos[match.awayTeamLogoUrl]} onSettled={settleLogo} />
      </div>

      <div className="flex justify-between gap-2 text-xs font-semibold">
        <span className="truncate">{match.homeTeam}</span>
        <span className="truncate text-right">{match.awayTeam}</span>
      </div>

      <div className="mt-5 border-t pt-3 text-xs text-muted-foreground">
        {match.competition}
      </div>
      </div>
    </article>
  );
}
