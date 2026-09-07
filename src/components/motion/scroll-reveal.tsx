"use client";

import { useRef, type ReactNode } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

type ScrollRevealProps = {
  children: ReactNode;
  className?: string;
  direction?: "up" | "left" | "right";
};

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
