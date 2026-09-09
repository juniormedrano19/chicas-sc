"use client";

import { useState, useCallback } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { contactSchema, type ContactInput } from "../schema";
import { contactRepository } from "../repository";

export interface UseContactFormProps {
  enabled: boolean;
}

export function useContactForm({ enabled }: UseContactFormProps) {
  const [sent, setSent] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    control,
    reset,
    clearErrors,
    formState: { errors, isSubmitting, isValid },
  } = useForm<ContactInput>({
    resolver: zodResolver(contactSchema),
    mode: "onChange",
    defaultValues: {
      name: "",
      email: "",
      whatsapp: "",
      message: "",
      consent: false,
      website: "",
    },
  });

  const consent = useWatch({ control, name: "consent" });

  const onSubmit = useCallback(
    async (values: ContactInput) => {
      setSent(false);

      if (!enabled) {
        toast.info("El canal de contacto todavía no está habilitado.", {
          position: "top-right",
          duration: 4000,
        });
        return;
      }

      try {
        // Pausa visible para que el spinner dé feedback claro
        await Promise.all([
          contactRepository.submit(values),
          new Promise((resolve) => setTimeout(resolve, 1800)),
        ]);

        toast.success("¡Mensaje enviado con éxito!", {
          description: "Gracias por escribirnos. Nos pondremos en contacto contigo pronto.",
          position: "top-right",
          duration: 7000,
        });

        reset({
          name: "",
          email: "",
          whatsapp: "",
          message: "",
          consent: false,
          website: "",
        });
        clearErrors();
        setSent(true);
      } catch (error) {
        console.error("Error al enviar mensaje a Firebase:", error);
        toast.error("No pudimos enviar tu mensaje.", {
          description: "Por favor revisa tu conexión o intenta nuevamente en unos minutos.",
          position: "top-right",
          duration: 6000,
        });
        throw error;
      }
    },
    [enabled, reset, clearErrors],
  );

  return {
    register,
    handleSubmit,
    setValue,
    consent,
    sent,
    errors,
    clearErrors,
    isSubmitting,
    isValid,
    onSubmit,
  };
}
