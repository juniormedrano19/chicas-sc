import { z } from "zod";
import { MAX_IMAGE_BYTES, MAX_IMAGE_MB } from "./image-upload-limits";

export { MAX_IMAGE_BYTES } from "./image-upload-limits";
const uploadedImageSchema = z.object({ imageUrl: z.url(), width: z.number().positive(), height: z.number().positive() });
export type UploadedImage = z.infer<typeof uploadedImageSchema>;

export async function uploadAdminImage(file: File, code: string, section: "members" | "albums"): Promise<UploadedImage> {
  if (!file.size || file.size > MAX_IMAGE_BYTES) throw new Error(`${file.name}: selecciona una imagen de hasta ${MAX_IMAGE_MB} MB.`);
  const form = new FormData();
  form.set("image", file);
  form.set("section", section);
  const response = await fetch("/api/admin/member-image", { method: "POST", headers: { "x-admin-code": code }, body: form });
  if (response.status === 413) throw new Error("El servidor rechazó el tamaño del archivo. El alojamiento tiene un límite de carga inferior a 200 MB.");
  const data: unknown = await response.json();
  if (!response.ok) {
    const error = z.object({ error: z.string() }).safeParse(data);
    throw new Error(error.success ? error.data.error : "No pudimos subir la imagen.");
  }
  const image = uploadedImageSchema.safeParse(data);
  if (!image.success) throw new Error("La imagen se subió, pero no pudimos obtener sus datos. Intenta nuevamente.");
  return image.data;
}
