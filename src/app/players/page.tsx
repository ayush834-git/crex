"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePlayers } from "@/hooks/usePlayers";
import { PlayerImage } from "@/components/player/PlayerImage";
import { motion } from "framer-motion";

const ROLES = ["ALL", "BATTER", "BOWLER", "ALLROUNDER", "WICKETKEEPER"] as const;

interface PlayerStats {
  batting: { matches: number; runs: number; avg: number; sr: number; centuries: number };
  bowling: { wickets: number; econ: number };
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

export default function PlayersPage() {
  const { players, total } = usePlayers();
  const TEAMS = Array.from(new Set(players.map((p: any) => p.team)));
  const [roleFilter, setRoleFilter] = useState<string>("ALL");
  const [teamFilter, setTeamFilter] = useState<string | null>(null);
  const [allStats, setAllStats] = useState<Record<string, PlayerStats>>({});

  useEffect(() => {
    fetch("/data/player-stats.json")
      .then(r => r.json())
      .then(data => setAllStats(data))
      .catch(() => setAllStats({}));
  }, []);

  const filtered = players.filter((p: any) => {
    if (roleFilter !== "ALL" && p.role !== roleFilter) return false;
    if (teamFilter && p.team !== teamFilter) return false;
    return true;
  });

  return (
    <main className="min-h-screen pt-24 pb-16 px-6 md:px-12" style={{ background: "#F5C518" }}>
      <div className="max-w-7xl mx-auto">
        <h1 className="font-black uppercase tracking-tighter leading-[0.85] mb-2"
          style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: "clamp(48px,8vw,80px)", color: "#1A1AE6" }}>
          ALL PLAYERS
          <span style={{ color: "#E63946", fontSize: "0.4em", display: "block", fontFamily: "JetBrains Mono" }}>
            {total} IPL PLAYERS
          </span>
        </h1>
        <p className="font-bold text-sm uppercase tracking-widest mb-12" style={{ fontFamily: "Inter, sans-serif", color: "#1A1AE6" }}>
          IPL Career Stats from Real Match Data
        </p>

        {/* Role Filter */}
        <div className="flex flex-wrap gap-3 mb-8">
          {ROLES.map(role => (
            <button key={role} onClick={() => setRoleFilter(role)}
              className="px-6 py-2 rounded-sm text-sm font-black uppercase tracking-wider transition-all cursor-pointer shadow-[3px_3px_0_rgba(26,26,230,0.4)]"
              style={{
                fontFamily: "'Barlow Condensed', sans-serif",
                background: roleFilter === role ? "#1A1AE6" : "#FFFFFF",
                color: roleFilter === role ? "#F5C518" : "#1A1AE6",
                border: "3px solid #1A1AE6"
              }}>
              {role === "ALL" ? "ALL" : role + "S"}
            </button>
          ))}
        </div>

        {/* Team Pills */}
        <div className="flex flex-wrap gap-2 mb-12">
          <button onClick={() => setTeamFilter(null)}
            className="px-3 py-1.5 rounded-sm text-xs font-bold uppercase tracking-wider transition-all cursor-pointer shadow-[2px_2px_0_rgba(26,26,230,0.4)]"
            style={{ fontFamily: "Inter, sans-serif", background: !teamFilter ? "#1A1AE6" : "#FFFFFF", color: !teamFilter ? "#F5C518" : "#1A1AE6", border: "2px solid #1A1AE6" }}>
            ALL TEAMS
          </button>
          {TEAMS.map(team => {
            const tc = players.find((p: any) => p.team === team)?.teamColor || "#FFFFFF";
            return (
              <button key={team} onClick={() => setTeamFilter(teamFilter === team ? null : team)}
                className="px-3 py-1.5 text-xs font-bold uppercase tracking-wider transition-all cursor-pointer shadow-[2px_2px_0_rgba(26,26,230,0.4)]"
                style={{ fontFamily: "Inter, sans-serif", background: teamFilter === team ? tc : "#FFFFFF", color: teamFilter === team ? "#FFFFFF" : tc, border: `2px solid ${tc}` }}>
                {team}
              </button>
            );
          })}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {filtered.map((player, i) => {
            const rs = getRoleStyle(player.role);
            const stats = allStats[player.cricsheetName];
            const keyStat = player.role === "BOWLER"
              ? `${stats?.bowling.wickets ?? "—"} wkts`
              : `${stats?.batting.runs ?? "—"} runs`;
            const matchCount = stats?.batting.matches ?? "—";

            return (
              <motion.div key={player.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04, type: "spring", damping: 20 }}>
                <Link href={`/players/${player.id}`} className="block">
                  <div className="rounded-sm transition-all group cursor-pointer relative overflow-hidden bg-white"
                    style={{ border: `3px solid ${player.teamColor}`, boxShadow: `4px 4px 0 ${player.teamColor}` }}>
                    
                    <div className="relative w-full aspect-[3/4] overflow-hidden">
                      <PlayerImage espnId={player.espnId} name={player.name} teamColor={player.teamColor} />
                      <div className="absolute inset-0" style={{ background: `linear-gradient(to top, #FFFFFF 0%, transparent 60%)` }} />
                      
                      {player.active === false && (
                        <span className="absolute top-3 left-3 px-2 py-1 rounded-sm text-[10px] font-bold uppercase" style={{ background: "#E63946", color: "white", fontFamily: "Inter, sans-serif" }}>RETIRED</span>
                      )}
                      <span className="absolute top-3 right-3 px-2 py-0.5 rounded-sm text-[10px] font-bold" style={{ background: player.teamColor, color: "#FFFFFF", fontFamily: "Inter, sans-serif" }}>{player.team}</span>
                    </div>

                    <div className="p-4 -mt-8 relative z-10 w-full" style={{ background: "white" }}>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="px-2 py-0.5 rounded-sm text-[10px] font-bold uppercase border-2 border-[#080C18]" style={{ background: rs.bg, color: rs.text, fontFamily: "Inter, sans-serif", boxShadow: "2px 2px 0 #080C18" }}>
                          {player.role}
                        </span>
                      </div>
                      <h3 className="text-xl font-black uppercase tracking-tight mt-2" style={{ fontFamily: "'Barlow Condensed', sans-serif", color: player.teamColor }}>
                        {player.name}
                      </h3>
                      <div className="mt-2 flex flex-col">
                        <span className="text-lg font-black" style={{ fontFamily: "'JetBrains Mono', monospace", color: "#1A1AE6" }}>{keyStat}</span>
                        <span className="text-xs" style={{ fontFamily: "Inter, sans-serif", color: "#080C18", fontWeight: "bold" }}>in {matchCount} matches</span>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>

        {filtered.length === 0 && (
          <p className="text-center py-16 text-lg font-bold" style={{ fontFamily: "Inter, sans-serif", color: "#1A1AE6" }}>No players match the current filters</p>
        )}
      </div>
    </main>
  );
}
