import { v2 as cloudinary } from "cloudinary";
import sharp from "sharp";
import { collection, getDocs, query, where } from "firebase/firestore";
import { firestore } from "@/lib/firebase/client";
import { MAX_IMAGE_BYTES, MAX_IMAGE_MB } from "@/features/admin/image-upload-limits";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const code = request.headers.get("x-admin-code");
    if (!code) return Response.json({ error: "Inicia sesión para subir imágenes." }, { status: 401 });
    const users = await getDocs(query(collection(firestore, "users"), where("codigo", "==", code)));
    const user = users.docs[0]?.data();
    if (!user || user.isBlocked || !["001", "002"].includes(user.idRol)) {
      return Response.json({ error: "No tienes permisos para subir imágenes." }, { status: 403 });
    }
    if (!process.env.CLOUDINARY_URL) throw new Error("Cloudinary no está configurado.");
    cloudinary.config({ secure: true });
    const form = await request.formData();
    const section = form.get("section") === "albums" ? "albumes" : "integrantes";
    const file = form.get("image");
    if (!(file instanceof File) || !file.size || file.size > MAX_IMAGE_BYTES) {
      return Response.json({ error: `Selecciona una imagen de hasta ${MAX_IMAGE_MB} MB.` }, { status: 400 });
    }
    const input = Buffer.from(await file.arrayBuffer());
    const metadata = await sharp(input, { limitInputPixels: 40_000_000 }).metadata();
    const isAvif = metadata.format === "heif" && metadata.compression === "av1";
    const preserve = metadata.format === "webp" || isAvif;
    const buffer = preserve ? input : await sharp(input).rotate().webp({ quality: 85 }).toBuffer();
    const result = await new Promise<{ secure_url: string; width: number; height: number }>((resolve, reject) => {
      cloudinary.uploader.upload_stream({
        asset_folder: `chicas-sc/${section}`,
        public_id: `chicas-sc/${section}/${crypto.randomUUID()}`,
        resource_type: "image",
        format: isAvif ? "avif" : "webp",
      }, (error, result) => {
        if (error || !result) reject(error ?? new Error("Error al subir la imagen."));
        else resolve(result);
      }).end(buffer);
    });
    return Response.json({ imageUrl: result.secure_url, width: result.width, height: result.height });
  } catch (error) {
    console.error("Member image upload failed:", error);
    return Response.json({ error: "No pudimos procesar la imagen. Prueba con JPG, PNG, WebP o AVIF." }, { status: 500 });
  }
}
