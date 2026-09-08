import Image from "next/image";

export function ChicasSCBanner() {
  return (
    <section aria-label="Chicas SC" className="overflow-hidden bg-[#6ac5fd]">
      <Image
        src="/images/chicas-sc-banner2.png"
        alt="Chicas SC · Fuerza Cristal"
        width={1600}
        height={380}
        sizes="100vw"
        className="h-auto w-full"
      />
    </section>
  );
}
