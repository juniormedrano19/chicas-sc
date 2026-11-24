"use client";

import { useRef } from "react";
import { ImagePlus, LoaderCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EditorField } from "./editor-field";
import { MAX_IMAGE_MB } from "../../image-upload-limits";

export function ImageUploadField({ count, multiple = false, disabled, uploading, error, onFiles }: {
  count: number;
  multiple?: boolean;
  disabled: boolean;
  uploading: boolean;
  error?: string;
  onFiles: (files: File[]) => void;
}) {
  const input = useRef<HTMLInputElement>(null);
  return <EditorField label={multiple ? "Fotos del álbum" : "Foto de la integrante"} error={error}
    description={multiple ? `Hasta 100 fotos de ${MAX_IMAGE_MB} MB cada una. La primera será la portada.` : `Una foto de hasta ${MAX_IMAGE_MB} MB. Aparecerá en su tarjeta y sus testimonios.`}>
    {(props) => <div className="rounded-xl border border-dashed border-input bg-muted/30 p-4">
      <input ref={input} type="file" accept="image/*" multiple={multiple} hidden disabled={disabled}
        onChange={(event) => { const files = Array.from(event.target.files ?? []); event.target.value = ""; onFiles(files); }} />
      <div className="flex flex-wrap items-center gap-3">
        <Button {...props} type="button" variant="outline" disabled={disabled} onClick={() => input.current?.click()}>
          {uploading ? <LoaderCircle className="size-4 animate-spin" /> : <ImagePlus className="size-4" />}
          {uploading ? "Subiendo…" : multiple ? "Subir fotos" : count ? "Cambiar foto" : "Subir foto"}
        </Button>
        <span aria-live="polite" className="text-xs text-muted-foreground">{count ? `${count} ${count === 1 ? "foto cargada" : "fotos cargadas"}` : "Sin fotos todavía"}</span>
      </div>
    </div>}
  </EditorField>;
}
