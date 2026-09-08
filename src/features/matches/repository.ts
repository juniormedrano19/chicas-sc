import {
  collection,
  getDocs,
  Timestamp,
  type DocumentData,
  type QuerySnapshot,
} from "firebase/firestore";

import { firestore } from "@/lib/firebase/client";
import { SPORTING_CRISTAL_TEAM_ID } from "./sofascore";
import { matchSchema, type Match } from "./schema";

interface FirestoreEntityDocument {
  name?: unknown;
  logoUrl?: unknown;
}

interface FirestoreMatchDocument {
  homeTeamId?: unknown;
  awayTeamId?: unknown;
  leagueId?: unknown;
  kickoffAt?: unknown;
  homeScore?: unknown;
  awayScore?: unknown;
  status?: unknown;
}

interface FirestoreEntity {
  name: string;
  logoUrl: string;
}

export type MatchResult = {
  matches: Match[];
  state: "loading" | "live" | "error";
};

export interface MatchRepository {
  latest(): Promise<MatchResult>;
}

function asDate(value: unknown) {
  if (value instanceof Timestamp) return value.toDate();
  if (value instanceof Date) return value;
  return null;
}

function toEntityMap(documents: QuerySnapshot<DocumentData>) {
  return new Map(
    documents.docs.flatMap((snapshot) => {
      const { name, logoUrl } = snapshot.data() as FirestoreEntityDocument;
      return typeof name === "string" && typeof logoUrl === "string"
        ? [[snapshot.id, { name, logoUrl } satisfies FirestoreEntity] as const]
        : [];
    }),
  );
}

export const matchRepository: MatchRepository = {
  async latest() {
    try {
      const [teamSnapshots, leagueSnapshots, matchSnapshots] = await Promise.all([
        getDocs(collection(firestore, "teams")),
        getDocs(collection(firestore, "leagues")),
        getDocs(collection(firestore, "matches")),
      ]);

      const teams = toEntityMap(teamSnapshots);
      const leagues = toEntityMap(leagueSnapshots);
      const matches = matchSnapshots.docs
        .flatMap((snapshot) => {
          const data = snapshot.data() as FirestoreMatchDocument;
          const homeTeamId = typeof data.homeTeamId === "string" ? data.homeTeamId : null;
          const awayTeamId = typeof data.awayTeamId === "string" ? data.awayTeamId : null;
          const leagueId = typeof data.leagueId === "string" ? data.leagueId : null;
          const kickoffAt = asDate(data.kickoffAt);

          if (
            !homeTeamId || !awayTeamId || !leagueId || !kickoffAt ||
            !teams.has(homeTeamId) || !teams.has(awayTeamId) || !leagues.has(leagueId)
          ) return [];

          const parsed = matchSchema.safeParse({
            id: snapshot.id,
            homeTeam: teams.get(homeTeamId)?.name,
            awayTeam: teams.get(awayTeamId)?.name,
            homeTeamId,
            awayTeamId,
            homeTeamLogoUrl: teams.get(homeTeamId)?.logoUrl,
            awayTeamLogoUrl: teams.get(awayTeamId)?.logoUrl,
            kickoffAt,
            homeScore: typeof data.homeScore === "number" ? data.homeScore : null,
            awayScore: typeof data.awayScore === "number" ? data.awayScore : null,
            competition: leagues.get(leagueId)?.name,
            status: data.status,
          });
          return parsed.success ? [parsed.data] : [];
        })
        .filter((match) =>
          (match.homeTeamId === SPORTING_CRISTAL_TEAM_ID || match.awayTeamId === SPORTING_CRISTAL_TEAM_ID),
        )
        .sort((a, b) => a.kickoffAt.getTime() - b.kickoffAt.getTime());

      return { matches, state: "live" };
    } catch {
      return { matches: [], state: "error" };
    }
  },
};
