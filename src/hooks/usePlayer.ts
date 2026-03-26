"use client";

import { useEffect, useState } from "react";
import type { CREXPlayer } from "@/lib/types";
import { getPlayerById } from "@/lib/fallback-data";

const playerCache = new Map<string, CREXPlayer>();

export function usePlayer(id: string) {
  const fallbackPlayer = getPlayerById(id);
  const [player, setPlayer] = useState<CREXPlayer | null>(playerCache.get(id) ?? fallbackPlayer);
  const [isLoading, setIsLoading] = useState(!playerCache.has(id));

  useEffect(() => {
    let mounted = true;

    setPlayer(playerCache.get(id) ?? getPlayerById(id));
    setIsLoading(!playerCache.has(id));

    const load = async () => {
      try {
        const response = await fetch(`/api/players/${id}`);
        const next = (await response.json()) as CREXPlayer;
        playerCache.set(id, next);
        if (mounted) setPlayer(next);
      } catch {
        if (mounted) setPlayer(getPlayerById(id));
      } finally {
        if (mounted) setIsLoading(false);
      }
    };

    if (id) void load();

    return () => {
      mounted = false;
    };
  }, [id]);

  return { player, isLoading };
}
