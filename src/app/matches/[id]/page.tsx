import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Clock3, MapPin, Trophy } from "lucide-react";
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
  const title = match ? `${match.team1.abbr} vs ${match.team2.abbr} - CREX` : "Match Details - CREX";
  return {
    title,
    description: match ? `${match.title} at ${match.venue}. ${match.result ?? match.note ?? "Live scores on CREX."}` : "IPL match details on CREX.",
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

      <section className="crex-red-surface border-b-4 border-crex-accent py-10">
        <div className="crex-container">
          <Link
            href={`/matches?tab=${isCompleted ? "recent" : match.status}`}
            className="inline-flex items-center gap-2 font-display text-2xl uppercase tracking-[0.08em] text-white"
          >
            <ArrowLeft size={18} />
            Back to Match Center
          </Link>

          <div className="mt-6">
            <p className="font-display text-3xl uppercase tracking-[0.08em] text-crex-surface">{match.series ?? "IPL 2026"}</p>
            <h1 className="mt-3 font-poster text-[4.5rem] uppercase leading-[0.82] text-white crex-title-shadow md:text-[7rem]">
              {match.team1.abbr} vs {match.team2.abbr}
            </h1>
            <p className="mt-4 max-w-3xl text-2xl uppercase leading-7 text-white">{match.title}</p>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            {isLive ? (
              <span className="border-2 border-crex-border bg-[#00c978] px-3 py-1 font-display text-2xl uppercase tracking-[0.08em] text-crex-text shadow-[4px_4px_0_var(--crex-shadow)]">
                Live
              </span>
            ) : null}
            {isCompleted ? (
              <span className="inline-flex items-center gap-2 border-2 border-crex-border bg-crex-panel px-3 py-1 font-display text-2xl uppercase tracking-[0.08em] text-crex-text shadow-[4px_4px_0_var(--crex-shadow)]">
                <Trophy size={18} />
                Completed
              </span>
            ) : null}
            {match.status === "upcoming" ? (
              <span className="border-2 border-crex-border bg-crex-accent px-3 py-1 font-display text-2xl uppercase tracking-[0.08em] text-crex-surface shadow-[4px_4px_0_var(--crex-shadow)]">
                Upcoming
              </span>
            ) : null}
          </div>
        </div>
      </section>

      <section className="crex-section">
        <div className="crex-container space-y-8">
          <div className="grid gap-6 md:grid-cols-2">
            {[match.team1, match.team2].map((team, index) => (
              <div key={team.abbr} className={`crex-card ${index === 0 ? "bg-crex-panel" : "bg-[#f6efe8]"}`}>
                <div className="flex items-center gap-4">
                  <TeamMark abbr={team.abbr} logo={team.logo} className="h-16 w-16" />
                  <div>
                    <h2 className="font-display text-4xl uppercase tracking-[0.08em] text-crex-accent">{team.name}</h2>
                    <p className="font-display text-2xl uppercase tracking-[0.08em] text-crex-hot">{team.abbr}</p>
                  </div>
                </div>
                <div className="mt-8 border-4 border-crex-border bg-crex-surface p-5">
                  <p className="font-display text-2xl uppercase tracking-[0.08em] text-crex-text">Score</p>
                  <p className="mt-3 font-mono text-6xl font-bold text-crex-accent">{team.score ?? "--/--"}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="crex-card">
            <p className="font-display text-3xl uppercase tracking-[0.08em] text-crex-hot">Match Context</p>
            <div className="mt-6 grid gap-4 md:grid-cols-3">
              <div className="crex-stat-tile bg-crex-surface text-left">
                <p className="font-display text-xl uppercase tracking-[0.08em] text-crex-text">Venue</p>
                <p className="mt-3 flex items-center gap-2 text-2xl uppercase text-crex-accent">
                  <MapPin size={18} />
                  {match.venue || "TBC"}
                </p>
              </div>
              <div className="crex-stat-tile bg-crex-accent text-left text-crex-surface">
                <p className="font-display text-xl uppercase tracking-[0.08em]">Date & Time</p>
                <p className="mt-3 flex items-start gap-2 text-2xl uppercase">
                  <Clock3 size={18} className="mt-1 shrink-0" />
                  <span>{formatMatchTime(match.startTime)}</span>
                </p>
              </div>
              <div className="crex-stat-tile bg-crex-hot text-left text-white">
                <p className="font-display text-xl uppercase tracking-[0.08em]">Overs</p>
                <p className="mt-3 font-mono text-4xl font-bold">{match.oversBowled ?? "--"}</p>
              </div>
            </div>

            {match.result ? (
              <div className="mt-6 border-4 border-crex-border bg-crex-panel p-5">
                <p className="font-display text-2xl uppercase tracking-[0.08em] text-crex-hot">Result</p>
                <p className="mt-3 font-poster text-[3rem] uppercase leading-[0.84] text-crex-accent crex-title-shadow md:text-[4rem]">{match.result}</p>
              </div>
            ) : null}

            {match.note ? (
              <div className="mt-6 border-4 border-crex-border bg-crex-surface p-5">
                <p className="font-display text-2xl uppercase tracking-[0.08em] text-crex-hot">Match Note</p>
                <p className="mt-3 text-2xl uppercase leading-7 text-crex-text">{match.note}</p>
              </div>
            ) : null}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
