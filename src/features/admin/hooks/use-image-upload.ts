"use client";

import { useState } from "react";
import { useAdminStore } from "../store/use-admin-store";
import { uploadAdminImage, type UploadedImage } from "../image-upload";

export function useImageUpload(section: "members" | "albums", onUploaded: (image: UploadedImage, file: File) => void) {
  const code = useAdminStore((state) => state.session?.user.codigo ?? "");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  async function upload(files: File[]) {
    if (!files.length) return;
    setUploading(true);
    setError(null);
    try {
      for (const file of files) onUploaded(await uploadAdminImage(file, code, section), file);
    } catch (error) {
      setError(error instanceof Error ? error.message : "No pudimos subir las imágenes.");
    } finally { setUploading(false); }
  }
  return { upload, uploading, error };
}
