import { z } from "zod";

const imageUrl = z.url("Carga una foto antes de guardar.");
export const memberEditorSchema = z.object({
  name: z.string().trim().min(1, "Escribe el nombre.").max(100, "Máximo 100 caracteres."),
  imageUrl,
  birthDate: z.union([z.literal(""), z.iso.date("Ingresa una fecha válida.")]).refine((value) => {
    if (!value) return true;
    const date = new Date(`${value}T00:00:00`);
    return !Number.isNaN(date.getTime()) && date <= new Date();
  }, "Ingresa una fecha válida que no sea futura."),
});
export const testimonialEditorSchema = z.object({
  memberId: z.string().min(1, "Selecciona una integrante."),
  text: z.string().trim().min(1, "Escribe el testimonio.").max(2000, "Máximo 2000 caracteres."),
});
export const albumPhotoSchema = z.object({ src: imageUrl, alt: z.string(), caption: z.string(), width: z.number().positive(), height: z.number().positive() });
export const albumEditorSchema = z.object({
  title: z.string().trim().min(1, "Escribe el título.").max(120, "Máximo 120 caracteres."),
  description: z.string().trim().min(1, "Escribe una descripción.").max(1000, "Máximo 1000 caracteres."),
  slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Usa letras minúsculas, números y guiones; por ejemplo: nuestras-previas."),
  photos: z.array(albumPhotoSchema).min(1, "Agrega al menos una foto.").max(100, "El máximo es 100 fotos por álbum."),
});
