import { MAX_IMAGE_BYTES, MAX_IMAGE_MB } from "./image-upload-limits.ts";

// Inspect bytes as mobile file pickers don't always provide the right MIME type.
export async function getOptimizedImageFormat(file: Blob): Promise<"webp" | "avif" | null> {
  const header = new Uint8Array(await file.slice(0, 128).arrayBuffer());
  const text = new TextDecoder("ascii").decode(header);
  if (text.startsWith("RIFF") && text.slice(8, 12) === "WEBP") return "webp";
  if (text.slice(4, 8) === "ftyp") {
    const size = new DataView(header.buffer).getUint32(0);
    const end = Math.min(size, header.length);
    for (let offset = 8; offset + 4 <= end; offset += 4) {
      if (offset === 12) continue;
      if (["avif", "avis"].includes(text.slice(offset, offset + 4))) return "avif";
    }
  }
  return null;
}

export async function prepareAdminImage(file: File): Promise<{ file: File; format: "webp" | "avif" }> {
  if (!file.size || file.size > MAX_IMAGE_BYTES) {
    throw new Error(`${file.name}: selecciona una imagen de hasta ${MAX_IMAGE_MB} MB.`);
  }
  const existingFormat = await getOptimizedImageFormat(file);
  if (existingFormat) return { file, format: existingFormat };
  try {
    const { default: imageCompression } = await import("browser-image-compression");
    const converted = await imageCompression(file, {
      fileType: "image/webp", initialQuality: 0.85,
      maxSizeMB: 8, maxWidthOrHeight: 4096,
      // Use the installed bundle; don't load executable worker code from a CDN.
      useWebWorker: false, preserveExif: false,
    });
    if (await getOptimizedImageFormat(converted) !== "webp") throw new Error("WebP encoding unavailable");
    return {
      file: new File([converted], `${file.name.replace(/\.[^.]+$/, "")}.webp`, { type: "image/webp" }),
      format: "webp",
    };
  } catch {
    throw new Error(`${file.name}: no pudimos convertir esta imagen a WebP en tu navegador. Si es HEIC u otro formato no compatible, expórtala como JPG o PNG e intenta de nuevo.`);
  }
}
