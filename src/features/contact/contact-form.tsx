"use client";

import { ArrowRight, LoaderCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useContactForm } from "./hooks/use-contact-form";

export interface ContactFormProps {
  enabled: boolean;
}

export function ContactForm({ enabled }: ContactFormProps) {
  const {
    register,
    handleSubmit,
    setValue,
    consent,
    sent,
    errors,
    isSubmitting,
    onSubmit,
  } = useContactForm({ enabled });

  return (
    <form
      onSubmit={handleSubmit(async (v) => {
        try {
          await onSubmit(v);
        } catch {
          /* The toast reports failure; preserve draft. */
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
            ¿Cómo te llamas?
          </Label>
          <Input
            id="name"
            autoComplete="name"
            placeholder="Tu nombre"
            maxLength={80}
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
            Tu correo electrónico
          </Label>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            placeholder="hola@ejemplo.com"
            maxLength={254}
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
            Número de WhatsApp
          </Label>
          <Input
            id="whatsapp"
            type="tel"
            autoComplete="tel"
            inputMode="tel"
            placeholder="+51 999 999 999"
            maxLength={24}
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
            ¿Qué tienes en mente?
          </Label>
          <Textarea
            id="message"
            placeholder="Quiero ser parte de Chicas SC…"
            rows={4}
            maxLength={2000}
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
          <div className="flex items-start gap-3">
            <Checkbox
              id="consent"
              checked={consent}
              onCheckedChange={(v) =>
                setValue("consent", v === true, { shouldValidate: true })
              }
              aria-invalid={!!errors.consent}
              aria-describedby="privacy-note"
            />
            <Label
              htmlFor="consent"
              className="text-sm font-normal leading-relaxed"
            >
              Autorizo el uso de mis datos para responder a este mensaje.
            </Label>
          </div>
          {errors.consent && (
            <p className="mt-1 text-sm text-destructive">
              {errors.consent.message}
            </p>
          )}
        </div>

        <Button
          type="submit"
          disabled={isSubmitting || !enabled}
          size="lg"
          className="w-full rounded-full bg-secondary text-white hover:bg-secondary/90"
        >
          {isSubmitting ? (
            <>
              <LoaderCircle className="animate-spin" />
              Enviando…
            </>
          ) : (
            <>
              Enviar mensaje <ArrowRight />
            </>
          )}
        </Button>

        {sent && enabled && (
          <p role="status" className="text-sm">
            ¡Mensaje recibido! Gracias por escribirnos.
          </p>
        )}
      </div>
    </form>
  );
}
