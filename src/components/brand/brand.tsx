import Image from "next/image";
import Link from "next/link";

export function Brand() {
  return (
    <Link href="/#inicio" aria-label="Chicas SC, inicio" className="inline-flex shrink-0 rounded-lg focus-visible:outline-current">
      <Image
        src="/images/chicas-sc-logo-transparent.png"
        alt="Logo de Chicas SC"
        width={1080}
        height={1080}
        sizes="(min-width: 640px) 80px, 64px"
        className="size-16 object-contain drop-shadow-[0_1px_1px_rgba(0,46,121,0.28)] sm:size-20"
      />
    </Link>
  );
}
