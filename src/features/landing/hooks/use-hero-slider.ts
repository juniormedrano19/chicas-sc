"use client";

import { useEffect, useState, useCallback } from "react";
import { useReducedMotion } from "framer-motion";

export interface HeroSliderState {
  current: number;
  prev: number;
}

export function useHeroSlider(totalSlides: number, intervalMs = 5000) {
  const [slides, setSlides] = useState<HeroSliderState>({ current: 0, prev: 0 });
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion || totalSlides <= 1) return;

    const interval = window.setInterval(() => {
      setSlides((s) => ({
        prev: s.current,
        current: (s.current + 1) % totalSlides,
      }));
    }, intervalMs);

    return () => window.clearInterval(interval);
  }, [totalSlides, intervalMs, prefersReducedMotion]);

  const selectSlide = useCallback(
    (index: number) => {
      setSlides((currentSlides) => {
        if (index === currentSlides.current) return currentSlides;
        return {
          prev: currentSlides.current,
          current: index,
        };
      });
    },
    [],
  );

  return {
    slides,
    selectSlide,
    prefersReducedMotion,
  };
}
