"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { PageHeader } from "@/components/ui/page-header";
import { ComparisonTable } from "@/components/ui/comparison-table";
import { PlayerAvatar } from "@/components/ui/player-avatar";
import { PlayerSearch } from "@/components/ui/PlayerSearch";
import { FantasyInsightChip } from "@/components/sections/fantasy-insight-chip";
import { MomentumMeter } from "@/components/sections/momentum-meter";
import { usePlayers } from "@/hooks/usePlayers";
import { useMatches } from "@/hooks/useMatches";
import { FALLBACK_ANALYTICS, FALLBACK_MATCHES, getPitchReport, getWinProbability } from "@/lib/fallback-data";
import { getTeamByAbbr } from "@/lib/constants/teams";
import type { FantasyPick, MomentumPayload, WinProbabilitySnapshot } from "@/lib/types";

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
  const currentMatch = liveMatches.matches[0] ?? upcomingMatches.matches[0] ?? FALLBACK_MATCHES[0];
  const fallbackMomentum = useMemo(
    () => createPendingMomentum(currentMatch?.id ?? "fallback", currentMatch?.team1.abbr ?? "IPL", currentMatch?.team2.abbr ?? "IPL", currentMatch?.venue ?? "Venue TBC"),
    [currentMatch?.id, currentMatch?.team1.abbr, currentMatch?.team2.abbr, currentMatch?.venue]
  );
  const [copied, setCopied] = useState(false);
  const [winProbability, setWinProbability] = useState<WinProbabilitySnapshot>(getWinProbability(currentMatch?.id));
  const [momentum, setMomentum] = useState<MomentumPayload>(fallbackMomentum);
  const [fantasyPicks, setFantasyPicks] = useState<FantasyPick[]>(FALLBACK_ANALYTICS.fantasyPicks);

  const defaultPlayers = [players[0], players[1]].filter(Boolean);
  const player1 = players.find((item) => item.id === searchParams.get("p1")) ?? defaultPlayers[0];
  const player2 = players.find((item) => item.id === searchParams.get("p2")) ?? defaultPlayers[1];
  const pitchReport = useMemo(() => getPitchReport(currentMatch?.venue), [currentMatch?.venue]);

  useEffect(() => {
    if (!currentMatch?.id) return;

    setWinProbability(getWinProbability(currentMatch.id));
    setMomentum(fallbackMomentum);
    setFantasyPicks(FALLBACK_ANALYTICS.fantasyPicks);

    let mounted = true;
    Promise.all([
      fetch(`/api/analytics/win-probability?matchId=${currentMatch.id}`).then((response) => response.json()),
      fetch(`/api/analytics/momentum?matchId=${currentMatch.id}`).then((response) => response.json()),
      fetch(`/api/analytics/fantasy-picks?matchId=${currentMatch.id}`).then((response) => response.json()),
    ])
      .then(([nextWinProbability, nextMomentum, nextFantasyPicks]) => {
        if (!mounted) return;
        setWinProbability(nextWinProbability);
        setMomentum(nextMomentum);
        setFantasyPicks(nextFantasyPicks);
      })
      .catch(() => {
        if (!mounted) return;
        setWinProbability(getWinProbability(currentMatch.id));
        setMomentum(fallbackMomentum);
        setFantasyPicks(FALLBACK_ANALYTICS.fantasyPicks);
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

  const momentumTeam1Color = getTeamByAbbr(momentum.innings[0]?.team)?.primaryColor ?? "var(--crex-accent)";
  const momentumTeam2Color = getTeamByAbbr(momentum.innings[1]?.team)?.primaryColor ?? "#1d2d6b";

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
                name: momentum.innings[0]?.team ?? currentMatch?.team1.abbr ?? "IPL",
                color: momentumTeam1Color,
                overs: momentum.innings[0]?.overs ?? fallbackMomentum.innings[0].overs,
              }}
              team2={{
                name: momentum.innings[1]?.team ?? currentMatch?.team2.abbr ?? "IPL",
                color: momentumTeam2Color,
                overs: momentum.innings[1]?.overs ?? fallbackMomentum.innings[1].overs,
              }}
            />
          </div>

          <div className="crex-card">
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
            <div className="mt-6 grid gap-4 md:grid-cols-2">
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

          <div className="grid gap-6 lg:grid-cols-[1.3fr_1fr]">
            <div className="crex-card">
              <h2 className="font-display text-4xl uppercase text-crex-text">Fantasy Picks Board</h2>
              <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {fantasyPicks.map((pick) => {
                  const player = players.find((item) => item.id === pick.playerId);
                  if (!player) return null;
                  return (
                    <div key={pick.playerId} className="rounded-2xl bg-crex-surface p-4">
                      <div className="flex items-center gap-3">
                        <PlayerAvatar
                          name={player.name}
                          src={player.image}
                          espnId={player.espnId}
                          queryName={player.name}
                          color={player.teamColor}
                          className="h-12 w-12"
                        />
                        <div>
                          <p className="font-semibold text-crex-text">{player.name}</p>
                          <FantasyInsightChip label={pick.label} />
                        </div>
                      </div>
                      <p className="mt-3 text-sm leading-6 text-crex-muted">{pick.reason}</p>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="crex-card">
              <h2 className="font-display text-4xl uppercase text-crex-text">Pitch Report</h2>
              <div className="mt-5 space-y-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.16em] text-crex-muted">Venue</p>
                  <p className="text-lg font-semibold text-crex-text">{pitchReport.venue}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.16em] text-crex-muted">Average First Innings</p>
                  <p className="font-mono text-3xl font-bold text-crex-text">{pitchReport.averageFirstInnings}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.16em] text-crex-muted">Chase Win Rate</p>
                  <p className="font-mono text-3xl font-bold text-crex-text">{pitchReport.chaseWinRate}%</p>
                </div>
                <p className="text-sm leading-7 text-crex-muted">{pitchReport.conditions}</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
