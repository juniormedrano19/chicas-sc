import { z } from "zod";

export const contactSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Escribe tu nombre (al menos 2 caracteres).")
    .max(80, "Máximo 80 caracteres."),
  email: z
    .string()
    .trim()
    .min(1, "El correo electrónico es obligatorio.")
    .email("Escribe un correo electrónico válido.")
    .max(254, "Máximo 254 caracteres.")
    .transform((v) => v.toLowerCase().trim()),
  whatsapp: z
    .string()
    .trim()
    .min(9, "Escribe un número de celular válido (mínimo 9 dígitos).")
    .max(24, "Máximo 24 caracteres.")
    .regex(
      /^[+]?[(]?[0-9]{1,4}[)]?[-\s./0-9]{8,20}$/,
      "Escribe un número de celular válido (solo números, espacios o código +).",
    ),
  message: z
    .string()
    .trim()
    .min(10, "¿Qué tienes en mente? Cuéntanos un poco más (mínimo 10 caracteres).")
    .max(2000, "Máximo 2000 caracteres."),
  consent: z
    .boolean()
    .refine((v) => v === true, "Debes autorizar el uso de tus datos para responderte."),
  website: z.string().max(0, "No se pudo procesar el formulario."),
});

export type ContactInput = z.input<typeof contactSchema>;
export type ContactValidated = z.infer<typeof contactSchema>;
