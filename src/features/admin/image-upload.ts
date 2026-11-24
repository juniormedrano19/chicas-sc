import { z } from "zod";
import { imageUploadSignatureSchema, uploadedImageSchema, type ImageUploadSignature } from "./image-upload-contract.ts";
import { prepareAdminImage } from "./prepare-image.ts";

export { MAX_IMAGE_BYTES } from "./image-upload-limits.ts";
export type { UploadedImage } from "./image-upload-contract.ts";

const CHUNK_BYTES = 6 * 1024 * 1024;
const cloudinaryResultSchema = z.object({
  secure_url: z.url().refine((url) => new URL(url).protocol === "https:"),
  width: z.number().positive(), height: z.number().positive(),
  format: z.enum(["webp", "avif"]),
});

async function readResponse(response: Response): Promise<unknown> {
  const data: unknown = await response.json().catch(() => null);
  if (response.ok) return data;
  const error = z.object({ error: z.string() }).safeParse(data);
  if (error.success) throw new Error(error.data.error);
  const providerError = z.object({ error: z.object({ message: z.string() }) }).safeParse(data);
  if (providerError.success) {
    const message = providerError.data.error.message;
    if (/size|too large|too big|maximum.*bytes/i.test(message)) {
      throw new Error("Cloudinary rechazó el tamaño de la imagen por el límite de tu cuenta. Reduce el archivo o revisa el máximo permitido en Cloudinary.");
    }
    if (/invalid image|unsupported.*(format|file)|not allowed|cannot.*(decode|image)/i.test(message)) {
      throw new Error("Cloudinary no reconoce esta imagen o su formato. Prueba exportándola nuevamente como JPG, PNG, WebP o AVIF.");
    }
    throw new Error("Cloudinary rechazó la subida. Revisa las credenciales, los permisos y el estado de la cuenta.");
  }
  throw new Error(`No pudimos subir la imagen (HTTP ${response.status}). Intenta nuevamente.`);
}

async function uploadToCloudinary(file: File, authorization: ImageUploadSignature) {
  const url = `https://api.cloudinary.com/v1_1/${authorization.cloudName}/image/upload`;
  const uploadId = crypto.randomUUID();
  let result: unknown;
  for (let start = 0; start < file.size; start += CHUNK_BYTES) {
    const end = Math.min(start + CHUNK_BYTES, file.size);
    const form = new FormData();
    for (const [key, value] of Object.entries(authorization.params)) form.set(key, String(value));
    form.set("api_key", authorization.apiKey);
    form.set("signature", authorization.signature);
    form.set("file", file.slice(start, end, file.type), file.name);
    const headers: Record<string, string> = file.size > CHUNK_BYTES ? {
      "X-Unique-Upload-Id": uploadId,
      "Content-Range": `bytes ${start}-${end - 1}/${file.size}`,
    } : {};
    let response: Response;
    try { response = await fetch(url, { method: "POST", headers, body: form }); }
    catch { throw new Error("No pudimos conectar con Cloudinary. Comprueba tu conexión y vuelve a intentar."); }
    result = await readResponse(response);
  }
  const uploaded = cloudinaryResultSchema.safeParse(result);
  if (!uploaded.success) throw new Error("Cloudinary no confirmó que la subida se completara. Intenta nuevamente.");
  return uploadedImageSchema.parse({ imageUrl: uploaded.data.secure_url, width: uploaded.data.width, height: uploaded.data.height });
}

export async function uploadAdminImage(file: File, code: string, section: "members" | "albums") {
  const prepared = await prepareAdminImage(file);
  const response = await fetch("/api/admin/member-image", {
    method: "POST",
    headers: { "x-admin-code": code, "Content-Type": "application/json" },
    body: JSON.stringify({ section, format: prepared.format, size: prepared.file.size }),
  });
  const authorization = imageUploadSignatureSchema.safeParse(await readResponse(response));
  if (!authorization.success) throw new Error("No pudimos autorizar la subida. Actualiza la página e intenta nuevamente.");
  return uploadToCloudinary(prepared.file, authorization.data);
}
