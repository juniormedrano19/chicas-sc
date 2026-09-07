import "server-only";
import { getSupabaseAdmin } from "@/lib/supabase";
import { matchSchema, type Match } from "./schema";
const examples: Match[] = [
  {
    id: "demo-1",
    opponent: "Equipo visitante",
    played_at: "2026-08-30T20:00:00Z",
    home: true,
    goals_for: 2,
    goals_against: 0,
    competition: "Encuentro de muestra",
  },
  {
    id: "demo-2",
    opponent: "Equipo local",
    played_at: "2026-08-23T20:00:00Z",
    home: false,
    goals_for: 1,
    goals_against: 1,
    competition: "Encuentro de muestra",
  },
  {
    id: "demo-3",
    opponent: "Equipo visitante",
    played_at: "2026-08-16T20:00:00Z",
    home: true,
    goals_for: 3,
    goals_against: 1,
    competition: "Encuentro de muestra",
  },
  {
    id: "demo-4",
    opponent: "Equipo local",
    played_at: "2026-08-09T20:00:00Z",
    home: false,
    goals_for: 2,
    goals_against: 1,
    competition: "Encuentro de muestra",
  },
];
export type MatchResult = {
  matches: Match[];
  state: "demo" | "live" | "error";
};
export interface MatchRepository {
  latest(): Promise<MatchResult>;
}
export const matchRepository: MatchRepository = {
  async latest() {
    const db = getSupabaseAdmin();
    if (!db) return { matches: examples, state: "demo" };
    try {
      const { data, error } = await db
        .from("matches")
        .select(
          "id,opponent,played_at,home,goals_for,goals_against,competition",
        )
        .eq("published", true)
        .lte("played_at", new Date().toISOString())
        .order("played_at", { ascending: false })
        .limit(4);
      if (error) return { matches: [], state: "error" };
      const parsed = matchSchema.array().safeParse(data);
      return parsed.success
        ? { matches: parsed.data, state: "live" }
        : { matches: [], state: "error" };
    } catch {
      return { matches: [], state: "error" };
    }
  },
};
