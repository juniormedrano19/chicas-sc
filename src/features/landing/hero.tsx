import { ArrowDown, ArrowRight, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
export function Hero() {
  return (
    <section
      id="inicio"
      className="relative isolate flex min-h-[100svh] overflow-hidden bg-secondary"
    >
      <div className="flex min-h-[100svh] w-full flex-1">
        <div className="relative flex min-h-[100svh] w-full overflow-hidden bg-white">
          <div
            role="img"
            aria-label="Las integrantes de Chicas SC en el estadio"
            className="absolute inset-0 bg-[url('/images/chicas-sc-hero-stadium.png')] bg-cover bg-[position:58%_center] sm:bg-center"
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
    <section className="bg-primary text-secondary">
      <div className="wrap flex min-h-[min(48rem,100svh)] flex-col justify-between py-16 sm:py-20 lg:py-24">
        <div className="flex items-center gap-3 eyebrow">
          <span className="size-2 shrink-0 rounded-full bg-secondary" />
          ¡Sporting Cristal es de su gente!
        </div>

        <div className="grid items-center gap-10 py-12 lg:grid-cols-[minmax(0,1.35fr)_minmax(280px,.65fr)] lg:gap-20">
          <h2 className="display text-[clamp(3.5rem,8.5vw,8rem)] text-white">
            La pasión
            <br />
            nos hace
            <br />
            <span>familia.</span>
          </h2>

          <div>
            <span className="mb-8 inline-flex size-16 rotate-12 items-center justify-center rounded-full border border-secondary/35 sm:size-20">
              <Heart className="size-7 sm:size-8" strokeWidth={1.2} />
            </span>
            <p className="max-w-md text-lg leading-relaxed sm:text-xl">
              Somos Chicas SC. Nos une la celeste, nos mueve la amistad y nos
              encontramos donde late nuestra pasión.
            </p>
            <Button
              asChild
              size="lg"
              className="mt-8 min-h-11 w-full rounded-full bg-secondary px-7 text-white hover:bg-secondary/90 sm:w-auto"
            >
              <a href="#nosotras">
                Conoce a las chicas <ArrowRight />
              </a>
            </Button>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-secondary/20 pt-5 text-xs font-semibold uppercase tracking-widest">
          <span>Celestes de corazón · Lima, Perú</span>
          <a
            href="#partidos"
            className="flex items-center gap-3 transition-opacity hover:opacity-70"
          >
            <span>Sigue la pasión</span>
            <ArrowDown className="size-4" />
          </a>
        </div>
      </div>
    </section>
  );
}
