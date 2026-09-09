"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useReducedMotion } from "framer-motion";

export function useTestimonialsCarousel(totalItems: number, intervalMs = 5500) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const trackRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  const scrollToIndex = useCallback(
    (index: number, behavior: ScrollBehavior) => {
      const track = trackRef.current;
      const card = track?.children[index] as HTMLElement | undefined;
      if (!track || !card) return;

      track.scrollTo({
        left: card.offsetLeft - track.offsetLeft,
        behavior,
      });
    },
    [],
  );

  const moveTo = useCallback(
    (index: number) => {
      if (totalItems <= 0) return;
      const nextIndex = (index + totalItems) % totalItems;
      setCurrentIndex(nextIndex);
      scrollToIndex(nextIndex, prefersReducedMotion ? "auto" : "smooth");
    },
    [totalItems, prefersReducedMotion, scrollToIndex],
  );

  useEffect(() => {
    if (prefersReducedMotion || totalItems <= 1) return;

    const interval = window.setInterval(() => {
      setCurrentIndex((index) => {
        const nextIndex = (index + 1) % totalItems;
        scrollToIndex(nextIndex, "smooth");
        return nextIndex;
      });
    }, intervalMs);

    return () => window.clearInterval(interval);
  }, [prefersReducedMotion, totalItems, intervalMs, scrollToIndex]);

  return {
    currentIndex,
    trackRef,
    moveTo,
  };
}
