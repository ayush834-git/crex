"use client";

import { useEffect, useMemo, useState } from "react";
import { PlayerStatCard } from "@/components/sections/player-stat-card";
import { FEATURED_PLAYER_SPOTLIGHT } from "@/lib/fallback-data";
import { usePlayers } from "@/hooks/usePlayers";
import type { FantasyPick } from "@/lib/types";

export function PlayerSpotlight() {
  const { players } = usePlayers({ limit: 120 });
  const [fantasyPicks, setFantasyPicks] = useState<FantasyPick[]>([]);

  useEffect(() => {
    let mounted = true;
    fetch("/api/analytics/fantasy-picks")
      .then((response) => response.json())
      .then((data: FantasyPick[]) => {
        if (mounted) setFantasyPicks(data);
      })
      .catch(() => {
        if (mounted) setFantasyPicks([]);
      });

    return () => {
      mounted = false;
    };
  }, []);

  const spotlightPlayers = useMemo(() => {
    if (!fantasyPicks.length) return FEATURED_PLAYER_SPOTLIGHT;

    const mapped = fantasyPicks
      .map((pick) => players.find((player) => player.id === pick.playerId))
      .filter((player): player is NonNullable<typeof player> => Boolean(player))
      .slice(0, 4);

    return mapped.length ? mapped : FEATURED_PLAYER_SPOTLIGHT;
  }, [fantasyPicks, players]);

  return (
    <section className="crex-section crex-stage crex-stage-orange border-y border-white/16">
      <div className="crex-container">
        <div className="mb-8">
          <p className="font-display text-3xl uppercase tracking-[0.08em] text-white">Player Spotlight</p>
          <h2 className="mt-3 font-poster text-[4rem] uppercase leading-[0.84] text-crex-surface crex-blue-shadow md:text-[5.75rem]">
            Four names driving
            <span className="block">tonight&apos;s conversation.</span>
          </h2>
        </div>
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {spotlightPlayers.map((player) => (
            <PlayerStatCard key={player.id} player={player} />
          ))}
        </div>
      </div>
    </section>
  );
}
