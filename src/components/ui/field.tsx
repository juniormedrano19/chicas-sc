import type { ComponentProps } from "react";
import { cn } from "cn";
import { Label } from "./label";

function Field({ className, ...props }: ComponentProps<"div">) {
  return <div data-slot="field" role="group" className={cn("grid gap-2", className)} {...props} />;
}
function FieldLabel(props: ComponentProps<typeof Label>) {
  return <Label data-slot="field-label" {...props} />;
}
function FieldDescription({ className, ...props }: ComponentProps<"p">) {
  return <p data-slot="field-description" className={cn("text-xs leading-relaxed text-muted-foreground", className)} {...props} />;
}
function FieldError({ className, ...props }: ComponentProps<"p">) {
  return <p data-slot="field-error" role="alert" className={cn("text-xs font-medium text-destructive", className)} {...props} />;
}
export { Field, FieldLabel, FieldDescription, FieldError };
