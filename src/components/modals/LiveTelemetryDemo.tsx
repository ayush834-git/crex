"use client";

import { useState, useEffect, useMemo } from "react";
import { usePlayers } from "@/hooks/usePlayers";
import { PlayerSearch } from "@/components/ui/PlayerSearch";

type ShotData = { angle: number; distance: number; runs: number };

export function LiveTelemetryDemo() {
  const { players: PLAYERS } = usePlayers();
  const [wagonData, setWagonData] = useState<Record<string, ShotData[]>>({});
  const [player, setPlayer] = useState<any | null>(null);

  useEffect(() => {
    fetch("/data/wagon-wheel.json")
      .then(r => r.json())
      .then(d => setWagonData(d))
      .catch(() => {});
  }, []);

  const shots = useMemo(() => {
    if (!player) return [];
    return wagonData[player.cricsheetName] || [];
  }, [player, wagonData]);

  const runColor = (r: number) => {
    if (r === 6) return "#F5C518";
    if (r === 4) return "#E63946";
    if (r === 2) return "#00C9A7";
    return "#9B5DE5";
  };

  const summaryStats = useMemo(() => {
    if (!shots.length) return null;
    return {
      total: shots.length,
      fours: shots.filter(s => s.runs === 4).length,
      sixes: shots.filter(s => s.runs === 6).length,
      runs: shots.reduce((a, s) => a + s.runs, 0),
    };
  }, [shots]);

  return (
    <div className="p-6">
      <div className="mb-6">
        <label className="block text-sm font-black uppercase tracking-widest mb-2" style={{ fontFamily: "Inter, sans-serif", color: "#1A1AE6" }}>SELECT PLAYER</label>
        <PlayerSearch players={PLAYERS} selected={player} onSelect={setPlayer} placeholder="Search player…" />
      </div>

      {/* Summary Stats */}
      {summaryStats && (
        <div className="grid grid-cols-4 gap-3 mb-6">
          {[
            { label: "SHOTS", val: summaryStats.total },
            { label: "4s", val: summaryStats.fours },
            { label: "6s", val: summaryStats.sixes },
            { label: "RUNS", val: summaryStats.runs },
          ].map((s, i) => (
            <div key={s.label} className="p-3 text-center" style={{ background: i % 2 === 0 ? "#1A1AE6" : "#9B5DE5", border: "2px solid #080C18", boxShadow: "3px 3px 0 #080C18" }}>
              <span className="block text-xl font-black" style={{ fontFamily: "'JetBrains Mono', monospace", color: "#F5C518" }}>{s.val}</span>
              <span className="block text-[9px] font-bold uppercase tracking-widest text-white mt-1" style={{ fontFamily: "Inter, sans-serif" }}>{s.label}</span>
            </div>
          ))}
        </div>
      )}

      {/* Wagon Wheel SVG */}
      <div className="flex justify-center">
        <svg viewBox="-140 -140 280 280" className="w-full max-w-[380px]">
          {/* Field */}
          <circle cx="0" cy="0" r="130" fill="#1A6B3C" stroke="rgba(245,197,24,0.4)" strokeWidth="1" />
          <circle cx="0" cy="0" r="90" fill="none" stroke="rgba(245,197,24,0.3)" strokeWidth="0.5" />
          <circle cx="0" cy="0" r="50" fill="none" stroke="rgba(245,197,24,0.3)" strokeWidth="0.5" />
          {/* Pitch */}
          <rect x="-4" y="-16" width="8" height="32" fill="rgba(245,197,24,0.5)" rx="2" />

          {/* Shots */}
          {shots.slice(0, 200).map((s, i) => {
            const rad = (s.angle * Math.PI) / 180;
            const d = (s.distance / 100) * 120;
            const x = Math.sin(rad) * d;
            const y = -Math.cos(rad) * d;
            return (
              <line key={i} x1="0" y1="0" x2={x} y2={y}
                stroke={runColor(s.runs)} strokeWidth={s.runs >= 4 ? 2 : 1}
                opacity={s.runs >= 4 ? 0.9 : 0.5} />
            );
          })}

          {/* Center dot */}
          <circle cx="0" cy="0" r="3" fill="#F5C518" />
        </svg>
      </div>

      {/* Legend */}
      {shots.length > 0 && (
        <div className="flex justify-center gap-6 mt-4">
          {[{ label: "6s", color: "#F5C518" }, { label: "4s", color: "#E63946" }, { label: "2s", color: "#00C9A7" }, { label: "1s", color: "#9B5DE5" }].map(l => (
            <div key={l.label} className="flex items-center gap-2">
              <div className="w-3 h-3" style={{ background: l.color, border: "1px solid #080C18" }} />
              <span className="text-xs font-bold" style={{ fontFamily: "Inter, sans-serif", color: "#080C18" }}>{l.label}</span>
            </div>
          ))}
        </div>
      )}

      {!player && <p className="text-center py-8 text-sm font-bold" style={{ fontFamily: "Inter, sans-serif", color: "rgba(26,26,230,0.6)" }}>Select a player to see their wagon wheel</p>}
      {player && !shots.length && <p className="text-center py-4 text-sm font-black" style={{ fontFamily: "Inter, sans-serif", color: "#1A1AE6" }}>No shot data available for {player.name}</p>}
    </div>
  );
}
