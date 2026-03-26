"use client";

import { useEffect, useMemo, useState } from "react";
import type { CREXMatch, MatchStatus } from "@/lib/types";
import { FALLBACK_MATCHES } from "@/lib/fallback-data";

type MatchesResponse = { matches: CREXMatch[]; source: "live" | "static" };

const matchCache = new Map<string, MatchesResponse>();

function getFallbackMatches(status: MatchStatus, limit?: number) {
  const matches = FALLBACK_MATCHES.filter((match) => match.status === status);
  return {
    matches: limit ? matches.slice(0, limit) : matches,
    source: "static" as const,
  };
}

export function useMatches(status: MatchStatus = "live", limit?: number) {
  const key = useMemo(() => `/api/matches?status=${status}${limit ? `&limit=${limit}` : ""}`, [status, limit]);
  const fallback = useMemo(() => getFallbackMatches(status, limit), [limit, status]);
  const [data, setData] = useState<MatchesResponse>(matchCache.get(key) ?? fallback);
  const [isLoading, setIsLoading] = useState(!matchCache.has(key));
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      try {
        const response = await fetch(key);
        const next = (await response.json()) as MatchesResponse;
        matchCache.set(key, next);
        if (mounted) {
          setData(next);
          setError(null);
        }
      } catch (cause) {
        if (mounted) {
          setData(fallback);
          setError(cause as Error);
        }
      } finally {
        if (mounted) setIsLoading(false);
      }
    };

    void load();
    const refreshInterval = status === "live" ? 15000 : 60000;
    const timer = window.setInterval(load, refreshInterval);

    return () => {
      mounted = false;
      window.clearInterval(timer);
    };
  }, [fallback, key, status]);

  return { matches: data.matches, source: data.source, isLoading, error };
}
