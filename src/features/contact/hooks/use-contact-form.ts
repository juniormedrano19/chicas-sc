"use client";

import { useState, useCallback } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { contactSchema, type ContactInput } from "../schema";

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
    formState: { errors, isSubmitting },
  } = useForm<ContactInput>({
    resolver: zodResolver(contactSchema),
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
        toast.info("El canal de contacto todavía no está habilitado.");
        return;
      }
      try {
        const response = await fetch("/api/contact", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(values),
        });
        const data = await response.json();
        if (!response.ok) {
          throw new Error(
            data.error || "No pudimos enviar tu mensaje. Intenta de nuevo.",
          );
        }
        toast.success("¡Mensaje recibido! Gracias por escribirnos.");
        reset();
        setSent(true);
      } catch (error) {
        toast.error(
          error instanceof Error
            ? error.message
            : "No pudimos enviar tu mensaje.",
        );
        throw error;
      }
    },
    [enabled, reset],
  );

  return {
    register,
    handleSubmit,
    setValue,
    control,
    consent,
    sent,
    errors,
    isSubmitting,
    onSubmit,
  };
}
