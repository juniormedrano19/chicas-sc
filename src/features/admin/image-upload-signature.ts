import { v2 as cloudinary } from "cloudinary";
import { randomUUID } from "node:crypto";
import type { ImageUploadRequest, ImageUploadSignature } from "./image-upload-contract.ts";

export function createImageUploadSignature(input: ImageUploadRequest, environmentUrl: string): ImageUploadSignature {
  const config = new URL(environmentUrl);
  const apiKey = decodeURIComponent(config.username);
  const apiSecret = decodeURIComponent(config.password);
  const cloudName = config.hostname;
  if (config.protocol !== "cloudinary:" || !apiKey || !apiSecret || !/^[a-z0-9_-]+$/i.test(cloudName)) {
    throw new Error("Invalid Cloudinary configuration");
  }
  const folder = `chicas-sc/${input.section === "albums" ? "albumes" : "integrantes"}`;
  const params = {
    timestamp: Math.floor(Date.now() / 1000),
    public_id: `${folder}/${randomUUID()}`,
    asset_folder: folder,
    overwrite: false as const,
    allowed_formats: input.format,
    format: input.format,
  };
  return { cloudName, apiKey, params, signature: cloudinary.utils.api_sign_request(params, apiSecret) };
}
