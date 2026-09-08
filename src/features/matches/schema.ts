import { z } from "zod";
export const matchSchema = z.object({
  id: z.string(),
  homeTeam: z.string(),
  awayTeam: z.string(),
  homeTeamId: z.string(),
  awayTeamId: z.string(),
  homeTeamLogoUrl: z.url(),
  awayTeamLogoUrl: z.url(),
  kickoffAt: z.date(),
  homeScore: z.number().int().nonnegative().nullable(),
  awayScore: z.number().int().nonnegative().nullable(),
  competition: z.string(),
  status: z.enum(["scheduled", "live", "finished", "postponed", "cancelled"]),
});
export type Match = z.infer<typeof matchSchema>;
