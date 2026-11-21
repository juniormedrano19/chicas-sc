"use client";

import { useId, type ReactNode } from "react";
import { Field, FieldLabel, FieldDescription, FieldError } from "@/components/ui/field";

interface ControlProps {
  id: string;
  "aria-invalid": boolean;
  "aria-describedby": string | undefined;
}

export function EditorField({ label, description, error, children }: {
  label: string;
  description?: string;
  error?: string;
  children: (props: ControlProps) => ReactNode;
}) {
  const id = useId();
  const describedBy = [description && `${id}-description`, error && `${id}-error`].filter(Boolean).join(" ") || undefined;
  return <Field data-invalid={!!error}>
    <FieldLabel htmlFor={id}>{label}</FieldLabel>
    {children({ id, "aria-invalid": !!error, "aria-describedby": describedBy })}
    {description && <FieldDescription id={`${id}-description`}>{description}</FieldDescription>}
    {error && <FieldError id={`${id}-error`}>{error}</FieldError>}
  </Field>;
}
