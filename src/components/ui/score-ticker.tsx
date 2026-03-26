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
    <section className="overflow-hidden border-y border-crex-border bg-white">
      <div className="flex w-max animate-crex-marquee gap-4 px-4 py-4">
        {items.map((match, index) => (
          <Link
            key={`${match.id}-${index}`}
            href={`/matches?tab=${match.status}`}
            className="flex min-w-[320px] items-center gap-3 rounded-2xl border border-crex-border bg-crex-surface px-4 py-3"
          >
            <TeamMark abbr={match.team1.abbr} logo={match.team1.logo} className="h-10 w-10" />
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 text-sm font-semibold text-crex-text">
                <span>{match.team1.abbr}</span>
                <span className="text-crex-muted">vs</span>
                <span>{match.team2.abbr}</span>
              </div>
              <p className="truncate text-xs text-crex-muted">{match.team1.score ?? "—/—"} • {match.team2.score ?? "—/—"}</p>
            </div>
            <span className="text-xs text-crex-muted">{formatRelativeUpdate(match.updatedAt)}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}
