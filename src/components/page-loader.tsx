"use client";

import { LoadingIndicator } from "@/components/loading-indicator";
import { usePageLoader } from "./hooks/use-page-loader";

export function PageLoader() {
  const { isVisible } = usePageLoader(1000);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-[100]">
      <LoadingIndicator />
    </div>
  );
}
