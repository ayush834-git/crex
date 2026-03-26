"use client";

import { useEffect, useMemo, useState } from "react";

const cache = new Map<string, string | null>();

export function usePlayerImage(espnId: number | undefined, name: string, enabled = true) {
  const key = useMemo(() => `${espnId ?? 0}:${name.trim().toLowerCase()}`, [espnId, name]);
  const [url, setUrl] = useState<string | null>(cache.get(key) ?? null);
  const [loading, setLoading] = useState(enabled && !cache.has(key));

  useEffect(() => {
    setUrl(cache.get(key) ?? null);

    if (!enabled || !name.trim()) {
      setLoading(false);
      return;
    }

    if (cache.has(key)) {
      setUrl(cache.get(key) ?? null);
      setLoading(false);
      return;
    }

    let mounted = true;
    setLoading(true);

    fetch(`/api/player-image?espnId=${espnId ?? 0}&name=${encodeURIComponent(name)}`)
      .then((response) => response.json())
      .then((data: { url?: string | null }) => {
        cache.set(key, data.url ?? null);
        if (mounted) setUrl(data.url ?? null);
      })
      .catch(() => {
        cache.set(key, null);
        if (mounted) setUrl(null);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [enabled, espnId, key, name]);

  return { url, loading };
}
