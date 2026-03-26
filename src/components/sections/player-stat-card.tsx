import Link from "next/link";
import type { CREXPlayer } from "@/lib/types";
import { PlayerAvatar } from "@/components/ui/player-avatar";

export function PlayerStatCard({ player }: { player: CREXPlayer }) {
  return (
    <div className="crex-card h-full">
      <div className="flex items-center gap-4">
        <PlayerAvatar
          name={player.name}
          src={player.image}
          espnId={player.espnId}
          queryName={player.name}
          color={player.teamColor}
          className="h-16 w-16"
        />
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-crex-muted">{player.team} - {player.role}</p>
          <h3 className="font-display text-3xl uppercase text-crex-text">{player.name}</h3>
        </div>
      </div>
      <div className="mt-6 grid grid-cols-2 gap-3">
        <div className="rounded-2xl bg-crex-surface p-3">
          <p className="text-xs uppercase tracking-[0.16em] text-crex-muted">Runs</p>
          <p className="font-mono text-2xl font-bold text-crex-text">{player.stats.runs}</p>
        </div>
        <div className="rounded-2xl bg-crex-surface p-3">
          <p className="text-xs uppercase tracking-[0.16em] text-crex-muted">Wickets</p>
          <p className="font-mono text-2xl font-bold text-crex-text">{player.stats.wickets}</p>
        </div>
      </div>
      <Link href={`/players/${player.id}`} className="mt-5 inline-flex text-sm font-semibold text-crex-accent">
        {"Full Profile ->"}
      </Link>
    </div>
  );
}
