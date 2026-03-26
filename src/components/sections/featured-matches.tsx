"use client";

import { LiveMatchCard, LiveMatchCardSkeleton } from "@/components/sections/live-match-card";
import { useMatches } from "@/hooks/useMatches";

export function FeaturedMatches() {
  const live = useMatches("live", 3);
  const upcoming = useMatches("upcoming", 3);
  const matches = live.matches.length ? live.matches : upcoming.matches;
  const isLoading = live.isLoading || upcoming.isLoading;

  return (
    <section className="crex-section">
      <div className="crex-container">
        <div className="mb-8 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-crex-muted">Featured Matches</p>
            <h2 className="mt-3 font-display text-5xl uppercase text-crex-text md:text-6xl">Live now and next up</h2>
          </div>
          <p className="text-sm text-crex-muted">Data may be delayed during provider rate limits. CREX will keep showing the latest stable read.</p>
        </div>
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {isLoading
            ? Array.from({ length: 3 }, (_, index) => <LiveMatchCardSkeleton key={index} />)
            : matches.map((match) => <LiveMatchCard key={match.id} match={match} />)}
        </div>
      </div>
    </section>
  );
}
