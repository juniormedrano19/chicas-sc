export const SPORTING_CRISTAL_TEAM_ID = "2302";

export type MatchStatus =
  | "scheduled"
  | "live"
  | "finished"
  | "postponed"
  | "cancelled";

type SofascoreTeam = {
  id: number;
  name: string;
  shortName?: string;
};

type SofascoreLeague = {
  id: number;
  name: string;
  category: { name: string };
};

export type SofascoreEvent = {
  id: number;
  startTimestamp: number;
  status: { type: string };
  homeTeam: SofascoreTeam;
  awayTeam: SofascoreTeam;
  homeScore?: { current?: number };
  awayScore?: { current?: number };
  tournament: { uniqueTournament: SofascoreLeague };
};

export type TeamDocument = {
  name: string;
  logoUrl: string;
};

export type LeagueDocument = {
  name: string;
  country: string;
  logoUrl: string;
};

export type MatchDocument = {
  homeTeamId: string;
  awayTeamId: string;
  leagueId: string;
  kickoffAt: Date;
  homeScore: number | null;
  awayScore: number | null;
  status: MatchStatus;
};

export function teamLogoUrl(teamId: string | number) {
  return `https://img.sofascore.com/api/v1/team/${teamId}/image`;
}

export function leagueLogoUrl(leagueId: string | number) {
  return `https://img.sofascore.com/api/v1/unique-tournament/${leagueId}/image`;
}

function toMatchStatus(statusType: string): MatchStatus {
  switch (statusType) {
    case "notstarted":
      return "scheduled";
    case "inprogress":
      return "live";
    case "finished":
      return "finished";
    case "postponed":
      return "postponed";
    case "canceled":
    case "cancelled":
      return "cancelled";
    default:
      return "scheduled";
  }
}

export function mapSofascoreEvent(event: SofascoreEvent) {
  const league = event.tournament.uniqueTournament;
  const homeTeamId = String(event.homeTeam.id);
  const awayTeamId = String(event.awayTeam.id);
  const leagueId = String(league.id);

  return {
    matchId: String(event.id),
    teams: [
      {
        teamId: homeTeamId,
        data: { name: event.homeTeam.shortName ?? event.homeTeam.name },
      },
      {
        teamId: awayTeamId,
        data: { name: event.awayTeam.shortName ?? event.awayTeam.name },
      },
    ] as const,
    league: {
      leagueId,
      data: { name: league.name, country: league.category.name },
    },
    match: {
      homeTeamId,
      awayTeamId,
      leagueId,
      kickoffAt: new Date(event.startTimestamp * 1000),
      homeScore: event.homeScore?.current ?? null,
      awayScore: event.awayScore?.current ?? null,
      status: toMatchStatus(event.status.type),
    } satisfies MatchDocument,
  };
}
