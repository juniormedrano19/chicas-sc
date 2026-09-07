import { PaintReveal, ParallaxLayer } from "@/components/motion/scroll-reveal";
export function Hero() {
  return (
    <section
      id="inicio"
      className="relative isolate flex min-h-[100svh] overflow-hidden bg-secondary"
    >
      <div className="flex min-h-[100svh] w-full flex-1">
        <div className="relative flex min-h-[100svh] w-full overflow-hidden bg-white">
          <ParallaxLayer
            imageUrl="/images/chicas-sc-hero-stadium.png"
            className="absolute -inset-y-[6%] inset-x-0 bg-cover bg-[position:58%_center] sm:bg-center"
          />
          <p
            aria-hidden="true"
            className="pointer-events-none absolute bottom-[3%] left-[47%] -translate-x-1/2 whitespace-nowrap font-display text-[clamp(4.5rem,65vw,75rem)] font-bold uppercase leading-[.75] tracking-[-.08em] text-white"
          >
            SC
          </p>
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-[url('/images/chicas-sc-hero-foreground-transparent-v3.png')] bg-cover bg-[position:58%_center] brightness-110 contrast-105 drop-shadow-[0_12px_24px_rgba(0,0,0,0.35)] sm:bg-center"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute left-0 top-0 h-[42%] w-[78%] bg-[radial-gradient(ellipse_75%_85%_at_8%_0%,rgba(0,0,0,0.72)_0%,rgba(0,0,0,0.38)_45%,transparent_78%)]"
          />

        </div>
      </div>
    </section>
  );
}

export function PassionIntro() {
  return (
    <PaintReveal className="text-secondary">
      <div className="wrap flex min-h-[min(48rem,100svh)] flex-col py-16 sm:py-20 lg:py-24 ">

        {/* font-[family-name:var(--font-sacramento)] */}

        <h2 className=" text-[100px] font-normal leading-[.95] tracking-normal text-white">
          &ldquo;Somos la fuerza ganadora

          siempre <span className="text-secondary [-webkit-text-stroke:2px_#fff] [paint-order:stroke_fill]">campeones  </span> siempre primeros, [...] , la actitud positiva que tenemos hará que siempre seamos      <span className="text-secondary [-webkit-text-stroke:2px_#fff] [paint-order:stroke_fill]">campeones  </span>...&rdquo;



        </h2>





      </div>
    </PaintReveal>
  );
}
