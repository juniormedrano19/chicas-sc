import { z } from "zod";

export const MAX_IMAGE_BYTES = 10 * 1024 * 1024;
const uploadedImageSchema = z.object({ imageUrl: z.url(), width: z.number().positive(), height: z.number().positive() });
export type UploadedImage = z.infer<typeof uploadedImageSchema>;

export async function uploadAdminImage(file: File, code: string, section: "members" | "albums"): Promise<UploadedImage> {
  if (!file.size || file.size > MAX_IMAGE_BYTES) throw new Error(`${file.name}: selecciona una imagen de hasta 10 MB.`);
  const form = new FormData();
  form.set("image", file);
  form.set("section", section);
  const response = await fetch("/api/admin/member-image", { method: "POST", headers: { "x-admin-code": code }, body: form });
  const data: unknown = await response.json();
  if (!response.ok) {
    const error = z.object({ error: z.string() }).safeParse(data);
    throw new Error(error.success ? error.data.error : "No pudimos subir la imagen.");
  }
  const image = uploadedImageSchema.safeParse(data);
  if (!image.success) throw new Error("La imagen se subió, pero no pudimos obtener sus datos. Intenta nuevamente.");
  return image.data;
}
