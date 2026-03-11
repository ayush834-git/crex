"use client";

import { useState, useEffect, useMemo } from "react";

interface WinBucket {
  over: number; wickets: number; target_bracket: string; need_bracket: string;
  chaser_wins: number; total: number; win_pct: number;
}

function getTargetBracket(target: number): string {
  if (target < 140) return "<140";
  if (target < 160) return "140-159";
  if (target < 180) return "160-179";
  if (target < 200) return "180-199";
  return "200+";
}

export function PredictiveEngineDemo() {
  const [buckets, setBuckets] = useState<WinBucket[]>([]);
  const [over, setOver] = useState(10);
  const [wickets, setWickets] = useState(3);
  const [target, setTarget] = useState(175);
  const [currentScore, setCurrentScore] = useState(90);

  useEffect(() => {
    fetch("/data/win-probability.json")
      .then(r => r.json())
      .then(d => setBuckets(d.buckets || []))
      .catch(() => {});
  }, []);

  const result = useMemo(() => {
    if (!buckets.length) return null;
    const runsNeeded = target - currentScore;
    const ballsLeft = (20 - over) * 6;
    if (ballsLeft <= 0) return { prob: currentScore >= target ? 100 : 0, total: 0 };

    const requiredRate = (runsNeeded / ballsLeft) * 6;
    const currentRate = over > 0 ? (currentScore / (over * 6)) * 6 : 0;
    const tb = getTargetBracket(target);

    let best = buckets[0];
    let bestDist = Infinity;
    for (const b of buckets) {
      const dist = Math.abs(b.over - over) * 3 + Math.abs(b.wickets - wickets) * 5 + (b.target_bracket !== tb ? 20 : 0);
      if (dist < bestDist) { bestDist = dist; best = b; }
    }

    let prob = best.win_pct;
    const rateRatio = requiredRate / Math.max(currentRate, 6);
    if (rateRatio > 1.4) prob *= 0.6;
    else if (rateRatio > 1.2) prob *= 0.75;
    else if (rateRatio < 0.8) prob = Math.min(prob * 1.3, 95);

    return { prob: Math.max(5, Math.min(95, Math.round(prob))), total: best.total };
  }, [buckets, over, wickets, target, currentScore]);

  return (
    <div className="p-6">
      {/* Inputs Grid */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        {[
          { label: "OVER", val: over, set: setOver, min: 1, max: 20 },
          { label: "WICKETS", val: wickets, set: setWickets, min: 0, max: 9 },
          { label: "TARGET", val: target, set: setTarget, min: 100, max: 280 },
          { label: "CURRENT SCORE", val: currentScore, set: setCurrentScore, min: 0, max: 280 },
        ].map(inp => (
          <div key={inp.label}>
            <label className="block text-sm font-black uppercase tracking-widest mb-2" style={{ fontFamily: "Inter, sans-serif", color: "#1A1AE6" }}>{inp.label}</label>
            <input type="number" value={inp.val}
              onChange={e => inp.set(Math.max(inp.min, Math.min(inp.max, parseInt(e.target.value) || 0)))}
              className="w-full p-3 text-[#080C18] text-lg font-black outline-none transition-colors border-3 focus:border-[#E63946]"
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                background: "#FFFFFF", border: "3px solid #1A1AE6",
                boxShadow: "3px 3px 0 #1A1AE6",
                MozAppearance: "textfield",
                WebkitAppearance: "none",
              }}
            />
          </div>
        ))}
      </div>

      {/* Win Probability Bars */}
      {result && (
        <div className="space-y-4">
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-base font-black uppercase tracking-widest" style={{ fontFamily: "Inter, sans-serif", color: "#1A1AE6" }}>CHASING TEAM</span>
              <span className="text-3xl font-black" style={{ fontFamily: "'JetBrains Mono', monospace", color: "#1A1AE6" }}>{result.prob}%</span>
            </div>
            <div className="w-full h-6 overflow-hidden" style={{ background: "rgba(26,26,230,0.15)", border: "2px solid #1A1AE6" }}>
              <div className="h-full transition-all duration-500" style={{ width: `${result.prob}%`, background: "#00C9A7" }} />
            </div>
          </div>
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-base font-black uppercase tracking-widest" style={{ fontFamily: "Inter, sans-serif", color: "#1A1AE6" }}>DEFENDING TEAM</span>
              <span className="text-3xl font-black" style={{ fontFamily: "'JetBrains Mono', monospace", color: "#1A1AE6" }}>{100 - result.prob}%</span>
            </div>
            <div className="w-full h-6 overflow-hidden" style={{ background: "rgba(26,26,230,0.15)", border: "2px solid #1A1AE6" }}>
              <div className="h-full transition-all duration-500" style={{ width: `${100 - result.prob}%`, background: "#E63946" }} />
            </div>
          </div>
          {result.total > 0 && (
            <p className="text-center mt-4 text-sm font-bold" style={{ fontFamily: "Inter, sans-serif", color: "#1A1AE6" }}>
              Based on <span style={{ color: "#E63946", fontFamily: "'JetBrains Mono', monospace", fontWeight: 900 }}>{result.total}</span> historical IPL chase scenarios
            </p>
          )}
        </div>
      )}

      {!result && <p className="text-center font-bold" style={{ fontFamily: "Inter, sans-serif", color: "#1A1AE6" }}>Loading data…</p>}

      <style jsx>{`
        input[type="number"]::-webkit-inner-spin-button,
        input[type="number"]::-webkit-outer-spin-button { display: none; }
      `}</style>
    </div>
  );
}
