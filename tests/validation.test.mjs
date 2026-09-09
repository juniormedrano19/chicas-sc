import test from "node:test";
import assert from "node:assert/strict";
import { contactSchema } from "../src/features/contact/schema.ts";
import { matchSchema } from "../src/features/matches/schema.ts";

const validContact = {
  name: "  Ana  ",
  email: "ANA@example.com",
  whatsapp: "+51 999 888 777",
  message: "Quiero conocer al grupo de Chicas SC.",
  consent: true,
  website: "",
};

test("contact normalizes names and email before persistence", () => {
  const value = contactSchema.parse(validContact);
  assert.equal(value.name, "Ana");
  assert.equal(value.email, "ana@example.com");
  assert.equal(value.whatsapp, "+51 999 888 777");
});

test("contact rejects missing consent and bot honeypot", () => {
  assert.equal(contactSchema.safeParse({ ...validContact, consent: false }).success, false);
  assert.equal(contactSchema.safeParse({ ...validContact, website: "https://spam.example" }).success, false);
});

test("contact enforces all required fields and minimum lengths with Zod", () => {
  for (const input of [
    { name: "A" }, // menor a 2 caracteres
    { name: "" },
    { email: "invalid-email" },
    { email: "" },
    { whatsapp: "12345" }, // menor a 9 dígitos
    { whatsapp: "abcdefghi" }, // no numérico
    { whatsapp: "" },
    { message: "Hola" }, // menor a 10 caracteres
    { message: "   " },
    { message: "a".repeat(2001) },
    { name: "a".repeat(81) },
  ]) {
    assert.equal(
      contactSchema.safeParse({ ...validContact, ...input }).success,
      false,
      `Should fail for input: ${JSON.stringify(input)}`,
    );
  }
});

const validMatch = {
  id: "match-1",
  homeTeam: "Sporting Cristal",
  awayTeam: "Alianza Lima",
  homeTeamId: "team-1",
  awayTeamId: "team-2",
  homeTeamLogoUrl: "https://img.sofascore.com/api/v1/team/1/image",
  awayTeamLogoUrl: "https://img.sofascore.com/api/v1/team/2/image",
  kickoffAt: new Date("2026-08-01T20:00:00Z"),
  homeScore: 2,
  awayScore: 0,
  competition: "Liga 1 Te Apuesto",
  status: "finished",
};

test("match contract validates correctly and rejects negative scores or invalid statuses", () => {
  assert.equal(matchSchema.safeParse(validMatch).success, true);
  assert.equal(matchSchema.safeParse({ ...validMatch, homeScore: -1 }).success, false);
  assert.equal(matchSchema.safeParse({ ...validMatch, status: "unknown_status" }).success, false);
  assert.equal(matchSchema.safeParse({ ...validMatch, homeTeamLogoUrl: "not-a-url" }).success, false);
});
