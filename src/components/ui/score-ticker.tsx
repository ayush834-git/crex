import Link from "next/link";
import type { CREXMatch } from "@/lib/types";
import { formatRelativeUpdate } from "@/lib/format";
import { TeamMark } from "@/components/ui/team-mark";

interface ScoreTickerProps {
  matches: CREXMatch[];
}

export function ScoreTicker({ matches }: ScoreTickerProps) {
  if (!matches.length) return null;

  const items = [...matches, ...matches];

  return (
    <section className="crex-stage crex-stage-blue overflow-hidden border-y border-white/16">
      <div className="flex w-max animate-crex-marquee gap-4 px-4 py-4">
        {items.map((match, index) => (
          <Link
            key={`${match.id}-${index}`}
            href={`/matches?tab=${match.status}`}
            className="crex-card crex-card-interactive flex min-w-[320px] items-center gap-3 px-4 py-3"
          >
            <TeamMark abbr={match.team1.abbr} logo={match.team1.logo} className="h-10 w-10" />
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 font-display text-2xl uppercase tracking-[0.06em] text-crex-accent">
                <span>{match.team1.abbr}</span>
                <span className="text-crex-muted">vs</span>
                <span>{match.team2.abbr}</span>
              </div>
              <p className="truncate text-lg uppercase text-crex-text">{match.team1.score ?? "--/--"} / {match.team2.score ?? "--/--"}</p>
            </div>
            <span className="font-display text-lg uppercase text-crex-hot">{formatRelativeUpdate(match.updatedAt)}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}
