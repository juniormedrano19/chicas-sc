import { z } from "zod";
export const contactSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Escribe al menos 2 caracteres.")
    .max(80, "Máximo 80 caracteres."),
  email: z
    .email("Escribe un correo válido.")
    .max(254)
    .transform((v) => v.toLowerCase().trim()),
  whatsapp: z
    .string()
    .trim()
    .max(24, "Máximo 24 caracteres.")
    .regex(/^[+\d\s()-]*$/, "Escribe un número de WhatsApp válido."),
  message: z
    .string()
    .trim()
    .min(10, "Cuéntanos un poco más (mínimo 10 caracteres).")
    .max(2000, "Máximo 2000 caracteres."),
  consent: z
    .boolean()
    .refine((v) => v, "Necesitamos tu autorización para responderte."),
  website: z.string().max(0, "No se pudo procesar el formulario."),
});
export type ContactInput = z.input<typeof contactSchema>;
