"use client";

import { useMemo } from "react";

interface MomentumMeterProps {
  team1: { name: string; color: string; overs: number[] };
  team2: { name: string; color: string; overs: number[] };
}

function buildPath(values: number[], width: number, height: number) {
  const max = Math.max(...values, 1);
  return values
    .map((value, index) => {
      const x = (index / Math.max(1, values.length - 1)) * width;
      const y = height - (value / max) * height;
      return `${index === 0 ? "M" : "L"} ${x} ${y}`;
    })
    .join(" ");
}

export function MomentumMeter({ team1, team2 }: MomentumMeterProps) {
  const hasMomentum = team1.overs.length > 0 && team2.overs.length > 0;
  const team1Path = useMemo(() => (hasMomentum ? buildPath(team1.overs, 720, 180) : ""), [hasMomentum, team1.overs]);
  const team2Path = useMemo(() => (hasMomentum ? buildPath(team2.overs, 720, 180) : ""), [hasMomentum, team2.overs]);

  return (
    <div className="crex-card">
      <div className="flex flex-wrap items-center gap-4">
        <span className="inline-flex items-center gap-2 font-display text-2xl uppercase tracking-[0.08em] text-crex-accent">
          <span className="h-4 w-4 border-2 border-crex-border" style={{ background: team1.color }} />
          {team1.name}
        </span>
        <span className="inline-flex items-center gap-2 font-display text-2xl uppercase tracking-[0.08em] text-crex-hot">
          <span className="h-4 w-4 border-2 border-crex-border" style={{ background: team2.color }} />
          {team2.name}
        </span>
      </div>

      {hasMomentum ? (
        <div className="mt-6 rounded-2xl border-2 border-crex-border bg-[linear-gradient(180deg,rgba(29,78,216,0.16),rgba(255,255,255,0.92))] p-3">
          <svg viewBox="0 0 720 180" className="w-full overflow-visible">
            <path d={team1Path} fill="none" stroke={team1.color} strokeWidth="4" strokeLinecap="square" />
            <path d={team2Path} fill="none" stroke={team2.color} strokeWidth="4" strokeLinecap="square" />
          </svg>
        </div>
      ) : (
        <div className="mt-6 rounded-2xl border-2 border-crex-border bg-[linear-gradient(180deg,rgba(29,78,216,0.16),rgba(255,255,255,0.92))] p-6 text-xl uppercase leading-6 text-crex-text">
          Over-by-over momentum is not available from the live provider for this fixture yet. CREX will show the curve as soon as granular scorecard data arrives.
        </div>
      )}
    </div>
  );
}
