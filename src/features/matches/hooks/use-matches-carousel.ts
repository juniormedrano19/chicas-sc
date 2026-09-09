"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { matchRepository, type MatchResult } from "../repository";
import type { Match } from "../schema";

const initialResult: MatchResult = { matches: [], state: "loading" };

function findLastFinishedIndex(matches: Match[]) {
  return matches.reduce(
    (latestIndex, match, index) => (match.status === "finished" ? index : latestIndex),
    0,
  );
}

export function useMatchesCarousel() {
  const [{ matches, state }, setResult] = useState<MatchResult>(initialResult);
  const carouselRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  useEffect(() => {
    let isCurrent = true;

    void matchRepository.latest().then((result) => {
      if (isCurrent) {
        setResult(result);
      }
    });

    return () => {
      isCurrent = false;
    };
  }, []);

  const updateScrollState = useCallback(() => {
    if (!carouselRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;
    setCanScrollLeft(scrollLeft > 10);
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 10);
  }, []);

  // Posicionar automáticamente en el último partido disputado
  useEffect(() => {
    if (matches.length > 0 && carouselRef.current) {
      const lastFinished = findLastFinishedIndex(matches);
      const container = carouselRef.current;
      const targetCard = container.children[lastFinished] as HTMLElement | undefined;

      if (targetCard) {
        container.scrollTo({
          left: targetCard.offsetLeft - container.offsetLeft,
          behavior: "instant",
        });
      }
      updateScrollState();
    }
  }, [matches, updateScrollState]);

  const scroll = useCallback((direction: "left" | "right") => {
    if (!carouselRef.current) return;
    const container = carouselRef.current;
    const firstCard = container.firstElementChild as HTMLElement | null;
    const cardWidth = firstCard?.offsetWidth ?? 300;
    const gap = 16;
    const step = cardWidth + gap;

    const scrollAmount =
      window.innerWidth >= 1024 ? step * 3 : window.innerWidth >= 640 ? step * 2 : step;

    container.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  }, []);

  return {
    matches,
    state,
    carouselRef,
    canScrollLeft,
    canScrollRight,
    scroll,
    updateScrollState,
  };
}
