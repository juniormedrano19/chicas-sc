"use client";

import { useEffect, useState } from "react";
import { LoadingIndicator } from "@/components/loading-indicator";

export function PageLoader() {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const hideLoader = () => window.setTimeout(() => setIsVisible(false), 1000);

    if (document.readyState === "complete") {
      hideLoader();
      return;
    }

    window.addEventListener("load", hideLoader, { once: true });
    return () => window.removeEventListener("load", hideLoader);
  }, []);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-[100]">
      <LoadingIndicator />
    </div>
  );
}
