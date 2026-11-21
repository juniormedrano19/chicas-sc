"use client";

import { useCallback, useEffect, useState } from "react";

export function useAdminResource<T>(load: () => Promise<T>, initial: T) {
  const [data, setData] = useState(initial);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const reload = useCallback(async () => { setData(await load()); setError(null); }, [load]);

  useEffect(() => {
    let active = true;
    load().then((result) => { if (active) setData(result); })
      .catch(() => { if (active) setError("No pudimos cargar los datos. Intenta nuevamente."); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [load]);

  return { data, loading, error, reload };
}
