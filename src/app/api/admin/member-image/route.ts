import { collection, getDocs, query, where } from "firebase/firestore";
import { firestore } from "@/lib/firebase/client";
import { imageUploadRequestSchema } from "@/features/admin/image-upload-contract";
import { createImageUploadSignature } from "@/features/admin/image-upload-signature";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const reply = (body: unknown, status: number) => Response.json(body, { status, headers: { "Cache-Control": "no-store" } });
  const code = request.headers.get("x-admin-code");
  if (!code) return reply({ error: "Inicia sesión para subir imágenes." }, 401);
  if (!request.headers.get("content-type")?.includes("application/json")) {
    return reply({ error: "Actualiza la página para usar la nueva subida directa de imágenes." }, 415);
  }
  // This endpoint only signs metadata. Image bytes go directly to Cloudinary.
  const reader = request.body?.getReader();
  if (!reader) return reply({ error: "Faltan los datos de la imagen." }, 400);
  const chunks: Uint8Array[] = [];
  let bytes = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      bytes += value.byteLength;
      if (bytes > 2048) {
        await reader.cancel();
        return reply({ error: "Envía solo los datos de la imagen, no el archivo." }, 413);
      }
      chunks.push(value);
    }
  } catch {
    return reply({ error: "No pudimos leer los datos de la imagen." }, 400);
  }
  let body: unknown;
  try { body = JSON.parse(Buffer.concat(chunks).toString("utf8")); }
  catch { return reply({ error: "Los datos de la imagen no son válidos." }, 400); }
  const parsed = imageUploadRequestSchema.safeParse(body);
  if (!parsed.success) return reply({ error: "Selecciona una imagen válida de hasta 200 MB y una sección del panel." }, 422);

  try {
    const users = await getDocs(query(collection(firestore, "users"), where("codigo", "==", code)));
    const user = users.docs[0]?.data();
    if (!user || user.isBlocked || !["001", "002"].includes(user.idRol)) {
      return reply({ error: "No tienes permisos para subir imágenes." }, 403);
    }
  } catch {
    return reply({ error: "No pudimos verificar tu acceso al panel. Intenta nuevamente." }, 503);
  }
  try {
    return reply(createImageUploadSignature(parsed.data, process.env.CLOUDINARY_URL ?? ""), 200);
  } catch {
    // Never log credentials, signatures or the admin access code.
    console.error("Image upload: invalid CLOUDINARY_URL server configuration");
    return reply({ error: "La subida de imágenes no está configurada. Revisa CLOUDINARY_URL en el servidor." }, 503);
  }
}
