import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { PlayerAvatar } from "@/components/ui/player-avatar";
import { NumberTicker } from "@/components/ui/number-ticker";
import { FantasyInsightChip } from "@/components/sections/fantasy-insight-chip";
import { PlayerStatCard } from "@/components/sections/player-stat-card";
import { FALLBACK_PLAYERS } from "@/lib/fallback-data";
import { getPlayer } from "@/lib/server/crex-data";

export const revalidate = 3600;

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

function StatValue({ value }: { value: number | string }) {
  if (typeof value === "number") {
    return <NumberTicker value={value} className="font-mono text-4xl font-bold" />;
  }
  return <span className="font-mono text-4xl font-bold">{value}</span>;
}

export default async function PlayerPage({ params }: PlayerPageProps) {
  const { id } = await params;
  const player = await getPlayer(id);

  if (!player) notFound();

  const battingStats = [
    { label: "Runs", value: player.stats.runs, tone: "bg-crex-surface text-crex-text" },
    { label: "Average", value: player.stats.average, tone: "bg-crex-accent text-crex-surface" },
    { label: "Strike Rate", value: player.stats.strikeRate, tone: "bg-crex-accent-soft text-crex-surface" },
    { label: "100s", value: player.stats.hundreds, tone: "bg-crex-hot text-white" },
    { label: "50s", value: player.stats.fifties, tone: "bg-crex-surface text-crex-text" },
  ];

  const bowlingStats = [
    { label: "Wickets", value: player.stats.wickets, tone: "bg-crex-surface text-crex-text" },
    { label: "Economy", value: player.stats.economy, tone: "bg-crex-accent text-crex-surface" },
    { label: "Dismissals", value: player.stats.dismissals, tone: "bg-crex-accent-soft text-crex-surface" },
    { label: "Best Figures", value: player.stats.bestFigures ?? "-", tone: "bg-crex-hot text-white" },
  ];

  const similar = FALLBACK_PLAYERS.filter((item) => item.role === player.role && item.id !== player.id).slice(0, 3);

  return (
    <main className="min-h-screen">
      <Navbar />

      <section className="crex-red-surface border-b-4 border-crex-accent py-10">
        <div className="crex-container">
          <Link href="/players" className="inline-flex items-center gap-2 font-display text-2xl uppercase tracking-[0.08em] text-white">
            <ArrowLeft size={18} />
            All Players
          </Link>

          <div className="mt-8 grid gap-8 lg:grid-cols-[360px_1fr]">
            <div className="crex-frame bg-[linear-gradient(180deg,rgba(255,255,255,0.62),rgba(255,255,255,0.96))] p-6">
              <PlayerAvatar
                name={player.name}
                src={player.image}
                espnId={player.espnId}
                queryName={player.name}
                color={player.teamColor}
                className="h-[480px] w-full"
                priority
              />
            </div>

            <div className="crex-card">
              <div className="flex flex-wrap gap-3">
                <span className="border-2 border-crex-border bg-crex-accent-soft px-3 py-1 font-display text-2xl uppercase tracking-[0.08em] text-white shadow-[3px_3px_0_var(--crex-shadow)]">
                  {player.role}
                </span>
                <span className="border-2 border-crex-border bg-crex-hot px-3 py-1 font-display text-2xl uppercase tracking-[0.08em] text-white shadow-[3px_3px_0_var(--crex-shadow)]">
                  {player.team}
                </span>
              </div>

              <h1 className="mt-5 font-poster text-[4.75rem] uppercase leading-[0.82] text-crex-text crex-blue-shadow md:text-[7rem]">{player.name}</h1>
              <div className="mt-4 flex flex-wrap gap-3">
                <FantasyInsightChip label={player.fantasyTag ?? "Form Pick"} />
                <span className="border-2 border-crex-border bg-crex-surface px-3 py-1 font-display text-2xl uppercase tracking-[0.08em] text-crex-accent shadow-[3px_3px_0_var(--crex-shadow)]">
                  {player.nationality}
                </span>
              </div>

              <div className="mt-8">
                <h2 className="font-display text-3xl uppercase tracking-[0.08em] text-crex-text">Batting</h2>
                <div className="mt-3 h-1 bg-crex-hot" />
                <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                  {battingStats.map((stat) => (
                    <div key={stat.label} className={`crex-stat-tile text-left ${stat.tone}`}>
                      <p className="font-display text-xl uppercase tracking-[0.08em]">{stat.label}</p>
                      <div className="mt-3">
                        <StatValue value={stat.value} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-10">
                <h2 className="font-display text-3xl uppercase tracking-[0.08em] text-crex-text">Bowling</h2>
                <div className="mt-3 h-1 bg-crex-hot" />
                <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                  {bowlingStats.map((stat) => (
                    <div key={stat.label} className={`crex-stat-tile text-left ${stat.tone}`}>
                      <p className="font-display text-xl uppercase tracking-[0.08em]">{stat.label}</p>
                      <div className="mt-3">
                        <StatValue value={stat.value} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-10 grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
                <div>
                  <h2 className="font-display text-3xl uppercase tracking-[0.08em] text-crex-text">Career Graph</h2>
                  <div className="mt-5 space-y-4">
                    {player.career.map((season) => (
                      <div key={season.season}>
                        <div className="flex items-center justify-between font-display text-2xl uppercase tracking-[0.08em] text-crex-text">
                          <span>{season.season}</span>
                          <span>{season.runs} runs / {season.wickets} wkts</span>
                        </div>
                        <div className="mt-2 border-4 border-crex-border bg-crex-surface p-1">
                          <div className="h-5 bg-crex-accent" style={{ width: `${Math.max(8, Math.min(100, season.runs / 12))}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h2 className="font-display text-3xl uppercase tracking-[0.08em] text-crex-text">Recent Form</h2>
                  <div className="mt-5 grid grid-cols-5 gap-3">
                    {player.recentForm.map((value, index) => (
                      <div key={index} className="crex-stat-tile bg-crex-surface">
                        <p className="font-display text-sm uppercase tracking-[0.08em] text-crex-text">Inn {index + 1}</p>
                        <p className="mt-3 font-mono text-3xl font-bold text-crex-accent">{value}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-10">
                <h2 className="font-display text-3xl uppercase tracking-[0.08em] text-crex-text">Highlights</h2>
                <div className="mt-5 grid gap-3 lg:grid-cols-3">
                  {player.highlights.map((highlight, index) => (
                    <div key={index} className="border-4 border-crex-border bg-crex-surface p-4 text-xl uppercase leading-6 text-crex-text shadow-[6px_6px_0_var(--crex-shadow)]">
                      {highlight}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="crex-section">
        <div className="crex-container">
          <div className="max-w-3xl rounded-[2rem] border-2 border-white/20 bg-[linear-gradient(135deg,rgba(37,18,77,0.92),rgba(76,29,149,0.82)_58%,rgba(29,78,216,0.54))] px-6 py-6 shadow-[0_24px_44px_rgba(37,18,77,0.26)] backdrop-blur-sm md:px-8">
            <p className="font-display text-3xl uppercase tracking-[0.08em] text-crex-surface">Same Role</p>
            <h2 className="mt-3 font-poster text-[4rem] uppercase leading-[0.84] text-white [text-shadow:0_4px_0_rgba(37,18,77,0.42)] md:text-[5.75rem]">
              Similar Players
            </h2>
          </div>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {similar.map((item) => (
              <PlayerStatCard key={item.id} player={item} />
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
