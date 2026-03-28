"use client";

import { LiveMatchCard, LiveMatchCardSkeleton } from "@/components/sections/live-match-card";
import { useMatches } from "@/hooks/useMatches";

export function FeaturedMatches() {
  const live = useMatches("live", 3);
  const upcoming = useMatches("upcoming", 3);
  const matches = live.matches.length ? live.matches : upcoming.matches;
  const isLoading = live.isLoading || upcoming.isLoading;

  return (
    <section className="crex-section crex-stage crex-stage-yellow border-y border-white/16">
      <div className="crex-container">
        <div className="mb-8 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="font-display text-3xl uppercase tracking-[0.08em] text-crex-hot">Featured Matches</p>
            <h2 className="mt-3 font-poster text-[4rem] uppercase leading-[0.84] text-crex-ink crex-blue-shadow md:text-[5.75rem]">Live now and next up</h2>
          </div>
          <p className="max-w-md text-xl uppercase leading-6 text-[rgba(37,18,77,0.82)]">Data may be delayed during provider rate limits. CREX keeps the latest stable read on deck.</p>
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
