"use client";
import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { ArrowRight, LoaderCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { contactSchema, type ContactInput } from "./schema";
export function ContactForm({ enabled }: { enabled: boolean }) {
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
  const [sent, setSent] = useState(false);
  const submit = async (values: ContactInput) => {
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
      if (!response.ok)
        throw new Error(
          data.error || "No pudimos enviar tu mensaje. Intenta de nuevo.",
        );
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
  };
  return (
    <form
      onSubmit={handleSubmit(async (v) => {
        try {
          await submit(v);
        } catch {
          /* The toast reports failure; preserve the draft. */
        }
      })}
      noValidate
      className="py-4 text-center lg:text-left lg:px-8 "
    >
      <p className="eyebrow mb-3">Hablemos</p>
      <h3 className="font-display text-[22px] lg:text-4xl font-semibold uppercase leading-11">
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
            WhatsApp <span className="text-muted-foreground">(opcional)</span>
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
            className="min-h-28 bg-white"
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
