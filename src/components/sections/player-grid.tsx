import Link from "next/link";
import type { CREXPlayer } from "@/lib/types";
import { EmptyState } from "@/components/ui/empty-state";
import { FlipReveal } from "@/components/ui/flip-reveal";
import { PlayerStatCard } from "@/components/sections/player-stat-card";

export function PlayerGrid({ players, loading }: { players: CREXPlayer[]; loading: boolean }) {
  if (loading) {
    return (
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
        {Array.from({ length: 8 }, (_, index) => (
          <div key={index} className="crex-card h-[360px] animate-pulse">
            <div className="h-full rounded-2xl bg-crex-border" />
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
    <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
      {players.map((player) => (
        <FlipReveal
          key={player.id}
          front={<PlayerStatCard player={player} />}
          back={
            <div className="crex-card h-full">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-crex-muted">{player.team} • {player.role}</p>
              <div className="mt-5 space-y-3">
                <div>
                  <p className="text-xs uppercase tracking-[0.14em] text-crex-muted">Career Runs</p>
                  <p className="font-mono text-3xl font-bold text-crex-text">{player.stats.runs}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.14em] text-crex-muted">Wickets</p>
                  <p className="font-mono text-3xl font-bold text-crex-text">{player.stats.wickets}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.14em] text-crex-muted">Recent Form</p>
                  <p className="font-mono text-lg font-bold text-crex-accent">{player.recentForm.join(" • ")}</p>
                </div>
              </div>
              <Link href={`/players/${player.id}`} className="mt-6 inline-flex text-sm font-semibold text-crex-accent">
                Full Profile →
              </Link>
            </div>
          }
        />
      ))}
    </div>
  );
}
