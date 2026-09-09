"use client";

import { ArrowRight, LoaderCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useContactForm } from "./hooks/use-contact-form";

export interface ContactFormProps {
  enabled?: boolean;
}

export function ContactForm({ enabled = true }: ContactFormProps) {
  const {
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
  } = useContactForm({ enabled });

  return (
    <form
      onSubmit={handleSubmit(async (v) => {
        try {
          await onSubmit(v);
        } catch {
          /* Sonner muestra el error; se preserva el borrador */
        }
      })}
      noValidate
      className="py-4 text-center lg:px-8 lg:text-left"
    >
      <p className="eyebrow mb-3">Hablemos</p>
      <h3 className="font-display text-[22px] font-semibold uppercase leading-11 lg:text-4xl">
        Tu mensaje es el comienzo.
      </h3>

      <div className="mt-7 space-y-5">
        <div>
          <Label htmlFor="name" className="mb-2">
            ¿Cómo te llamas? (*)
          </Label>
          <Input
            id="name"
            autoComplete="name"
            placeholder="Tu nombre"
            maxLength={80}
            disabled={isSubmitting}
            className="h-12 bg-white"
            aria-invalid={!!errors.name}
            aria-describedby={errors.name ? "name-error" : undefined}
            {...register("name")}
          />
          {errors.name && (
            <p id="name-error" className="mt-1 text-sm text-destructive">
              {errors.name.message}
            </p>
          )}
        </div>

        <div>
          <Label htmlFor="email" className="mb-2">
            Tu correo electrónico (*)
          </Label>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            placeholder="hola@ejemplo.com"
            maxLength={254}
            disabled={isSubmitting}
            className="h-12 bg-white"
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? "email-error" : undefined}
            {...register("email")}
          />
          {errors.email && (
            <p id="email-error" className="mt-1 text-sm text-destructive">
              {errors.email.message}
            </p>
          )}
        </div>

        <div>
          <Label htmlFor="whatsapp" className="mb-2">
            Número de celular / WhatsApp (*)
          </Label>
          <Input
            id="whatsapp"
            type="tel"
            autoComplete="tel"
            inputMode="tel"
            placeholder="+51 999 999 999"
            maxLength={24}
            disabled={isSubmitting}
            className="h-12 bg-white"
            aria-invalid={!!errors.whatsapp}
            aria-describedby={errors.whatsapp ? "whatsapp-error" : undefined}
            {...register("whatsapp")}
          />
          {errors.whatsapp && (
            <p id="whatsapp-error" className="mt-1 text-sm text-destructive">
              {errors.whatsapp.message}
            </p>
          )}
        </div>

        <div>
          <Label htmlFor="message" className="mb-2">
            ¿Qué tienes en mente? (*)
          </Label>
          <Textarea
            id="message"
            placeholder="Quiero ser parte de Chicas SC…"
            rows={4}
            maxLength={2000}
            disabled={isSubmitting}
            className="min-h-28 bg-white resize-none"
            aria-invalid={!!errors.message}
            aria-describedby={errors.message ? "message-error" : undefined}
            {...register("message")}
          />
          {errors.message && (
            <p id="message-error" className="mt-1 text-sm text-destructive">
              {errors.message.message}
            </p>
          )}
        </div>

        <div className="hidden" aria-hidden="true">
          <label htmlFor="website">Sitio web</label>
          <Input
            id="website"
            tabIndex={-1}
            autoComplete="off"
            {...register("website")}
          />
        </div>

        <div>
          <div className="flex items-center gap-2">
            <Checkbox
              id="consent"
              checked={consent}
              disabled={isSubmitting}
              onCheckedChange={(v) => {
                const isChecked = v === true;
                setValue("consent", isChecked, { shouldValidate: true });
                if (!isChecked) {
                  clearErrors("consent");
                }
              }}
              aria-invalid={!sent && !!errors.consent}
              aria-describedby="privacy-note"
            />
            <Label
              htmlFor="consent"
              className="text-sm font-normal leading-relaxed"
            >
              Autorizo el uso de mis datos para responder a este mensaje. (*)
            </Label>
          </div>
          {!sent && errors.consent && (
            <p className="mt-1 text-sm text-destructive">
              {errors.consent.message}
            </p>
          )}
        </div>

        <Button
          type="submit"
          disabled={!isValid || isSubmitting || !enabled}
          size="lg"
          className="w-full rounded-full bg-secondary text-white hover:bg-secondary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          {isSubmitting ? (
            <span className="inline-flex items-center gap-2">
              <LoaderCircle className="size-5 animate-spin" />
              <span>Enviando mensaje…</span>
            </span>
          ) : (
            <span className="inline-flex items-center gap-2">
              <span>Enviar mensaje</span>
              <ArrowRight className="size-4" />
            </span>
          )}
        </Button>

        {sent && enabled && (
          <p role="status" className="text-sm font-medium text-secondary">
            ¡Mensaje recibido! Gracias por escribirnos.
          </p>
        )}
      </div>
    </form>
  );
}
