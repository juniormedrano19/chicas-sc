"use client";

import { useState, useMemo, useCallback } from "react";
import type { Album } from "../content";

export function useAlbumsExpand(albums: Album[], initialCount = 3) {
  const [expanded, setExpanded] = useState(false);

  const visibleAlbums = useMemo(
    () => (expanded ? albums : albums.slice(0, initialCount)),
    [expanded, albums, initialCount],
  );

  const toggleExpand = useCallback(() => {
    setExpanded((prev) => !prev);
  }, []);

  return {
    expanded,
    visibleAlbums,
    toggleExpand,
    hasMore: albums.length > initialCount,
  };
}
