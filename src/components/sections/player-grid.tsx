import Link from "next/link";
import type { CREXPlayer } from "@/lib/types";
import { EmptyState } from "@/components/ui/empty-state";
import { FlipReveal } from "@/components/ui/flip-reveal";
import { PlayerStatCard } from "@/components/sections/player-stat-card";

export function PlayerGrid({ players, loading }: { players: CREXPlayer[]; loading: boolean }) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:auto-rows-fr">
        {Array.from({ length: 8 }, (_, index) => (
          <div key={index} className="crex-card h-[520px] animate-pulse">
            <div className="h-full rounded-2xl border-2 border-crex-border bg-[rgba(234,179,8,0.18)]" />
          </div>
        ))}
      </div>
    );
  }

  if (!players.length) {
    return (
      <EmptyState
        title="No players found"
        subtitle="Try another team, role, or nationality filter to widen the search."
        cta={{ text: "Reset Filters", href: "/players" }}
      />
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:auto-rows-fr">
      {players.map((player) => (
        <FlipReveal
          key={player.id}
          className="h-full"
          front={<PlayerStatCard player={player} />}
          back={
            <div className="crex-card crex-card-interactive [--crex-card-glow:rgba(29,78,216,0.22)] flex h-full flex-col">
              <p className="font-display text-2xl uppercase tracking-[0.08em] text-crex-hot">{player.team} / {player.role}</p>
              <div className="mt-5 space-y-4">
                <div>
                  <p className="font-display text-xl uppercase tracking-[0.08em] text-crex-text">Career Runs</p>
                  <p className="font-mono text-4xl font-bold text-crex-accent">{player.stats.runs}</p>
                </div>
                <div>
                  <p className="font-display text-xl uppercase tracking-[0.08em] text-crex-text">Wickets</p>
                  <p className="font-mono text-4xl font-bold text-crex-accent">{player.stats.wickets}</p>
                </div>
                <div>
                  <p className="font-display text-xl uppercase tracking-[0.08em] text-crex-text">Recent Form</p>
                  <p className="font-mono text-xl font-bold text-crex-hot">{player.recentForm.join(" / ")}</p>
                </div>
              </div>
              <Link href={`/players/${player.id}`} className="mt-auto inline-flex pt-6 font-display text-2xl uppercase tracking-[0.08em] text-crex-accent">
                {"Full Profile ->"}
              </Link>
            </div>
          }
        />
      ))}
    </div>
  );
}
