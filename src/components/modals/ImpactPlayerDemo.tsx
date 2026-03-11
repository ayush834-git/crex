"use client";

import { useState, useEffect, useMemo } from "react";

interface MomentumMatch {
  matchId: string; date: string; teams: [string, string]; winner: string;
  innings: { team: string; overs: number[]; total: number; wickets: number }[];
}

export function ImpactPlayerDemo() {
  const [matches, setMatches] = useState<MomentumMatch[]>([]);

  useEffect(() => {
    fetch("/data/match-momentum.json")
      .then(r => r.json())
      .then(d => setMatches(d))
      .catch(() => {});
  }, []);

  const scenarios = useMemo(() => {
    if (!matches.length) return [];
    // Pick first 3 matches that have a 2nd innings (chases)
    return matches.filter(m => m.innings.length >= 2).slice(0, 3).map(m => {
      const batting = m.innings[1];
      const target = m.innings[0].total + 1;

      // Simulate over 10 scenario
      const first10 = batting.overs.slice(0, 10);
      const runsAt10 = first10.reduce((a, r) => a + r, 0);
      const wicketsAt10 = Math.min(batting.wickets, 4); // Approximate
      const runsNeeded = target - runsAt10;
      const rrr = runsNeeded / 10;
      const crr = runsAt10 / 10;

      const shouldUseNow = rrr > crr * 1.3 || wicketsAt10 >= 4;

      return {
        matchLabel: `${m.teams[0]} vs ${m.teams[1]}`,
        date: m.date,
        chasingTeam: batting.team,
        target,
        runsAt10,
        wicketsAt10,
        runsNeeded,
        rrr: rrr.toFixed(2),
        crr: crr.toFixed(2),
        recommendation: shouldUseNow ? "USE NOW" : "HOLD",
        recColor: shouldUseNow ? "#E63946" : "#00C9A7",
        winner: m.winner,
        won: m.winner === batting.team,
      };
    });
  }, [matches]);

  return (
    <div className="p-6">
      <p className="text-sm font-black uppercase tracking-widest mb-6" style={{ fontFamily: "Inter, sans-serif", color: "#1A1AE6" }}>
        IMPACT PLAYER ANALYSIS — OVER 10 CHASE SCENARIOS
      </p>

      <div className="space-y-4">
        {scenarios.map((s, i) => (
          <div key={i} className="overflow-hidden" style={{ background: "#FFFFFF", border: "3px solid #080C18", boxShadow: "4px 4px 0 #080C18" }}>
            {/* Header */}
            <div className="flex justify-between items-center p-4" style={{ background: "#1A1AE6" }}>
              <div>
                <span className="text-white text-base font-black" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>{s.matchLabel}</span>
                <span className="block text-[10px] text-white/70" style={{ fontFamily: "'JetBrains Mono', monospace" }}>{s.date}</span>
              </div>
              <span className="text-xs font-black px-4 py-2 uppercase tracking-widest"
                style={{ fontFamily: "'Barlow Condensed', sans-serif", background: s.recColor, color: s.recommendation === "HOLD" ? "#080C18" : "#FFFFFF", fontSize: "18px", border: "2px solid white" }}>
                {s.recommendation}
              </span>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-3 gap-2 p-4" style={{ background: "#F5C518" }}>
              {[
                { label: "SCORE AT 10", val: `${s.runsAt10}/${s.wicketsAt10}` },
                { label: "NEED", val: s.runsNeeded },
                { label: "TARGET", val: s.target },
                { label: "CRR", val: s.crr },
                { label: "RRR", val: s.rrr },
                { label: "RESULT", val: s.won ? "WON" : "LOST" },
              ].map((stat, j) => (
                <div key={stat.label} className="p-2 text-center" style={{ background: j % 2 === 0 ? "#1A1AE6" : "#9B5DE5", border: "2px solid #080C18" }}>
                  <span className="block text-lg font-black" style={{ fontFamily: "'JetBrains Mono', monospace", color: "#F5C518" }}>{stat.val}</span>
                  <span className="block text-[8px] font-bold uppercase tracking-widest text-white" style={{ fontFamily: "Inter, sans-serif" }}>{stat.label}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {!scenarios.length && (
        <p className="text-center py-8 text-sm font-bold" style={{ fontFamily: "Inter, sans-serif", color: "rgba(26,26,230,0.6)" }}>Loading match scenarios…</p>
      )}
    </div>
  );
}
