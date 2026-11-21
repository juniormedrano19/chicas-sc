import test from "node:test";
import assert from "node:assert/strict";
import { memberEditorSchema, testimonialEditorSchema, albumEditorSchema } from "../src/features/admin/editor-schemas.ts";

const photo = { src: "https://res.cloudinary.com/example/image/upload/photo.webp", alt: "Foto de la comunidad", caption: "", width: 800, height: 1200 };

test("member drafts allow an omitted birthday, trim names and require a valid uploaded image", () => {
  const draft = { name: "  Laura  ", imageUrl: photo.src, birthDate: "" };
  assert.equal(memberEditorSchema.parse(draft).name, "Laura");
  assert.equal(memberEditorSchema.safeParse({ ...draft, imageUrl: "" }).success, false);
  assert.equal(memberEditorSchema.safeParse({ ...draft, name: "   " }).success, false);
  assert.equal(memberEditorSchema.safeParse({ ...draft, birthDate: "2999-01-01" }).success, false);
  assert.equal(memberEditorSchema.safeParse({ ...draft, birthDate: "not-a-date" }).success, false);
  assert.equal(memberEditorSchema.safeParse({ ...draft, birthDate: "2026-02-31" }).success, false);
});

test("testimonials require an author and meaningful text before association", () => {
  assert.deepEqual(testimonialEditorSchema.parse({ memberId: "member-1", text: "  Mi historia.  " }), { memberId: "member-1", text: "Mi historia." });
  assert.equal(testimonialEditorSchema.safeParse({ memberId: "", text: "Mi historia." }).success, false);
  assert.equal(testimonialEditorSchema.safeParse({ memberId: "member-1", text: "   " }).success, false);
  assert.equal(testimonialEditorSchema.safeParse({ memberId: "member-1", text: "a".repeat(2001) }).success, false);
});

test("albums require a URL-safe slug and one to 100 usable photos", () => {
  const draft = { title: "Nuestras previas", description: "Juntas en la tribuna.", slug: "nuestras-previas", photos: [photo] };
  assert.equal(albumEditorSchema.safeParse(draft).success, true);
  for (const change of [
    { slug: "Nuestras previas" }, { slug: "../album" }, { slug: "-album" },
    { photos: [] }, { photos: Array(101).fill(photo) },
    { photos: [{ ...photo, width: 0 }] }, { photos: [{ ...photo, src: "" }] },
  ]) assert.equal(albumEditorSchema.safeParse({ ...draft, ...change }).success, false);
});
