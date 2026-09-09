"use client";

import { useState, useCallback } from "react";

export function useMembersExpand(initialExpanded = false) {
  const [expanded, setExpanded] = useState(initialExpanded);

  const toggleExpand = useCallback(() => {
    setExpanded((prev) => !prev);
  }, []);

  return {
    expanded,
    toggleExpand,
  };
}
