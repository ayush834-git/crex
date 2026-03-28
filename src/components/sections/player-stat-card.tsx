import Link from "next/link";
import type { CREXPlayer } from "@/lib/types";
import { PlayerAvatar } from "@/components/ui/player-avatar";

export function PlayerStatCard({ player }: { player: CREXPlayer }) {
  return (
    <div className="crex-card crex-card-interactive [--crex-card-glow:rgba(109,40,217,0.24)] flex h-full flex-col">
      <div className="relative min-h-[320px] rounded-2xl border-2 border-crex-border bg-[linear-gradient(180deg,rgba(109,40,217,0.28),rgba(255,255,255,0.96))] p-6">
        <span className="absolute right-4 top-4 rounded-xl border-2 border-crex-border bg-[#4a2f83] px-3 py-1 font-display text-xl uppercase tracking-[0.08em] text-white shadow-[0_10px_18px_rgba(91,33,182,0.16)]">
          {player.team}
        </span>
        <div className="mt-14 flex h-[180px] items-end justify-center">
          <PlayerAvatar
            name={player.name}
            src={player.image}
            espnId={player.espnId}
            queryName={player.name}
            color={player.teamColor}
            className="h-[180px] w-[140px]"
          />
        </div>
      </div>

      <div className="mt-5 flex flex-1 flex-col">
        <span className="w-fit rounded-xl border-2 border-crex-border bg-[linear-gradient(135deg,#be185d,#ea580c)] px-3 py-1 font-display text-lg uppercase tracking-[0.08em] text-white shadow-[0_10px_18px_rgba(91,33,182,0.14)]">
          {player.role}
        </span>
        <h3 className="mt-4 font-display text-[clamp(2.2rem,3vw,3.25rem)] uppercase leading-[0.92] tracking-[0.06em] text-crex-accent">
          {player.name}
        </h3>

        <div className="mt-5 grid grid-cols-2 gap-3">
          <div className="crex-stat-tile bg-crex-surface text-left">
            <p className="font-display text-xl uppercase tracking-[0.08em] text-crex-text">Runs</p>
            <p className="font-mono text-3xl font-bold text-crex-accent">{player.stats.runs}</p>
          </div>
          <div className="crex-stat-tile bg-crex-accent-soft text-left">
            <p className="font-display text-xl uppercase tracking-[0.08em] text-white">Wickets</p>
            <p className="font-mono text-3xl font-bold text-crex-surface">{player.stats.wickets}</p>
          </div>
        </div>

        <Link href={`/players/${player.id}`} className="mt-auto inline-flex pt-5 font-display text-2xl uppercase tracking-[0.08em] text-crex-accent">
          {"Full Profile ->"}
        </Link>
      </div>
    </div>
  );
}
