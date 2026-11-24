import { z } from "zod";
import { MAX_IMAGE_BYTES } from "./image-upload-limits.ts";

export const imageUploadRequestSchema = z.object({
  section: z.enum(["members", "albums"]),
  format: z.enum(["webp", "avif"]),
  size: z.number().int().positive().max(MAX_IMAGE_BYTES),
}).strict();

export const imageUploadSignatureSchema = z.object({
  cloudName: z.string().regex(/^[a-z0-9_-]+$/i),
  apiKey: z.string().min(1),
  signature: z.string().min(1),
  params: z.object({
    timestamp: z.number().int().positive(),
    public_id: z.string().min(1),
    asset_folder: z.string().min(1),
    overwrite: z.literal(false),
    allowed_formats: z.enum(["webp", "avif"]),
    format: z.enum(["webp", "avif"]),
  }),
});

export const uploadedImageSchema = z.object({
  imageUrl: z.url(), width: z.number().positive(), height: z.number().positive(),
});
export type UploadedImage = z.infer<typeof uploadedImageSchema>;
export type ImageUploadRequest = z.infer<typeof imageUploadRequestSchema>;
export type ImageUploadSignature = z.infer<typeof imageUploadSignatureSchema>;
