"use client";

import { useEffect, useMemo, useState } from "react";
import type { CREXPlayer, PlayersResponse } from "@/lib/types";
import { FALLBACK_PLAYERS } from "@/lib/fallback-data";

const responseCache = new Map<string, PlayersResponse>();

export interface PlayerFilters {
  query?: string;
  team?: string[];
  role?: string[];
  nationality?: string[];
  page?: number;
  limit?: number;
}

function applyLocalFilters(players: CREXPlayer[], filters: PlayerFilters) {
  const query = filters.query?.trim().toLowerCase() ?? "";
  const team = filters.team ?? [];
  const role = filters.role ?? [];
  const nationality = filters.nationality ?? [];
  const page = filters.page ?? 1;
  const limit = filters.limit ?? players.length;

  const filtered = players.filter((player) => {
    if (query && !player.name.toLowerCase().includes(query)) return false;
    if (team.length && !team.includes(player.team)) return false;
    if (role.length && !role.includes(player.role)) return false;
    if (nationality.length && !nationality.includes(player.nationality)) return false;
    return true;
  });

  const offset = (page - 1) * limit;

  return {
    players: filtered.slice(offset, offset + limit),
    total: filtered.length,
    source: "static" as const,
  };
}

export function usePlayers(filters: PlayerFilters = {}) {
  const { limit, nationality, page, query, role, team } = filters;

  const params = useMemo(() => {
    const search = new URLSearchParams();
    if (query) search.set("search", query);
    if (team?.length) search.set("team", team.join(","));
    if (role?.length) search.set("role", role.join(","));
    if (nationality?.length) search.set("nationality", nationality.join(","));
    if (page) search.set("page", String(page));
    if (limit) search.set("limit", String(limit));
    return search.toString();
  }, [limit, nationality, page, query, role, team]);

  const key = `/api/players${params ? `?${params}` : ""}`;
  const localFallback = useMemo(
    () => applyLocalFilters(FALLBACK_PLAYERS, { limit, nationality, page, query, role, team }),
    [limit, nationality, page, query, role, team]
  );
  const cached = responseCache.get(key);

  const [players, setPlayers] = useState<CREXPlayer[]>(cached?.players ?? localFallback.players);
  const [loading, setLoading] = useState(!cached);
  const [total, setTotal] = useState(cached?.total ?? localFallback.total);
  const [source, setSource] = useState<"live" | "static">(cached?.source ?? localFallback.source);

  useEffect(() => {
    let mounted = true;

    setPlayers(cached?.players ?? localFallback.players);
    setTotal(cached?.total ?? localFallback.total);
    setSource(cached?.source ?? localFallback.source);
    setLoading(!cached);

    fetch(key)
      .then((response) => response.json())
      .then((data: PlayersResponse) => {
        responseCache.set(key, data);
        if (!mounted) return;
        setPlayers(data.players ?? localFallback.players);
        setTotal(data.total ?? localFallback.total);
        setSource(data.source ?? localFallback.source);
      })
      .catch(() => {
        if (!mounted) return;
        setPlayers(localFallback.players);
        setTotal(localFallback.total);
        setSource(localFallback.source);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [cached, key, localFallback.players, localFallback.source, localFallback.total]);

  return { players, loading, total, source };
}
