import test from "node:test";
import assert from "node:assert/strict";
import { absoluteUrl, pageMetadata, serializeJsonLd, site } from "../src/lib/seo.ts";

test("album metadata uses its own canonical, title and cover across social cards", () => {
  const metadata = pageMetadata({ title: "Nuestra previa | Chicas SC", description: "Un encuentro celeste.", path: "/albumes/nuestra-previa", image: "https://res.cloudinary.com/example/image/upload/cover.webp" });
  assert.equal(metadata.alternates.canonical, `${site.url}/albumes/nuestra-previa`);
  assert.equal(metadata.openGraph.url, metadata.alternates.canonical);
  assert.deepEqual(metadata.title, { absolute: "Nuestra previa | Chicas SC" });
  assert.equal(metadata.openGraph.images[0].url, metadata.twitter.images[0]);
  assert.equal(metadata.twitter.card, "summary_large_image");
  assert.equal(absoluteUrl("/sitemap.xml"), `${site.url}/sitemap.xml`);
});

test("structured data preserves editable album text without allowing script injection", () => {
  const payload = { name: "</script><script>alert('test')</script>", description: "Celeste & amigas" };
  const serialized = serializeJsonLd(payload);
  assert.equal(serialized.includes("<"), false);
  assert.deepEqual(JSON.parse(serialized), payload);
});
