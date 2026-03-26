"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { PageHeader } from "@/components/ui/page-header";
import { ComparisonTable } from "@/components/ui/comparison-table";
import { PlayerSearch } from "@/components/ui/PlayerSearch";
import { MomentumMeter } from "@/components/sections/momentum-meter";
import { usePlayers } from "@/hooks/usePlayers";
import { useMatches } from "@/hooks/useMatches";
import { FALLBACK_MATCHES, getPitchReport, getWinProbability } from "@/lib/fallback-data";
import { getTeamByAbbr } from "@/lib/constants/teams";
import type { MomentumPayload, WinProbabilitySnapshot } from "@/lib/types";

function createPendingMomentum(matchId: string, team1: string, team2: string, venue: string): MomentumPayload {
  return {
    matchId,
    teams: [team1, team2],
    venue,
    innings: [
      { team: team1, overs: [], total: 0, wickets: 0 },
      { team: team2, overs: [], total: 0, wickets: 0 },
    ],
  };
}

export function AnalyticsPageClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { players } = usePlayers({ limit: 120 });
  const liveMatches = useMatches("live", 1);
  const upcomingMatches = useMatches("upcoming", 1);
  const hasLiveMatch = liveMatches.matches.length > 0;
  const currentMatch = liveMatches.matches[0] ?? upcomingMatches.matches[0] ?? FALLBACK_MATCHES[0];
  const fallbackMomentum = useMemo(
    () => createPendingMomentum(currentMatch?.id ?? "fallback", currentMatch?.team1.abbr ?? "IPL", currentMatch?.team2.abbr ?? "IPL", currentMatch?.venue ?? "Venue TBC"),
    [currentMatch?.id, currentMatch?.team1.abbr, currentMatch?.team2.abbr, currentMatch?.venue]
  );
  const [copied, setCopied] = useState(false);
  const [winProbability, setWinProbability] = useState<WinProbabilitySnapshot>(getWinProbability(currentMatch?.id));
  const [momentum, setMomentum] = useState<MomentumPayload>(fallbackMomentum);

  const defaultPlayers = [players[0], players[1]].filter(Boolean);
  const player1 = players.find((item) => item.id === searchParams.get("p1")) ?? defaultPlayers[0];
  const player2 = players.find((item) => item.id === searchParams.get("p2")) ?? defaultPlayers[1];
  const pitchReport = useMemo(() => getPitchReport(currentMatch?.venue), [currentMatch?.venue]);

  useEffect(() => {
    if (!currentMatch?.id) return;

    setWinProbability(getWinProbability(currentMatch.id));
    setMomentum(fallbackMomentum);

    let mounted = true;
    Promise.all([
      fetch(`/api/analytics/win-probability?matchId=${currentMatch.id}`).then((response) => response.json()),
      fetch(`/api/analytics/momentum?matchId=${currentMatch.id}`).then((response) => response.json()),
    ])
      .then(([nextWinProbability, nextMomentum]) => {
        if (!mounted) return;
        setWinProbability(nextWinProbability);
        setMomentum(nextMomentum);
      })
      .catch(() => {
        if (!mounted) return;
        setWinProbability(getWinProbability(currentMatch.id));
        setMomentum(fallbackMomentum);
      });

    return () => {
      mounted = false;
    };
  }, [currentMatch?.id, fallbackMomentum]);

  const comparisonRows = useMemo(() => {
    if (!player1 || !player2) return [];
    const rows = [
      { metric: "Runs", player1: player1.stats.runs, player2: player2.stats.runs },
      { metric: "Average", player1: player1.stats.average, player2: player2.stats.average },
      { metric: "SR", player1: player1.stats.strikeRate, player2: player2.stats.strikeRate },
      { metric: "Wickets", player1: player1.stats.wickets, player2: player2.stats.wickets },
      { metric: "Economy", player1: player1.stats.economy, player2: player2.stats.economy },
      { metric: "Form", player1: player1.recentForm.reduce((a, b) => a + b, 0), player2: player2.recentForm.reduce((a, b) => a + b, 0) },
    ];

    return rows.map((row) => ({
      ...row,
      winner:
        row.player1 === row.player2
          ? ("tie" as const)
          : Number(row.player1) > Number(row.player2)
            ? ("player1" as const)
            : ("player2" as const),
    }));
  }, [player1, player2]);

  const syncPlayers = (nextP1: string, nextP2: string) => {
    router.replace(`/analytics?p1=${nextP1}&p2=${nextP2}`);
  };

  const momentumTeam1 = momentum.innings[0]?.team ?? currentMatch?.team1.abbr ?? "IPL";
  const momentumTeam2 = momentum.innings[1]?.team ?? currentMatch?.team2.abbr ?? "IPL";
  
  const momentumTeam1Color = getTeamByAbbr(momentumTeam1)?.primaryColor ?? "var(--crex-accent)";
  let momentumTeam2Color = getTeamByAbbr(momentumTeam2)?.primaryColor ?? "#1d2d6b";
  
  // Distinguish teams with very similar primary colors (like PBKS and RCB)
  if (
    momentumTeam1Color === momentumTeam2Color ||
    (momentumTeam1 === "RCB" && momentumTeam2 === "PBKS") ||
    (momentumTeam1 === "PBKS" && momentumTeam2 === "RCB")
  ) {
    momentumTeam2Color = getTeamByAbbr(momentumTeam2)?.accentColor ?? "#0a0f1e";
  }

  return (
    <>
      <PageHeader
        title="CREX Analytics"
        subtitle="Win probability, momentum swings, player comparison, fantasy picks, and venue context for investor-grade demos."
        badge="BETA"
        eyebrow="Predictive Engine"
      />
      <section className="crex-section">
        <div className="crex-container space-y-8">
          {hasLiveMatch ? (
            <>
              <div className="crex-card">
                <h2 className="font-display text-4xl uppercase text-crex-text">Match Win Probability</h2>
                <div className="mt-6 grid gap-3 md:grid-cols-[auto_1fr_auto] md:items-center">
                  <div className="text-sm font-semibold text-crex-text">
                    {winProbability.team1} {winProbability.team1WinPct}%
                  </div>
                  <div className="h-5 overflow-hidden rounded-full bg-crex-surface">
                    <div className="flex h-full">
                      <div className="h-full transition-all duration-500" style={{ width: `${winProbability.team1WinPct}%`, background: getTeamByAbbr(winProbability.team1)?.primaryColor ?? "var(--crex-accent)" }} />
                      <div className="h-full transition-all duration-500" style={{ width: `${winProbability.team2WinPct}%`, background: getTeamByAbbr(winProbability.team2)?.primaryColor ?? "#1d2d6b" }} />
                    </div>
                  </div>
                  <div className="text-right text-sm font-semibold text-crex-text">
                    {winProbability.team2WinPct}% {winProbability.team2}
                  </div>
                </div>
                <p className="mt-4 text-sm text-crex-muted">{winProbability.reason || "Analysis pending"}</p>
              </div>

              <div>
                <h2 className="mb-4 font-display text-4xl uppercase text-crex-text">Momentum Tracker</h2>
                <MomentumMeter
                  team1={{
                    name: momentumTeam1,
                    color: momentumTeam1Color,
                    overs: momentum.innings[0]?.overs ?? fallbackMomentum.innings[0].overs,
                  }}
                  team2={{
                    name: momentumTeam2,
                    color: momentumTeam2Color,
                    overs: momentum.innings[1]?.overs ?? fallbackMomentum.innings[1].overs,
                  }}
                />
              </div>
            </>
          ) : (
            <div className="crex-empty-state">
              <h2 className="font-display text-2xl uppercase text-crex-text">No live match analysis available</h2>
              <p className="text-sm text-crex-muted">Match win probability and over-by-over momentum tracker will activate automatically when a match goes live.</p>
            </div>
          )}

          <div className="crex-card" style={{ overflow: "visible" }}>
            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div>
                <h2 className="font-display text-4xl uppercase text-crex-text">Player Comparison Tool</h2>
                <p className="mt-2 text-sm text-crex-muted">Search two players, compare the shape, then share the URL.</p>
              </div>
              <button
                className="tap-target rounded-2xl border border-crex-border bg-white px-4 py-3 text-sm font-semibold text-crex-text"
                onClick={async () => {
                  await navigator.clipboard.writeText(window.location.href);
                  setCopied(true);
                  setTimeout(() => setCopied(false), 1200);
                }}
              >
                {copied ? "Link copied" : "Share Comparison"}
              </button>
            </div>
            <div className="mt-6 grid gap-4 md:grid-cols-2" style={{ position: "relative", zIndex: 20 }}>
              <PlayerSearch
                players={players.slice(0, 120)}
                selected={player1 ?? null}
                onSelect={(p) => { if (player2) syncPlayers(p.id, player2.id); }}
                placeholder="Search Player 1…"
              />
              <PlayerSearch
                players={players.slice(0, 120)}
                selected={player2 ?? null}
                onSelect={(p) => { if (player1) syncPlayers(player1.id, p.id); }}
                placeholder="Search Player 2…"
              />
            </div>
            {player1 && player2 ? (
              <ComparisonTable className="mt-6" rows={comparisonRows} player1Name={player1.name} player2Name={player2.name} />
            ) : null}
          </div>

          <div className="crex-card">
            <h2 className="font-display text-4xl uppercase text-crex-text">Pitch Report</h2>
            <div className="mt-5 space-y-4">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.16em] text-crex-muted">Venue</p>
                  <p className="mt-1 text-lg font-semibold text-crex-text">{pitchReport.venue}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.16em] text-crex-muted">Average First Innings</p>
                  <p className="mt-1 font-mono text-3xl font-bold text-crex-text">{pitchReport.averageFirstInnings}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.16em] text-crex-muted">Chase Win Rate</p>
                  <p className="mt-1 font-mono text-3xl font-bold text-crex-text">{pitchReport.chaseWinRate}%</p>
                </div>
              </div>
              <p className="mt-4 text-sm leading-7 text-crex-muted border-t border-crex-border pt-4">
                <span className="font-semibold text-crex-text uppercase tracking-widest text-xs mr-2 border border-crex-border rounded-lg px-2 py-1">Conditions</span>
                {pitchReport.conditions}
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
