"use client";

import { useState, useEffect, useMemo } from "react";

interface PlayerStats {
  batting: { matches: number; innings: number; runs: number; balls: number; fours: number; sixes: number; dismissals: number; highest: number; centuries: number; fifties: number; avg: number; sr: number };
  bowling: { balls: number; runs_conceded: number; wickets: number; maidens: number; avg: number; econ: number };
}

interface FantasyPlayer {
  name: string;
  ptsPerMatch: number;
  role: string;
  runs: number;
  wickets: number;
  matches: number;
  sr: number;
  econ: number;
}

export function FantasyInsightsDemo() {
  const [allStats, setAllStats] = useState<Record<string, PlayerStats>>({});
  const [filter, setFilter] = useState<"ALL" | "BAT" | "BOWL">("ALL");

  useEffect(() => {
    fetch("/data/player-stats.json")
      .then(r => r.json())
      .then(d => setAllStats(d))
      .catch(() => {});
  }, []);

  const fantasyPlayers = useMemo(() => {
    const results: FantasyPlayer[] = [];
    for (const [name, stats] of Object.entries(allStats)) {
      if (stats.batting.matches < 20) continue;

      const isBowler = stats.bowling.wickets > 20 && stats.bowling.balls > 300;
      const isBatter = stats.batting.runs > 300;
      const m = stats.batting.matches;

      let ptsPerMatch = 0;
      let role = "BAT";

      if (isBowler && isBatter) {
        // All-rounder — per match
        const batPts = (stats.batting.runs / m) * 0.5 + (stats.batting.sr / 10) + (stats.batting.fifties / m) * 8 + (stats.batting.centuries / m) * 16;
        const bowlPts = (stats.bowling.wickets / m) * 25 + (stats.bowling.econ < 7 ? 6 : 0);
        ptsPerMatch = Math.round(batPts + bowlPts);
        role = "AR";
      } else if (isBowler) {
        const wpm = stats.bowling.wickets / m;
        ptsPerMatch = Math.round(
          wpm * 25 + (stats.bowling.econ < 6 ? 12 : stats.bowling.econ < 7 ? 6 : 0) + (wpm > 1.5 ? 8 : 0)
        );
        role = "BOWL";
      } else if (isBatter) {
        const rpm = stats.batting.runs / m;
        ptsPerMatch = Math.round(
          rpm * 0.5 + (stats.batting.sr / 10) + (stats.batting.fifties / m) * 8 + (stats.batting.centuries / m) * 16
        );
        role = "BAT";
      }

      if (ptsPerMatch > 0) {
        results.push({
          name, ptsPerMatch, role,
          runs: stats.batting.runs,
          wickets: stats.bowling.wickets,
          matches: m,
          sr: stats.batting.sr,
          econ: stats.bowling.econ,
        });
      }
    }
    return results
      .filter(p => filter === "ALL" || p.role === filter || (filter === "BAT" && p.role === "BAT") || (filter === "BOWL" && p.role === "BOWL"))
      .sort((a, b) => b.ptsPerMatch - a.ptsPerMatch)
      .slice(0, 15);
  }, [allStats, filter]);

  const roleBadge = (r: string) => {
    switch (r) {
      case "BAT": return { bg: "#E63946", text: "#FFF" };
      case "BOWL": return { bg: "#00C9A7", text: "#080C18" };
      case "AR": return { bg: "#9B5DE5", text: "#FFF" };
      default: return { bg: "#1A1AE6", text: "#FFF" };
    }
  };

  return (
    <div className="p-6">
      {/* Filter Tabs */}
      <div className="flex gap-2 mb-6">
        {(["ALL", "BAT", "BOWL"] as const).map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className="px-6 py-2 text-sm font-black uppercase tracking-widest transition-all cursor-pointer shadow-[2px_2px_0_rgba(26,26,230,0.4)]"
            style={{
              fontFamily: "'Barlow Condensed', sans-serif",
              background: filter === f ? "#1A1AE6" : "#FFFFFF",
              color: filter === f ? "#F5C518" : "#1A1AE6",
              border: "2px solid #1A1AE6",
            }}>
            {f}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="space-y-2">
        {fantasyPlayers.map((p, i) => {
          const rb = roleBadge(p.role);
          return (
            <div key={p.name}
              className="flex items-center gap-3 p-3 transition-colors"
              style={{ background: "#FFFFFF", borderLeft: `4px solid ${i < 3 ? "#E63946" : "#1A1AE6"}`, border: "2px solid #080C18", boxShadow: "2px 2px 0 #080C18" }}>
              <span className="w-6 text-center text-sm font-black" style={{ fontFamily: "'JetBrains Mono', monospace", color: i < 3 ? "#E63946" : "#1A1AE6" }}>
                {i + 1}
              </span>
              <span className="flex-1 text-sm font-bold truncate" style={{ fontFamily: "Inter, sans-serif", color: "#080C18" }}>{p.name}</span>
              <span className="text-[9px] font-bold px-1.5 py-0.5 shrink-0" style={{ background: rb.bg, color: rb.text, border: "1px solid #080C18" }}>{p.role}</span>
              <span className="text-lg font-black shrink-0 w-16 text-right" style={{ fontFamily: "'JetBrains Mono', monospace", color: "#1A1AE6" }}>{p.ptsPerMatch}</span>
              <span className="text-[10px] font-bold uppercase shrink-0" style={{ fontFamily: "Inter, sans-serif", color: "rgba(8,12,24,0.5)" }}>PTS/M</span>
            </div>
          );
        })}
      </div>

      {fantasyPlayers.length === 0 && (
        <p className="text-center py-8 text-sm font-bold" style={{ fontFamily: "Inter, sans-serif", color: "rgba(26,26,230,0.6)" }}>Loading fantasy data…</p>
      )}
    </div>
  );
}
