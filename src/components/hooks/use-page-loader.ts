"use client";

import { useEffect, useState } from "react";

export function usePageLoader(delayMs = 1000) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const hideLoader = () => window.setTimeout(() => setIsVisible(false), delayMs);

    if (document.readyState === "complete") {
      hideLoader();
      return;
    }

    window.addEventListener("load", hideLoader, { once: true });
    return () => window.removeEventListener("load", hideLoader);
  }, [delayMs]);

  return { isVisible };
}
