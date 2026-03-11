import { stitchPlayer } from "@/lib/player-registry";
import { PLAYERS as STATIC_PLAYERS } from "@/data/players";
import { notFound } from "next/navigation";
import playerStatsRaw from "../../../../public/data/player-stats.json";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { PlayerProfileClient } from "./PlayerProfileClient";
import { LiveStatsPanel } from "./LiveStatsPanel";

const playerStats = playerStatsRaw as Record<string, {
  batting: { matches: number; innings: number; runs: number; balls: number; fours: number; sixes: number; dismissals: number; highest: number; centuries: number; fifties: number; avg: number; sr: number };
  bowling: { balls: number; runs_conceded: number; wickets: number; maidens: number; avg: number; econ: number };
}>;

async function getAllPlayers() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/ipl-players`, {
      next: { revalidate: 86400 }
    })
    const d = await res.json()
    const raw = d.data ?? []
    if (raw.length === 0) return STATIC_PLAYERS
    return raw.map(stitchPlayer)
  } catch {
    return STATIC_PLAYERS
  }
}

export async function generateStaticParams() {
  const players = await getAllPlayers();
  return players.map((p: any) => ({ id: p.id }));
}

const getRoleStyle = (role: string) => {
  switch (role) {
    case "BATTER": return { bg: "#E63946", text: "#FFFFFF" };
    case "BOWLER": return { bg: "#00C9A7", text: "#080C18" };
    case "ALLROUNDER": return { bg: "#9B5DE5", text: "#FFFFFF" };
    case "WICKETKEEPER": return { bg: "#1A1AE6", text: "#F5C518" };
    default: return { bg: "#080C18", text: "#FFFFFF" };
  }
};

export default async function PlayerPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const players = await getAllPlayers();
  const player = players.find((p: any) => p.id === id);
  if (!player) notFound();

  const stats = playerStats[player.cricsheetName];
  const rs = getRoleStyle(player.role);

  const battingEntries = stats ? [
    ["Matches", stats.batting.matches],
    ["Innings", stats.batting.innings],
    ["Runs", stats.batting.runs],
    ["Balls", stats.batting.balls],
    ["Average", stats.batting.avg],
    ["Strike Rate", stats.batting.sr],
    ["Highest", stats.batting.highest],
    ["100s", stats.batting.centuries],
    ["50s", stats.batting.fifties],
    ["4s", stats.batting.fours],
    ["6s", stats.batting.sixes],
  ] : [];

  const bowlingEntries = stats && stats.bowling.balls > 0 ? [
    ["Wickets", stats.bowling.wickets],
    ["Economy", stats.bowling.econ],
    ["Average", stats.bowling.avg],
    ["Maidens", stats.bowling.maidens],
    ["Balls", stats.bowling.balls],
    ["Runs Conceded", stats.bowling.runs_conceded],
  ] : [];

  return (
    <main className="min-h-screen" style={{ background: player.teamColor }}>
      {/* Team color top border */}
      <div className="w-full h-1" style={{ background: "#FFFFFF" }} />

      <div className="max-w-6xl mx-auto px-6 md:px-12 pt-8">
        <Link href="/players" className="inline-flex items-center gap-2 text-white hover:opacity-80 transition-opacity mb-8 font-bold" style={{ fontFamily: "Inter, sans-serif" }}>
          <ArrowLeft size={18} /> ALL PLAYERS
        </Link>
      </div>

      <div className="max-w-6xl mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-[40%_1fr] gap-12 items-start pb-16">
        {/* Left — Image */}
        <div className="relative w-full aspect-[3/4] rounded-sm overflow-hidden border-4 border-[#080C18] shadow-[8px_8px_0_#080C18]" style={{ background: "white" }}>
          <PlayerProfileClient espnId={player.espnId} name={player.name} teamColor={player.teamColor} />
          <div className="absolute inset-0" style={{ background: `linear-gradient(to top, white 0%, transparent 60%)` }} />
        </div>

        {/* Right — Info */}
        <div className="bg-white p-8 border-4 border-[#080C18] shadow-[8px_8px_0_#080C18] mt-4 lg:mt-0">
          <div className="flex items-center gap-3 mb-3 flex-wrap">
            <span className="px-3 py-1 rounded-sm text-sm font-bold uppercase border-2 border-[#080C18] shadow-[2px_2px_0_#080C18]" style={{ background: rs.bg, color: rs.text, fontFamily: "Inter, sans-serif" }}>{player.role}</span>
            <span className="px-3 py-1 rounded-sm text-sm font-black uppercase text-white shadow-[2px_2px_0_#080C18] border-2 border-[#080C18]" style={{ background: player.teamColor, fontFamily: "Inter, sans-serif" }}>{player.team}</span>
            {player.active === false && (
              <span className="px-3 py-1 rounded-sm text-sm font-bold uppercase bg-[#E63946] text-[#FFFFFF] border-2 border-[#080C18] shadow-[2px_2px_0_#080C18]" style={{ fontFamily: "Inter, sans-serif" }}>RETIRED</span>
            )}
          </div>

          <h1 className="text-[clamp(48px,8vw,80px)] font-black uppercase tracking-tighter leading-[0.85] mb-8"
            style={{ fontFamily: "'Barlow Condensed', sans-serif", color: "#080C18" }}>
            {player.name}
          </h1>

          {/* Batting Stats */}
          {battingEntries.length > 0 && (
            <>
              <h2 className="text-[#080C18] text-xs uppercase tracking-widest font-black mb-4 border-b-2 pb-2" style={{ fontFamily: "Inter, sans-serif", borderColor: player.teamColor }}>BATTING</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                {battingEntries.map(([label, val]) => (
                  <div key={String(label)} className="p-3" style={{ background: "#F5C518", border: "2px solid #080C18", boxShadow: "3px 3px 0 #080C18" }}>
                    <span className="block text-[10px] uppercase font-bold mb-1 tracking-widest" style={{ fontFamily: "Inter, sans-serif", color: "#080C18" }}>{label}</span>
                    <span className="block text-2xl font-black text-[#1A1AE6]" style={{ fontFamily: "'JetBrains Mono', monospace" }}>{val}</span>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* Bowling Stats */}
          {bowlingEntries.length > 0 && (
            <>
              <h2 className="text-[#080C18] text-xs uppercase tracking-widest font-black mb-4 border-b-2 pb-2" style={{ fontFamily: "Inter, sans-serif", borderColor: player.teamColor }}>BOWLING</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
                {bowlingEntries.map(([label, val]) => (
                  <div key={String(label)} className="p-3" style={{ background: "#F5C518", border: "2px solid #080C18", boxShadow: "3px 3px 0 #080C18" }}>
                    <span className="block text-[10px] uppercase font-bold mb-1 tracking-widest" style={{ fontFamily: "Inter, sans-serif", color: "#080C18" }}>{label}</span>
                    <span className="block text-2xl font-black text-[#1A1AE6]" style={{ fontFamily: "'JetBrains Mono', monospace" }}>{val}</span>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* Highlights */}
          <h2 className="text-[#1A1AE6] text-xl font-black uppercase tracking-tight mb-6" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
            CAREER HIGHLIGHTS
          </h2>
          <div className="space-y-3">
            {player.highlights?.map((h: string, i: number) => (
              <div key={i} className="p-4 flex items-start gap-4" style={{ background: "#F5C518", borderLeft: "8px solid #1A1AE6", borderRight: "2px solid #080C18", borderTop: "2px solid #080C18", borderBottom: "2px solid #080C18", boxShadow: "3px 3px 0 #080C18" }}>
                <span className="text-[#1A1AE6] font-black text-lg shrink-0" style={{ fontFamily: "'JetBrains Mono', monospace" }}>{String(i + 1).padStart(2, "0")}</span>
                <p className="text-[#080C18] font-bold text-base leading-relaxed" style={{ fontFamily: "Inter, sans-serif" }}>{h}</p>
              </div>
            ))}
          </div>
          
          <LiveStatsPanel playerName={player.name} />
        </div>
      </div>
    </main>
  );
}
