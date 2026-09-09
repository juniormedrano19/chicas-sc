"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollReveal } from "@/components/motion/scroll-reveal";
import { testimonials } from "../content";
import { useTestimonialsCarousel } from "../hooks/use-testimonials-carousel";
import { TestimonialCard } from "./testimonial-card";

export function TestimonialsSection() {
  const { currentIndex, trackRef, moveTo } = useTestimonialsCarousel(testimonials.length);

  return (
    <section id="testimonios" className="section bg-muted">
      <div className="wrap">
        <ScrollReveal>
          <div className="mb-10">
            <div className="flex w-full flex-col text-center sm:flex-row sm:items-end sm:justify-between sm:text-left">
              <div>
                <p className="eyebrow mb-4">Voces de nuestra comunidad</p>
                <h2 className="section-title">Se siente. Se comparte.</h2>
              </div>

              <div className="mt-6 flex items-center justify-center gap-4 sm:hidden">
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  aria-label="Ver testimonio anterior"
                  onClick={() => moveTo(currentIndex - 1)}
                  className="size-14 rounded-full border-secondary bg-white text-secondary hover:bg-primary hover:text-secondary"
                >
                  <ChevronLeft className="size-7" />
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  aria-label="Ver siguiente testimonio"
                  onClick={() => moveTo(currentIndex + 1)}
                  className="size-14 rounded-full border-secondary bg-white text-secondary hover:bg-primary hover:text-secondary"
                >
                  <ChevronRight className="size-7" />
                </Button>
              </div>

              <div className="hidden items-center gap-3 sm:flex">
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  aria-label="Ver testimonio anterior"
                  onClick={() => moveTo(currentIndex - 1)}
                  className="size-11 rounded-full border-secondary bg-white hover:bg-primary"
                >
                  <ChevronLeft className="size-5" />
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  aria-label="Ver siguiente testimonio"
                  onClick={() => moveTo(currentIndex + 1)}
                  className="size-11 rounded-full border-secondary bg-white hover:bg-primary"
                >
                  <ChevronRight className="size-5" />
                </Button>
              </div>
            </div>
          </div>

          <div
            ref={trackRef}
            role="region"
            aria-label="Carrusel de testimonios"
            className="-mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8 xl:-mx-12 xl:px-12"
          >
            {testimonials.map((testimonial, i) => (
              <TestimonialCard
                key={testimonial.name}
                testimonial={testimonial}
                index={i}
                isCurrent={i === currentIndex}
              />
            ))}
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
