import Image from "next/image";
import { Star, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { AlbumPhoto } from "@/features/albums/content";

export function AlbumPhotoList({ photos, onChange, disabled }: { photos: AlbumPhoto[]; onChange: (photos: AlbumPhoto[]) => void; disabled: boolean }) {
  return <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
    {photos.map((photo, index) => <div key={`${photo.src}-${index}`} className="overflow-hidden rounded-lg border bg-background shadow-xs">
      <div className="relative aspect-square"><Image src={photo.src} alt={photo.alt} fill sizes="160px" className="object-cover" /></div>
      <div className="px-2 pt-2"><Input value={photo.alt} maxLength={200} placeholder="Describe la foto" aria-label={`Texto alternativo de la foto ${index + 1}`} className="h-8 text-xs" disabled={disabled} onChange={(event) => onChange(photos.map((item, position) => position === index ? { ...item, alt: event.target.value } : item))} /></div>
      <div className="flex items-center justify-between gap-1 p-2">
        <span className="text-xs text-muted-foreground">{index === 0 ? "Portada" : `Foto ${index + 1}`}</span>
        <div className="flex gap-1">
          <Button type="button" size="icon-xs" variant="ghost" disabled={disabled || index === 0} aria-label={`Usar foto ${index + 1} como portada`} onClick={() => onChange([photo, ...photos.filter((_, position) => position !== index)])}><Star className={index === 0 ? "fill-primary text-primary" : ""} /></Button>
          <Button type="button" size="icon-xs" variant="ghost" className="text-destructive" disabled={disabled} aria-label={`Quitar foto ${index + 1}`} onClick={() => onChange(photos.filter((_, position) => position !== index))}><Trash2 /></Button>
        </div>
      </div>
    </div>)}
  </div>;
}
