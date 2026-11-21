"use client";

import { useState } from "react";

export function useAdminAction() {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  async function run(action: () => Promise<void>) {
    setPending(true);
    setError(null);
    try { await action(); return true; }
    catch (error) {
      setError(error instanceof Error ? error.message : "No se pudieron guardar los cambios.");
      return false;
    } finally { setPending(false); }
  }
  return { run, pending, error, clearError: () => setError(null) };
}
