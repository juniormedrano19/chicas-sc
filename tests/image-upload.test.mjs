import test from "node:test";
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { getOptimizedImageFormat, prepareAdminImage } from "../src/features/admin/prepare-image.ts";
import { imageUploadRequestSchema } from "../src/features/admin/image-upload-contract.ts";
import { createImageUploadSignature } from "../src/features/admin/image-upload-signature.ts";
import { uploadAdminImage } from "../src/features/admin/image-upload.ts";

const MIB = 1024 * 1024;
function webpFile(size = 64) {
  const data = Buffer.alloc(size);
  data.write("RIFF", 0); data.writeUInt32LE(size - 8, 4); data.write("WEBP", 8);
  return new File([data], "foto.webp", { type: "image/webp" });
}
function avifFile() {
  const data = Buffer.alloc(32);
  data.writeUInt32BE(32); data.write("ftypmif1", 4); data.write("avif", 20);
  return new File([data], "foto.avif", { type: "" });
}
const input = { section: "albums", format: "webp", size: 10 * MIB };
const credential = "cloudinary://public-test-key:test-secret@example-cloud";
const uploaded = { secure_url: "https://res.cloudinary.com/example-cloud/image/upload/test.webp", width: 800, height: 1200, format: "webp", done: true };

test("WebP and AVIF are detected by bytes and preserved without re-encoding", async () => {
  for (const [file, format] of [[webpFile(), "webp"], [avifFile(), "avif"]]) {
    assert.equal(await getOptimizedImageFormat(file), format);
    const prepared = await prepareAdminImage(file);
    assert.equal(prepared.file, file);
    assert.equal(prepared.format, format);
  }
  assert.equal(await getOptimizedImageFormat(new File(["not an image"], "fake.webp", { type: "image/webp" })), null);
  await assert.rejects(prepareAdminImage(new File([], "empty.jpg")), /200 MB/);
});

test("signing accepts up to 200 MiB and rejects unsupported formats and destinations", () => {
  assert.equal(imageUploadRequestSchema.safeParse({ ...input, size: 200 * MIB }).success, true);
  for (const override of [{ size: 200 * MIB + 1 }, { size: 0 }, { section: "../other" }, { format: "jpg" }, { public_id: "overwrite" }]) {
    assert.equal(imageUploadRequestSchema.safeParse({ ...input, ...override }).success, false);
  }
});

test("upload signatures bind the folder, format and overwrite policy without exposing the secret", () => {
  const auth = createImageUploadSignature(input, credential);
  assert.equal(auth.params.asset_folder, "chicas-sc/albumes");
  assert.match(auth.params.public_id, /^chicas-sc\/albumes\/[a-f0-9-]+$/);
  assert.equal(auth.params.overwrite, false);
  assert.equal(auth.params.allowed_formats, "webp");
  const canonical = Object.entries(auth.params).sort(([a], [b]) => a.localeCompare(b)).map(([k, v]) => `${k}=${v}`).join("&");
  assert.equal(auth.signature, createHash("sha1").update(canonical + "test-secret").digest("hex"));
  assert.ok(!JSON.stringify(auth).includes("test-secret"));
  assert.equal(createImageUploadSignature({ ...input, section: "members", format: "avif" }, credential).params.asset_folder, "chicas-sc/integrantes");
  assert.throws(() => createImageUploadSignature(input, "invalid"));
});

test("large images send only metadata to Vercel and every byte directly to Cloudinary in chunks", async (t) => {
  const file = webpFile(10.5 * MIB);
  const auth = createImageUploadSignature(input, credential);
  const chunks = [];
  const ids = [];
  t.mock.method(globalThis, "fetch", async (url, options) => {
    if (url === "/api/admin/member-image") {
      assert.deepEqual(JSON.parse(options.body), { section: "albums", format: "webp", size: file.size });
      assert.equal(options.headers["x-admin-code"], "local-test-code");
      assert.ok(options.body.length < 200);
      return Response.json(auth);
    }
    assert.equal(url, "https://api.cloudinary.com/v1_1/example-cloud/image/upload");
    assert.equal(options.headers["x-admin-code"], undefined);
    const blob = options.body.get("file");
    chunks.push(Buffer.from(await blob.arrayBuffer()));
    ids.push(options.headers["X-Unique-Upload-Id"]);
    assert.equal(options.body.get("signature"), auth.signature);
    const start = chunks.length === 1 ? 0 : 6 * MIB;
    assert.equal(options.headers["Content-Range"], `bytes ${start}-${start + blob.size - 1}/${file.size}`);
    return Response.json(chunks.length === 1 ? { done: false } : uploaded);
  });
  assert.deepEqual(await uploadAdminImage(file, "local-test-code", "albums"), { imageUrl: uploaded.secure_url, width: 800, height: 1200 });
  assert.equal(chunks.length, 2);
  assert.equal(new Set(ids).size, 1);
  assert.deepEqual(Buffer.concat(chunks), Buffer.from(await file.arrayBuffer()));
});

test("authorization failure never sends image data to Cloudinary", async (t) => {
  let calls = 0;
  t.mock.method(globalThis, "fetch", async () => {
    calls++;
    return Response.json({ error: "No tienes permisos para subir imágenes." }, { status: 403 });
  });
  await assert.rejects(uploadAdminImage(webpFile(), "bad-code", "members"), /No tienes permisos/);
  assert.equal(calls, 1);
});

test("Cloudinary account limits and incomplete uploads produce actionable errors", async (t) => {
  let providerResult = Response.json({ error: { message: "File size too large. Got 10500000. Maximum is 10000000." } }, { status: 400 });
  t.mock.method(globalThis, "fetch", async (url) => url === "/api/admin/member-image"
    ? Response.json(createImageUploadSignature(input, credential))
    : providerResult);
  await assert.rejects(uploadAdminImage(webpFile(), "local-test-code", "albums"), /Cloudinary rechazó el tamaño/);
  providerResult = Response.json({ done: false });
  await assert.rejects(uploadAdminImage(webpFile(), "local-test-code", "albums"), /no confirmó/);
});
