import { initializeApp } from "firebase/app";
import { collection, doc, getDocsFromServer, runTransaction, getFirestore, terminate } from "firebase/firestore";
import { v2 as cloudinary } from "cloudinary";
import sharp from "sharp";

if (!process.env.CLOUDINARY_URL) throw new Error("Missing CLOUDINARY_URL in .env.local.");
cloudinary.config({ secure: true });
const firestore = getFirestore(initializeApp({
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
}));

let migrated = 0;
let skipped = 0;
let failed = 0;
try {
  const teams = await getDocsFromServer(collection(firestore, "teams"));
  for (const team of teams.docs) {
    const source = team.data().logoUrl;
    if (typeof source !== "string" || !source) { failed++; console.log(`Missing logo: ${team.id}`); continue; }
    const url = new URL(source);
    if (url.hostname === "res.cloudinary.com") { skipped++; continue; }
    if (url.protocol !== "https:" || url.hostname !== "img.sofascore.com") {
      skipped++; console.log(`Unchanged external source: ${team.id}`); continue;
    }
    try {
      const response = await fetch(source, { signal: AbortSignal.timeout(15000) });
      if (!response.ok) throw new Error(`Source returned HTTP ${response.status}`);
      const input = Buffer.from(await response.arrayBuffer());
      const metadata = await sharp(input, { limitInputPixels: 16_000_000 }).metadata();
      const isAvif = metadata.format === "heif" && metadata.compression === "av1";
      const preserve = metadata.format === "webp" || isAvif;
      const buffer = preserve ? input : await sharp(input).rotate().webp({ quality: 90 }).toBuffer();
      const result = await new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream({
          asset_folder: "chicas-sc/equipos", public_id: `chicas-sc/equipos/${team.id}`,
          overwrite: false, resource_type: "image", format: isAvif ? "avif" : "webp",
        }, (error, result) => error ? reject(error) : resolve(result)).end(buffer);
      });
      // Preserve a logo changed by an administrator while this migration ran.
      const updated = await runTransaction(firestore, async (transaction) => {
        const ref = doc(firestore, "teams", team.id);
        const current = await transaction.get(ref);
        if (!current.exists() || current.data().logoUrl !== source) return false;
        transaction.update(ref, { logoUrl: result.secure_url });
        return true;
      });
      if (updated) { migrated++; console.log(`Migrated: ${team.id} (${team.data().name})`); }
      else { skipped++; console.log(`Changed concurrently, preserved: ${team.id}`); }
    } catch (error) {
      failed++;
      console.log(`Failed: ${team.id} (${team.data().name}): ${error.message ?? "Upload failed"}`);
    }
  }
  console.log(JSON.stringify({ total: teams.size, migrated, skipped, failed }));
  if (failed) process.exitCode = 1;
} finally {
  await terminate(firestore);
}
