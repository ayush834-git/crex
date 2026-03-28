"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Clock3, MapPin } from "lucide-react";
import type { CREXMatch } from "@/lib/types";
import { formatMatchTime, formatRelativeUpdate } from "@/lib/format";
import { TeamMark } from "@/components/ui/team-mark";
import { LiveBadge } from "@/components/ui/live-badge";
import { NumberTicker } from "@/components/ui/number-ticker";

function parseScoreValues(score?: string) {
  if (!score) return null;
  const match = score.match(/(\d+)\/(\d+)/);
  if (!match) return null;
  return { runs: Number(match[1]), wickets: Number(match[2]) };
}

function useCountdown(timestamp: string) {
  const [text, setText] = useState(() => getCountdownText(timestamp));
  useEffect(() => {
    const id = setInterval(() => setText(getCountdownText(timestamp)), 1000);
    return () => clearInterval(id);
  }, [timestamp]);
  return text;
}

function getCountdownText(timestamp: string) {
  const diff = new Date(timestamp).getTime() - Date.now();
  if (diff <= 0) return "Starting now";
  const hours = Math.floor(diff / 1000 / 60 / 60);
  const minutes = Math.floor((diff / 1000 / 60) % 60);
  const seconds = Math.floor((diff / 1000) % 60);
  return `${hours}h ${minutes}m ${seconds}s to toss`;
}

function LiveScore({ score }: { score?: string }) {
  const parsed = useMemo(() => parseScoreValues(score), [score]);
  if (!parsed) return <span className="font-mono text-2xl font-bold text-crex-text">--/--</span>;
  return (
    <span className="font-mono text-2xl font-bold text-crex-text">
      <NumberTicker value={parsed.runs} className="font-mono text-2xl font-bold" />/{parsed.wickets}
    </span>
  );
}

export function LiveMatchCard({ match }: { match: CREXMatch }) {
  const statusLabel = match.status.toUpperCase();
  const footerCopy = match.status === "live" ? "Follow Live ->" : "Match Details ->";
  const countdown = useCountdown(match.startTime);
  const heroTone =
    match.status === "live"
      ? "bg-[linear-gradient(135deg,#b91c1c,#ea580c)] text-white"
      : match.status === "upcoming"
        ? "bg-[linear-gradient(135deg,#1d4ed8,#6d28d9)] text-white"
        : "bg-[linear-gradient(135deg,#be185d,#6d28d9)] text-white";

  return (
    <article className="crex-card crex-card-interactive [--crex-card-glow:rgba(29,78,216,0.22)] flex h-full flex-col">
      <div className={`rounded-2xl p-4 shadow-[0_14px_24px_rgba(91,33,182,0.16)] ${heroTone}`}>
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="font-display text-xl uppercase tracking-[0.08em] text-white/78">{match.series ?? "IPL 2026"}</p>
            <h3 className="mt-2 font-display text-4xl uppercase tracking-[0.08em]">{match.team1.abbr} vs {match.team2.abbr}</h3>
          </div>
          {match.status === "live" ? <LiveBadge /> : <span className="crex-pill">{statusLabel}</span>}
        </div>
      </div>

      <div className="mt-5 grid grid-cols-[1fr_auto_1fr] items-center gap-4">
        <div className="flex items-center gap-3">
          <TeamMark abbr={match.team1.abbr} logo={match.team1.logo} />
          <div>
            <p className="font-display text-2xl uppercase tracking-[0.06em] text-crex-text">{match.team1.name}</p>
            {match.status === "live" ? (
              <LiveScore score={match.team1.score} />
            ) : (
              <p className="font-mono text-2xl font-bold text-crex-text">{match.team1.score ?? "--/--"}</p>
            )}
          </div>
        </div>
        <span className="font-display text-2xl uppercase tracking-[0.08em] text-crex-hot">vs</span>
        <div className="flex items-center justify-end gap-3 text-right">
          <div>
            <p className="font-display text-2xl uppercase tracking-[0.06em] text-crex-text">{match.team2.name}</p>
            {match.status === "live" ? (
              <LiveScore score={match.team2.score} />
            ) : (
              <p className="font-mono text-2xl font-bold text-crex-text">{match.team2.score ?? "--/--"}</p>
            )}
          </div>
          <TeamMark abbr={match.team2.abbr} logo={match.team2.logo} />
        </div>
      </div>

      <div className="mt-6 rounded-2xl border-2 border-crex-border bg-[linear-gradient(180deg,rgba(234,179,8,0.22),rgba(255,255,255,0.9))] p-4">
        {match.status === "upcoming" ? (
          <p className="font-mono text-lg font-bold text-crex-accent">{countdown}</p>
        ) : (
          <p className="font-mono text-lg font-bold text-crex-text">
            {match.oversBowled ? `${match.oversBowled} overs` : match.result ?? "In play"}
          </p>
        )}
        <div className="mt-3 flex flex-wrap items-center gap-4 text-base uppercase text-crex-text">
          <span className="inline-flex items-center gap-2"><MapPin size={14} /> {match.venue || "Venue TBC"}</span>
          <span className="inline-flex items-center gap-2"><Clock3 size={14} /> {formatMatchTime(match.startTime)}</span>
        </div>
        <p className="mt-3 text-base uppercase text-crex-muted">{match.note ?? formatRelativeUpdate(match.updatedAt)}</p>
      </div>

      <Link href={`/matches/${match.id}`} className="mt-6 inline-flex font-display text-2xl uppercase tracking-[0.08em] text-crex-accent">
        {footerCopy}
      </Link>
    </article>
  );
}

export function LiveMatchCardSkeleton() {
  return (
    <div className="crex-card animate-pulse">
      <div className="h-24 rounded-2xl bg-[rgba(190,24,93,0.25)]" />
      <div className="mt-5 h-28 rounded-2xl bg-crex-panel-soft" />
      <div className="mt-6 h-24 rounded-2xl bg-[rgba(234,179,8,0.3)]" />
    </div>
  );
}
