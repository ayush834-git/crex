"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import { Search } from "lucide-react";

interface MomentumMatch {
  matchId: string; date: string; teams: [string, string]; winner: string; venue: string;
  innings: { team: string; overs: number[]; total: number; wickets: number }[];
}

export function MomentumTrackerDemo() {
  const [matches, setMatches] = useState<MomentumMatch[]>([]);
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch("/data/match-momentum.json")
      .then(r => r.json())
      .then(d => setMatches(d))
      .catch(() => {});
  }, []);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) setSearchOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const match = matches[selectedIdx];

  const filteredMatches = useMemo(() => {
    if (!searchQuery.trim()) return matches;
    const q = searchQuery.toLowerCase();
    return matches.filter(m =>
      m.teams[0].toLowerCase().includes(q) || m.teams[1].toLowerCase().includes(q) || m.date.includes(q)
    );
  }, [matches, searchQuery]);

  const maxOverRuns = useMemo(() => {
    if (!match) return 20;
    return Math.max(...match.innings.flatMap(i => i.overs), 20);
  }, [match]);

  return (
    <div className="p-6">
      {/* Match Search */}
      <div className="mb-6" ref={searchRef}>
        <label className="block text-sm font-black uppercase tracking-widest mb-2" style={{ fontFamily: "Inter, sans-serif", color: "#1A1AE6" }}>SELECT MATCH</label>
        <div className="relative">
          <div className="flex items-center gap-2 px-3 py-3" style={{ background: "#FFFFFF", border: "3px solid #1A1AE6", boxShadow: "3px 3px 0 #1A1AE6" }}>
            <Search size={16} color="#1A1AE6" className="shrink-0" />
            {!searchOpen && match ? (
              <button onClick={() => { setSearchOpen(true); setSearchQuery(""); }}
                className="w-full text-left text-sm font-bold cursor-pointer bg-transparent border-none outline-none"
                style={{ fontFamily: "Inter, sans-serif", color: "#080C18" }}>
                {match.teams[0]} vs {match.teams[1]} — {match.date}
              </button>
            ) : (
              <input type="text" value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                onFocus={() => setSearchOpen(true)}
                placeholder="Search matches…"
                className="w-full bg-transparent border-none outline-none text-sm font-bold placeholder:text-[#1A1AE6]/40"
                style={{ fontFamily: "Inter, sans-serif", color: "#080C18" }}
              />
            )}
          </div>
          {searchOpen && (
            <div className="absolute top-full left-0 w-full mt-1 overflow-hidden z-50 shadow-2xl"
              style={{ background: "#FFFFFF", border: "2px solid #1A1AE6", maxHeight: "280px", overflowY: "auto" }}>
              {filteredMatches.map((m) => {
                const realIdx = matches.indexOf(m);
                return (
                  <button key={m.matchId}
                    onClick={() => { setSelectedIdx(realIdx); setSearchOpen(false); setSearchQuery(""); }}
                    className="w-full text-left px-4 py-3 transition-colors cursor-pointer flex items-center gap-3"
                    style={{ background: realIdx === selectedIdx ? "rgba(26,26,230,0.08)" : "transparent", borderLeft: realIdx === selectedIdx ? "3px solid #1A1AE6" : "3px solid transparent" }}
                    onMouseEnter={e => (e.currentTarget.style.background = "rgba(26,26,230,0.08)")}
                    onMouseLeave={e => (e.currentTarget.style.background = realIdx === selectedIdx ? "rgba(26,26,230,0.08)" : "transparent")}
                  >
                    <span className="text-sm font-bold flex-1" style={{ fontFamily: "Inter, sans-serif", color: "#080C18" }}>{m.teams[0]} vs {m.teams[1]}</span>
                    <span className="text-[11px]" style={{ fontFamily: "'JetBrains Mono', monospace", color: "rgba(8,12,24,0.5)" }}>{m.date}</span>
                  </button>
                );
              })}
              {filteredMatches.length === 0 && (
                <div className="p-4 text-center text-sm font-bold" style={{ fontFamily: "Inter, sans-serif", color: "rgba(8,12,24,0.4)" }}>No matches found</div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Match Info */}
      {match && (
        <>
          {/* Match Info */}
          <div className="flex justify-between items-center mb-4">
            <span className="text-base font-black" style={{ fontFamily: "'Barlow Condensed', sans-serif", color: "#080C18" }}>
              {match.teams[0]} vs {match.teams[1]}
            </span>
            <span className="text-xs font-black px-3 py-1" style={{ background: "#1A1AE6", color: "#F5C518", fontFamily: "'Barlow Condensed', sans-serif", border: "2px solid #080C18" }}>
              {match.winner === match.teams[0] || match.winner === match.teams[1] ? `${match.winner} won` : "TIE"}
            </span>
          </div>

          {/* Score Summary */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            {match.innings.map((inn, i) => (
              <div key={i} className="p-3 text-center" style={{ background: i === 0 ? "#1A1AE6" : "#9B5DE5", border: "2px solid #080C18", boxShadow: "3px 3px 0 #080C18" }}>
                <span className="block text-[10px] font-bold uppercase tracking-widest text-white mb-1" style={{ fontFamily: "Inter, sans-serif" }}>{inn.team}</span>
                <span className="block text-2xl font-black" style={{ fontFamily: "'JetBrains Mono', monospace", color: "#F5C518" }}>
                  {inn.total}/{inn.wickets}
                </span>
                <span className="block text-[10px] text-white/70" style={{ fontFamily: "Inter, sans-serif" }}>({inn.overs.length} overs)</span>
              </div>
            ))}
          </div>

          {/* Over-by-over Bars */}
          <h4 className="text-sm font-black uppercase tracking-widest mb-3" style={{ fontFamily: "Inter, sans-serif", color: "#1A1AE6" }}>OVER-BY-OVER</h4>
          <div className="space-y-1 max-h-[300px] overflow-y-auto pr-2" style={{ scrollbarColor: "#1A1AE6 transparent" }}>
            {Array.from({ length: Math.max(...match.innings.map(i => i.overs.length)) }).map((_, overIdx) => (
              <div key={overIdx} className="flex items-center gap-2">
                <span className="text-[10px] font-bold w-6 shrink-0 text-right" style={{ fontFamily: "'JetBrains Mono', monospace", color: "rgba(8,12,24,0.6)" }}>{overIdx + 1}</span>
                <div className="flex-1 flex gap-1">
                  {match.innings.map((inn, innIdx) => {
                    const runs = inn.overs[overIdx] ?? 0;
                    const pct = (runs / maxOverRuns) * 100;
                    return (
                      <div key={innIdx} className="flex-1 h-5 relative overflow-hidden" style={{ background: "rgba(26,26,230,0.12)", border: "1px solid rgba(26,26,230,0.25)" }}>
                        <div className="h-full transition-all duration-300" style={{ width: `${pct}%`, background: innIdx === 0 ? "#1A1AE6" : "#9B5DE5" }} />
                        <span className="absolute inset-0 flex items-center justify-center text-[9px] font-black" style={{ fontFamily: "'JetBrains Mono', monospace", color: runs > 0 ? "#FFFFFF" : "rgba(8,12,24,0.3)" }}>{runs}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* Legend */}
          <div className="flex justify-center gap-6 mt-4">
            {match.innings.map((inn, i) => (
              <div key={i} className="flex items-center gap-2">
                <div className="w-3 h-3" style={{ background: i === 0 ? "#1A1AE6" : "#9B5DE5", border: "1px solid #080C18" }} />
                <span className="text-xs font-bold" style={{ fontFamily: "Inter, sans-serif", color: "#080C18" }}>{inn.team}</span>
              </div>
            ))}
          </div>
        </>
      )}

      {!matches.length && <p className="text-center py-8 text-sm font-bold" style={{ fontFamily: "Inter, sans-serif", color: "rgba(26,26,230,0.6)" }}>Loading match data…</p>}
    </div>
  );
}
