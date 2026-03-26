import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, MapPin, Clock3, Trophy } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { TeamMark } from "@/components/ui/team-mark";
import { FALLBACK_MATCHES } from "@/lib/fallback-data";
import { getMatch } from "@/lib/server/crex-data";

export const revalidate = 30;

type MatchPageProps = { params: Promise<{ id: string }> };

export async function generateStaticParams() {
  return FALLBACK_MATCHES.map((match) => ({ id: match.id }));
}

export async function generateMetadata({ params }: MatchPageProps): Promise<Metadata> {
  const { id } = await params;
  const match = await getMatch(id);
  const title = match
    ? `${match.team1.abbr} vs ${match.team2.abbr} — CREX`
    : "Match Details — CREX";
  return {
    title,
    description: match
      ? `${match.title} at ${match.venue}. ${match.result ?? match.note ?? "Live scores on CREX."}`
      : "IPL match details on CREX.",
  };
}

function formatMatchTime(iso?: string) {
  if (!iso) return "TBC";
  return new Date(iso).toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default async function MatchDetailPage({ params }: MatchPageProps) {
  const { id } = await params;
  const match = await getMatch(id);

  if (!match) notFound();

  const isCompleted = match.status === "completed";
  const isLive = match.status === "live";

  return (
    <main className="min-h-screen">
      <Navbar />

      {/* Hero banner */}
      <section
        className="relative overflow-hidden"
        style={{
          background: "linear-gradient(135deg, var(--crex-ink), var(--crex-ink-light, #1a2744))",
        }}
      >
        <div className="crex-container py-10 md:py-16">
          <Link
            href={`/matches?tab=${isCompleted ? "recent" : match.status}`}
            className="inline-flex items-center gap-2 text-sm font-semibold text-white/60 hover:text-white transition-colors"
          >
            <ArrowLeft size={16} />
            Back to Match Center
          </Link>

          <p className="mt-6 text-xs font-semibold uppercase tracking-[0.2em] text-white/50">
            {match.series ?? "IPL 2026"}
          </p>
          <h1 className="mt-2 font-display text-5xl uppercase leading-none text-white md:text-7xl">
            {match.team1.abbr} vs {match.team2.abbr}
          </h1>
          <p className="mt-3 text-lg text-white/70">{match.title}</p>

          {/* Status badge */}
          <div className="mt-6">
            {isLive && (
              <span className="inline-flex items-center gap-2 rounded-full bg-green-500/20 px-4 py-2 text-sm font-bold text-green-400">
                <span className="h-2 w-2 rounded-full bg-green-400 animate-pulse" />
                LIVE
              </span>
            )}
            {isCompleted && (
              <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-bold text-white/80">
                <Trophy size={14} />
                COMPLETED
              </span>
            )}
            {match.status === "upcoming" && (
              <span className="inline-flex items-center gap-2 rounded-full bg-crex-accent/20 px-4 py-2 text-sm font-bold text-crex-accent">
                UPCOMING
              </span>
            )}
          </div>
        </div>
      </section>

      {/* Scorecard */}
      <section className="crex-section">
        <div className="crex-container">
          <div className="grid gap-8 md:grid-cols-2">
            {/* Team 1 */}
            <div className="crex-card">
              <div className="flex items-center gap-4">
                <TeamMark abbr={match.team1.abbr} logo={match.team1.logo} />
                <div>
                  <h2 className="font-display text-3xl uppercase text-crex-text">
                    {match.team1.name}
                  </h2>
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-crex-muted">
                    {match.team1.abbr}
                  </p>
                </div>
              </div>
              <div className="mt-6">
                <p className="font-mono text-5xl font-bold text-crex-text">
                  {match.team1.score ?? "—/—"}
                </p>
              </div>
            </div>

            {/* Team 2 */}
            <div className="crex-card">
              <div className="flex items-center gap-4">
                <TeamMark abbr={match.team2.abbr} logo={match.team2.logo} />
                <div>
                  <h2 className="font-display text-3xl uppercase text-crex-text">
                    {match.team2.name}
                  </h2>
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-crex-muted">
                    {match.team2.abbr}
                  </p>
                </div>
              </div>
              <div className="mt-6">
                <p className="font-mono text-5xl font-bold text-crex-text">
                  {match.team2.score ?? "—/—"}
                </p>
              </div>
            </div>
          </div>

          {/* Match info */}
          <div className="mt-8 crex-card">
            <div className="grid gap-6 md:grid-cols-3">
              <div>
                <p className="text-xs uppercase tracking-[0.16em] text-crex-muted">Venue</p>
                <p className="mt-2 flex items-center gap-2 text-sm font-semibold text-crex-text">
                  <MapPin size={14} className="text-crex-accent" />
                  {match.venue || "TBC"}
                </p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.16em] text-crex-muted">Date & Time</p>
                <p className="mt-2 flex items-center gap-2 text-sm font-semibold text-crex-text">
                  <Clock3 size={14} className="text-crex-accent" />
                  {formatMatchTime(match.startTime)}
                </p>
              </div>
              {match.oversBowled && (
                <div>
                  <p className="text-xs uppercase tracking-[0.16em] text-crex-muted">Overs</p>
                  <p className="mt-2 font-mono text-sm font-bold text-crex-text">
                    {match.oversBowled} overs bowled
                  </p>
                </div>
              )}
            </div>

            {/* Result */}
            {match.result && (
              <div className="mt-6 rounded-2xl bg-crex-surface p-5">
                <p className="text-xs uppercase tracking-[0.16em] text-crex-muted">Result</p>
                <p className="mt-2 font-display text-2xl uppercase text-crex-text">
                  {match.result}
                </p>
              </div>
            )}

            {/* Note */}
            {match.note && (
              <div className="mt-4 rounded-2xl bg-crex-surface p-5">
                <p className="text-xs uppercase tracking-[0.16em] text-crex-muted">Match Note</p>
                <p className="mt-2 text-sm leading-6 text-crex-text">{match.note}</p>
              </div>
            )}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
