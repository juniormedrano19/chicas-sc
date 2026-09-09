import { ScrollReveal } from "@/components/motion/scroll-reveal";
import { AboutFocusPanels } from "../about-focus-panels";

export function AboutSection() {
  return (
    <section id="quienes-somos" className="overflow-hidden bg-muted py-16 sm:py-20 lg:py-24">
      <div className="wrap mb-10 grid items-end gap-6 text-center lg:mb-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,.75fr)] lg:text-left">
        <ScrollReveal direction="left">
          <div>
            <h2 className="section-title">
              ¿Quiénes somos<span>?</span>
            </h2>
          </div>
        </ScrollReveal>
        <ScrollReveal direction="right">
          <p className="max-w-xl text-lg leading-relaxed text-muted-foreground lg:ml-auto">
            Somos Chicas SC, una comunidad de mujeres hinchas unida por la celeste, la amistad y cada historia que nace en la tribuna.
          </p>
        </ScrollReveal>
      </div>
      <div className="wrap">
        <ScrollReveal>
          <AboutFocusPanels />
        </ScrollReveal>
      </div>
    </section>
  );
}
