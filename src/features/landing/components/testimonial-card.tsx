import Image from "next/image";
import { Quote } from "lucide-react";
import type { Testimonial } from "../content";

export interface TestimonialCardProps {
  testimonial: Testimonial;
  index: number;
  isCurrent: boolean;
}

export function TestimonialCard({
  testimonial,
  index,
  isCurrent,
}: TestimonialCardProps) {
  return (
    <article
      aria-current={isCurrent ? "true" : undefined}
      className={`flex min-w-[calc(100%-1rem)] snap-start flex-col border-t-2 border-secondary bg-white p-6 transition-all duration-500 sm:min-w-[calc(72%-1rem)] lg:min-w-[calc(52%-1rem)] xl:min-w-[calc(43%-1rem)] xl:p-9 ${
        isCurrent ? "scale-100 opacity-100 shadow-lg" : "scale-[0.96] opacity-55"
      }`}
    >
      <Quote className="mb-7 size-8 fill-primary text-primary" />
      <p className="text-xl font-semibold leading-snug">“{testimonial.text}”</p>
      <div className="mt-9 flex items-center gap-3">
        {testimonial.image ? (
          <Image
            src={testimonial.image}
            alt={`Foto de ${testimonial.name}`}
            width={44}
            height={44}
            sizes="44px"
            className="size-11 shrink-0 rounded-full object-cover"
          />
        ) : (
          <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-primary/30 font-display text-xl font-semibold">
            0{index + 1}
          </span>
        )}
        <div>
          <p className="font-semibold">{testimonial.name}</p>
          <p className="mt-1 text-xs text-muted-foreground">{testimonial.tag}</p>
        </div>
      </div>
    </article>
  );
}
