import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { PlayerAvatar } from "@/components/ui/player-avatar";
import { NumberTicker } from "@/components/ui/number-ticker";
import { FantasyInsightChip } from "@/components/sections/fantasy-insight-chip";
import { PlayerStatCard } from "@/components/sections/player-stat-card";
import { FALLBACK_PLAYERS } from "@/lib/fallback-data";
import { getPlayer } from "@/lib/server/crex-data";

export const revalidate = 3600;

const statConfig = {
  Batsman: ["runs", "average", "strikeRate", "hundreds"],
  Bowler: ["wickets", "economy", "average", "bestFigures"],
  "All-rounder": ["runs", "wickets", "average", "strikeRate"],
  "Wicket-keeper": ["runs", "dismissals", "average", "strikeRate"],
} as const;

type PlayerPageProps = { params: Promise<{ id: string }> };

export async function generateStaticParams() {
  return FALLBACK_PLAYERS.map((player) => ({ id: player.id }));
}

export async function generateMetadata({ params }: PlayerPageProps): Promise<Metadata> {
  const { id } = await params;
  const player = await getPlayer(id);

  return {
    title: player ? `${player.name} - CREX` : "Player Profile - CREX",
    description: player ? `${player.name} profile, recent form, career stats, and fantasy read.` : "CREX player profile",
  };
}

export default async function PlayerPage({ params }: PlayerPageProps) {
  const { id } = await params;
  const player = await getPlayer(id);

  if (!player) notFound();

  const stats = statConfig[player.role].map((key) => ({ key, value: player.stats[key] ?? "-" }));
  const similar = FALLBACK_PLAYERS.filter((item) => item.role === player.role && item.id !== player.id).slice(0, 3);

  return (
    <main className="min-h-screen">
      <Navbar />
      <section
        className="overflow-hidden"
        style={{
          background: `linear-gradient(135deg, ${player.teamColor}, rgba(255,255,255,0.8))`,
        }}
      >
        <div className="crex-container grid gap-10 py-10 md:grid-cols-[280px_1fr] md:py-14">
          <PlayerAvatar
            name={player.name}
            src={player.image}
            espnId={player.espnId}
            queryName={player.name}
            color={player.teamColor}
            className="h-[320px] w-full rounded-[32px] md:h-[360px]"
            priority
          />
          <div className="self-end">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/80">
              {player.team} - {player.nationality}
            </p>
            <h1 className="mt-3 font-display text-6xl uppercase leading-none text-white md:text-8xl">{player.name}</h1>
            <div className="mt-5 flex flex-wrap gap-3">
              <span className="crex-pill border-white/20 bg-white/15 text-white">{player.role}</span>
              <FantasyInsightChip label={player.fantasyTag ?? "Form Pick"} />
            </div>
            <p className="mt-6 max-w-2xl text-sm leading-7 text-white/80">
              Live profile data is merged with CREX fallback stats so the page stays trustworthy when provider detail is partial.
            </p>
          </div>
        </div>
      </section>

      <section className="crex-section">
        <div className="crex-container">
          <div className="grid gap-4 md:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.key} className="crex-card">
                <p className="text-xs uppercase tracking-[0.16em] text-crex-muted">{stat.key}</p>
                <div className="mt-4 font-mono text-4xl font-bold text-crex-text">
                  <NumberTicker value={typeof stat.value === "number" ? stat.value : String(stat.value)} />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10 grid gap-6 lg:grid-cols-[1.5fr_1fr]">
            <div className="crex-card">
              <h2 className="font-display text-4xl uppercase text-crex-text">Career Graph</h2>
              <div className="mt-6 grid gap-4">
                {player.career.map((season) => (
                  <div key={season.season}>
                    <div className="flex items-center justify-between text-sm text-crex-muted">
                      <span>{season.season}</span>
                      <span>
                        {season.runs} runs - {season.wickets} wickets
                      </span>
                    </div>
                    <div className="mt-2 h-3 rounded-full bg-crex-surface">
                      <div
                        className="h-3 rounded-full bg-crex-accent"
                        style={{ width: `${Math.max(8, Math.min(100, season.runs / 12))}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <h2 className="mt-10 font-display text-4xl uppercase text-crex-text">Recent Form</h2>
              <div className="mt-5 grid grid-cols-5 gap-3">
                {player.recentForm.map((value, index) => (
                  <div key={index} className="rounded-2xl bg-crex-surface p-4 text-center">
                    <p className="text-xs uppercase tracking-[0.16em] text-crex-muted">Innings {index + 1}</p>
                    <p className="mt-3 font-mono text-2xl font-bold text-crex-text">{value}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-6">
              <div className="crex-card">
                <h2 className="font-display text-4xl uppercase text-crex-text">Highlight Reel</h2>
                <div className="mt-5 space-y-3">
                  {player.highlights.map((highlight, index) => (
                    <div key={index} className="rounded-2xl bg-crex-surface p-4 text-sm leading-6 text-crex-text">
                      {highlight}
                    </div>
                  ))}
                </div>
              </div>
              <div className="crex-card">
                <h2 className="font-display text-4xl uppercase text-crex-text">Fantasy Score</h2>
                <div className="mt-4 flex items-center gap-3">
                  <FantasyInsightChip label={player.fantasyTag ?? "Form Pick"} />
                  <p className="text-sm text-crex-muted">
                    Strong fit for captaincy calculations when the matchup leans toward {player.role.toLowerCase()} phases.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-10">
            <h2 className="font-display text-4xl uppercase text-crex-text">Similar Players</h2>
            <div className="mt-6 grid gap-6 md:grid-cols-3">
              {similar.map((item) => (
                <PlayerStatCard key={item.id} player={item} />
              ))}
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
