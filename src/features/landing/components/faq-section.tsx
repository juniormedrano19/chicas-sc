import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ScrollReveal } from "@/components/motion/scroll-reveal";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { faqs } from "../content";

export function FAQSection() {
  return (
    <section id="faq" className="section border-t">
      <div className="wrap grid gap-10 lg:grid-cols-[.85fr_1.15fr]">
        <ScrollReveal direction="left">
          <div className="text-center lg:text-left">
            <p className="eyebrow mb-4">Resolvemos tus dudas</p>
            <h2 className="section-title">
              Antes del
              <br />
              primer aliento.
            </h2>
            <p className="mt-6 text-muted-foreground">¿Tienes otra pregunta?</p>
            <Link
              href="/#contacto"
              className="pill-link mt-3 underline underline-offset-4"
            >
              Conversemos <ArrowRight className="size-4" />
            </Link>
          </div>
        </ScrollReveal>

        <ScrollReveal direction="right">
          <Accordion type="single" collapsible defaultValue="faq-0">
            {faqs.map((f, i) => (
              <AccordionItem value={`faq-${i}`} key={f.q}>
                <AccordionTrigger className="py-6 text-left text-base font-semibold">
                  {f.q}
                </AccordionTrigger>
                <AccordionContent className="text-base leading-relaxed text-muted-foreground">
                  {f.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </ScrollReveal>
      </div>
    </section>
  );
}
