import Image from "next/image";
import { Shield } from "lucide-react";

export type LogoStatus = "loaded" | "error";

export function TeamLogo({ src, name, status, onSettled }: {
  src: string;
  name: string;
  status?: LogoStatus;
  onSettled: (src: string, status: LogoStatus) => void;
}) {
  if (status === "error") {
    return <span role="img" aria-label={`Escudo de ${name} no disponible`} className="flex size-11 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground"><Shield className="size-7" aria-hidden="true" /></span>;
  }
  return <Image className="size-11 shrink-0 object-contain" src={src} alt={`Escudo de ${name}`} width={44} height={44}
    onLoad={() => onSettled(src, "loaded")} onError={() => onSettled(src, "error")} />;
}
