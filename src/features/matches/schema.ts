import { z } from "zod";
export const matchSchema = z.object({
  id: z.string(),
  opponent: z.string(),
  played_at: z.iso.datetime(),
  home: z.boolean(),
  goals_for: z.number().int().nonnegative(),
  goals_against: z.number().int().nonnegative(),
  competition: z.string(),
});
export type Match = z.infer<typeof matchSchema>;
