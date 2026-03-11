"use client";

import { useState, useEffect, useMemo } from "react";
import { usePlayers } from "@/hooks/usePlayers";
import { PlayerSearch } from "@/components/ui/PlayerSearch";
import { PlayerImage } from "@/components/player/PlayerImage";

interface H2HRecord { balls: number; runs: number; dismissals: number; dots: number; fours: number; sixes: number; sr: number; }

export function PlayerMatchupsDemo() {
  const { players } = usePlayers();
  const batters = useMemo(() => players.filter((p: any) => ["BATTER", "WICKETKEEPER", "ALLROUNDER"].includes(p.role)), [players]);
  const bowlers = useMemo(() => players.filter((p: any) => ["BOWLER", "ALLROUNDER"].includes(p.role)), [players]);

  const [h2hData, setH2hData] = useState<Record<string, H2HRecord>>({});
  const [batter, setBatter] = useState<any | null>(null);
  const [bowler, setBowler] = useState<any | null>(null);

  useEffect(() => {
    fetch("/data/head-to-head.json")
      .then(r => r.json())
      .then(d => setH2hData(d))
      .catch(() => {});
  }, []);

  const record = useMemo(() => {
    if (!batter || !bowler) return null;
    const key = `${batter.cricsheetName}_${bowler.cricsheetName}`;
    return h2hData[key] || null;
  }, [batter, bowler, h2hData]);

  const STATS = record ? [
    { label: "BALLS", value: record.balls, primary: true },
    { label: "RUNS", value: record.runs, primary: false },
    { label: "DISMISSALS", value: record.dismissals, primary: true },
    { label: "STRIKE RATE", value: record.sr, primary: false },
    { label: "DOTS", value: record.dots, primary: true },
    { label: "4s", value: record.fours, primary: false },
    { label: "6s", value: record.sixes, primary: true },
  ] : [];

  return (
    <div className="p-6">
      {/* Player Search Selectors */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <div>
          <label className="block text-sm font-black uppercase tracking-widest mb-2" style={{ fontFamily: "Inter, sans-serif", color: "#1A1AE6" }}>BATTER</label>
          <PlayerSearch players={batters} selected={batter} onSelect={setBatter} placeholder="Search batter…" />
        </div>
        <div>
          <label className="block text-sm font-black uppercase tracking-widest mb-2" style={{ fontFamily: "Inter, sans-serif", color: "#1A1AE6" }}>BOWLER</label>
          <PlayerSearch players={bowlers} selected={bowler} onSelect={setBowler} placeholder="Search bowler…" />
        </div>
      </div>

      {/* Player Images + VS */}
      {batter && bowler && (
        <div className="flex items-center justify-center gap-6 mb-8">
          <div className="text-center">
            <div className="w-[120px] h-[160px] overflow-hidden relative mx-auto" style={{ background: batter.teamColor, border: `3px solid #080C18`, boxShadow: "4px 4px 0 #080C18" }}>
              <PlayerImage espnId={batter.espnId} name={batter.name} teamColor={batter.teamColor} />
            </div>
            <p className="mt-2 text-base font-black uppercase" style={{ fontFamily: "'Barlow Condensed', sans-serif", color: "#080C18" }}>{batter.name}</p>
          </div>
          <span className="text-5xl font-black" style={{ fontFamily: "'Barlow Condensed', sans-serif", color: "#1A1AE6" }}>VS</span>
          <div className="text-center">
            <div className="w-[120px] h-[160px] overflow-hidden relative mx-auto" style={{ background: bowler.teamColor, border: `3px solid #080C18`, boxShadow: "4px 4px 0 #080C18" }}>
              <PlayerImage espnId={bowler.espnId} name={bowler.name} teamColor={bowler.teamColor} />
            </div>
            <p className="mt-2 text-base font-black uppercase" style={{ fontFamily: "'Barlow Condensed', sans-serif", color: "#080C18" }}>{bowler.name}</p>
          </div>
        </div>
      )}

      {/* Stats Grid */}
      {record ? (
        <>
          <h4 className="text-center text-[#1A1AE6] font-black uppercase tracking-widest mb-4 text-sm" style={{ fontFamily: "Inter, sans-serif" }}>HEAD TO HEAD STATS</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {STATS.map((s, i) => (
              <div key={s.label} className="p-4 text-center" style={{ background: i % 2 === 0 ? "#1A1AE6" : "#9B5DE5", border: "2px solid #080C18", boxShadow: "3px 3px 0 #080C18" }}>
                <span className="block text-2xl font-black" style={{ fontFamily: "'JetBrains Mono', monospace", color: "#F5C518" }}>{s.value}</span>
                <span className="block text-[10px] font-bold uppercase tracking-widest text-white mt-1" style={{ fontFamily: "Inter, sans-serif" }}>{s.label}</span>
              </div>
            ))}
          </div>
        </>
      ) : batter && bowler ? (
        <p className="text-center py-8 text-sm font-black" style={{ fontFamily: "Inter, sans-serif", color: "#1A1AE6" }}>No head-to-head data found for this matchup</p>
      ) : (
        <p className="text-center py-8 text-sm font-bold" style={{ fontFamily: "Inter, sans-serif", color: "rgba(26,26,230,0.6)" }}>Select both players to see their head-to-head record</p>
      )}
    </div>
  );
}
