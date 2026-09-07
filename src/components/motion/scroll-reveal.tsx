"use client";

import { useRef, type ReactNode } from "react";
import {
  motion,
  useInView,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import { cn } from "@/lib/utils";

type ScrollRevealProps = {
  children: ReactNode;
  className?: string;
  direction?: "up" | "left" | "right";
};

type PaintRevealProps = {
  children: ReactNode;
  className?: string;
  id?: string;
};

type ParallaxLayerProps = {
  className?: string;
  imageUrl: string;
};

const PAINT_FRONT_START =
  "M0 0H1000V-80C940-80 940-25 875-25C810-25 810-110 730-110C650-110 650-35 570-35C490-35 490-100 410-100C330-100 330-35 250-35C170-35 170-90 90-90C45-90 45-45 0-45Z";
const PAINT_FRONT_END =
  "M0 0H1000V1200C940 1200 940 1250 875 1250C810 1250 810 1170 730 1170C650 1170 650 1260 570 1260C490 1260 490 1180 410 1180C330 1180 330 1265 250 1265C170 1265 170 1195 90 1195C45 1195 45 1240 0 1240Z";

/**
 * Reveals content whenever it enters the viewport. Framer Motion handles the
 * vertical movement while tw-animate-css supplies the fade-in and fade-out.
 */
export function ScrollReveal({
  children,
  className,
  direction = "up",
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const isInView = useInView(ref, { amount: 0.14, once: false });
  const isVisible = prefersReducedMotion || isInView;
  const entryOffset =
    direction === "left"
      ? { x: -32 }
      : direction === "right"
        ? { x: 32 }
        : { y: 24 };
  const exitOffset =
    direction === "left"
      ? { x: -20 }
      : direction === "right"
        ? { x: 20 }
        : { y: -16 };

  return (
    <div
      ref={ref}
      className={cn(
        "motion-reduce:opacity-100 motion-reduce:animate-none",
        isVisible
          ? "opacity-100 motion-safe:animate-in motion-safe:fade-in motion-safe:duration-700 motion-safe:ease-out"
          : "opacity-0 motion-safe:animate-out motion-safe:fade-out motion-safe:duration-500 motion-safe:ease-in",
        className,
      )}
    >
      <motion.div
        initial={prefersReducedMotion ? false : entryOffset}
        animate={isVisible ? { x: 0, y: 0 } : exitOffset}
        transition={{ duration: isVisible ? 0.55 : 0.4, ease: [0.22, 1, 0.36, 1] }}
      >
        {children}
      </motion.div>
    </div>
  );
}

export function PaintReveal({ children, className, id }: PaintRevealProps) {
  const ref = useRef<HTMLElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "start start"],
  });
  const paintProgress = useSpring(scrollYProgress, {
    stiffness: 80,
    damping: 24,
    mass: 0.45,
  });
  const paintPath = useTransform(
    paintProgress,
    [0, 0.7],
    [PAINT_FRONT_START, PAINT_FRONT_END],
  );
  const contentOpacity = useTransform(paintProgress, [0.32, 0.64], [0, 1]);
  const contentY = useTransform(paintProgress, [0.32, 0.64], [28, 0]);

  return (
    <section
      ref={ref}
      id={id}
      className={cn("relative isolate overflow-hidden", className)}
    >
      <svg
        aria-hidden="true"
        viewBox="0 0 1000 1000"
        preserveAspectRatio="none"
        className="pointer-events-none absolute inset-0 z-0 h-full w-full"
      >
        <motion.path
          fill="var(--primary)"
          initial={false}
          animate={prefersReducedMotion ? { d: PAINT_FRONT_END } : undefined}
          style={prefersReducedMotion ? undefined : { d: paintPath }}
        />
      </svg>
      <motion.div
        className="relative z-10 motion-safe:animate-in motion-safe:fade-in motion-safe:duration-700"
        initial={false}
        animate={prefersReducedMotion ? { opacity: 1, y: 0 } : undefined}
        style={
          prefersReducedMotion
            ? undefined
            : { opacity: contentOpacity, y: contentY }
        }
      >
        {children}
      </motion.div>
    </section>
  );
}

export function ParallaxLayer({ className, imageUrl }: ParallaxLayerProps) {
  const ref = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], ["-5%", "5%"]);
  const scale = useTransform(scrollYProgress, [0, 1], [1.08, 1.02]);

  return (
    <motion.div
      ref={ref}
      aria-hidden="true"
      className={className}
      style={
        prefersReducedMotion
          ? { backgroundImage: `url('${imageUrl}')` }
          : { backgroundImage: `url('${imageUrl}')`, y, scale }
      }
    />
  );
}
