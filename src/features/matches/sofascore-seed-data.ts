import {
  leagueLogoUrl,
  teamLogoUrl,
  type LeagueDocument,
  type MatchDocument,
  type TeamDocument,
} from "./sofascore.ts";

type SeedTeam = { teamId: string; data: TeamDocument };
type SeedLeague = { leagueId: string; data: LeagueDocument };
type SeedMatch = {
  matchId: string;
  data: Omit<MatchDocument, "kickoffAt"> & { kickoffAtSeconds: number };
};

/**
 * Minimal data mapped from the SofaScore event payloads supplied for Sporting
 * Cristal. IDs are also SofaScore IDs so logo URLs can be derived at runtime.
 */
export const sofascoreSeed: {
  teams: SeedTeam[];
  leagues: SeedLeague[];
  matches: SeedMatch[];
} = {
  teams: [
    ["335557", "ADT"], ["2307", "Alianza Atlético"], ["2311", "Alianza Lima"], ["282538", "Atlético Grau"], ["1082001", "Bentín Tacna Heroica"], ["1082002", "Cajamarca"], ["5991", "Cerro Porteño"], ["2301", "Cienciano"], ["467733", "Comerciantes FC"], ["213609", "Comerciantes Unidos"], ["48431", "Comercio"], ["63760", "Cusco"], ["458584", "Deportivo Garcilaso"], ["1093205", "Estudiantil CNI"], ["511206", "Juan Pablo II"], ["6105", "Junior Barranquilla"], ["252254", "Los Chankas"], ["2308", "Melgar"], ["492848", "Moquegua"], ["1963", "Palmeiras"], ["1999", "RB Bragantino"], ["2312", "Sport Boys"], ["33895", "Sport Huancayo"], ["2302", "Sporting Cristal"], ["2305", "Universitario"], ["87854", "UTC"],
  ].map(([teamId, name]) => ({
    teamId,
    data: { name, logoUrl: teamLogoUrl(teamId) },
  })) as SeedTeam[],
  leagues: [
    ["384", "CONMEBOL Libertadores", "South America"], ["480", "CONMEBOL Sudamericana", "South America"], ["406", "Liga 1 Te Apuesto", "Peru"], ["35067", "Peru Copa de la Liga", "Peru"],
  ].map(([leagueId, name, country]) => ({
    leagueId,
    data: { name, country, logoUrl: leagueLogoUrl(leagueId) },
  })) as SeedLeague[],
  matches: [
    ["15714336", "2302", "492848", "406", 1775232000, 1, 2, "finished"],
    ["15832754", "2302", "5991", "384", 1775700000, 1, 0, "finished"],
    ["15832763", "1963", "2302", "384", 1776376800, 2, 1, "finished"],
    ["15885659", "2302", "87854", "406", 1776614400, 3, 2, "finished"],
    ["15881788", "282538", "2302", "406", 1776888900, 4, 1, "finished"],
    ["15929229", "213609", "2302", "406", 1777149000, 1, 0, "finished"],
    ["15832782", "2302", "6105", "384", 1777428000, 2, 0, "finished"],
    ["15930114", "2302", "63760", "406", 1777824000, 2, 2, "finished"],
    ["15832803", "2302", "1963", "384", 1778018400, 0, 2, "finished"],
    ["16022826", "2311", "2302", "406", 1778374800, 1, 1, "finished"],
    ["16022831", "1082002", "2302", "406", 1778875200, 3, 1, "finished"],
    ["15832828", "6105", "2302", "384", 1779328800, 3, 2, "finished"],
    ["16147473", "2302", "335557", "406", 1779638400, 2, 1, "finished"],
    ["15832849", "5991", "2302", "384", 1780005600, 2, 0, "finished"],
    ["16153077", "2301", "2302", "406", 1780264800, 3, 2, "finished"],
    ["16230431", "467733", "2302", "35067", 1781382600, 1, 1, "finished"],
    ["16230444", "1093205", "2302", "35067", 1782073800, 1, 2, "finished"],
    ["16230460", "2302", "48431", "35067", 1782591300, 2, 0, "finished"],
    ["16418645", "2302", "1082001", "35067", 1783801800, 6, 5, "finished"],
    ["16281116", "2302", "458584", "406", 1784319300, 1, 0, "finished"],
    ["16251108", "2302", "1999", "480", 1784766600, 0, 0, "finished"],
    ["16281128", "2308", "2302", "406", 1785027600, 2, 1, "finished"],
    ["16251115", "1999", "2302", "480", 1785371400, 1, 0, "finished"],
    ["16280784", "2302", "511206", "406", 1785686400, 2, 0, "finished"],
    ["16280791", "2305", "2302", "406", 1786152600, 1, 1, "finished"],
    ["16280806", "2302", "33895", "406", 1786896000, 4, 1, "finished"],
    ["16280801", "2307", "2302", "406", 1787342400, 3, 1, "finished"],
    ["16715235", "2302", "33895", "35067", 1787774400, 4, 1, "finished"],
    ["16280815", "2312", "2302", "406", 1788121800, 1, 0, "finished"],
    ["16280818", "2302", "252254", "406", 1788710400, 5, 0, "finished"],
    ["16281137", "492848", "2302", "406", 1789244100, null, null, "scheduled"],
    ["16280840", "2302", "282538", "406", 1789849800, null, null, "scheduled"],
    ["17034085", "335557", "2302", "35067", 1790540100, null, null, "scheduled"],
    ["16280831", "87854", "2302", "406", 1791489600, null, null, "scheduled"],
    ["16280846", "2302", "213609", "406", 1792180800, null, null, "scheduled"],
    ["16280851", "63760", "2302", "406", 1792785600, null, null, "scheduled"],
    ["16280858", "2302", "2311", "406", 1793131200, null, null, "scheduled"],
    ["16280869", "2302", "1082002", "406", 1793390400, null, null, "scheduled"],
    ["16281150", "335557", "2302", "406", 1793995200, null, null, "scheduled"],
    ["16281156", "2302", "2301", "406", 1794686400, null, null, "scheduled"],
  ].map(([matchId, homeTeamId, awayTeamId, leagueId, kickoffAtSeconds, homeScore, awayScore, status]) => ({
    matchId,
    data: {
      homeTeamId,
      awayTeamId,
      leagueId,
      kickoffAtSeconds,
      homeScore,
      awayScore,
      status: status as MatchDocument["status"],
    },
  })) as SeedMatch[],
};
