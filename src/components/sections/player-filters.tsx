"use client";

import { useEffect, useRef, useState } from "react";
import { Search } from "lucide-react";
import { IPL_TEAMS } from "@/lib/constants/teams";
import type { PlayerFilters } from "@/hooks/usePlayers";

interface PlayerFiltersProps {
  filters: PlayerFilters;
  onChange: (next: PlayerFilters) => void;
}

const roles = ["Batsman", "Bowler", "All-rounder", "Wicket-keeper"];
const nationalities = ["Indian", "Overseas"];

export function PlayerFiltersBar({ filters, onChange }: PlayerFiltersProps) {
  const [localQuery, setLocalQuery] = useState(filters.query ?? "");
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setLocalQuery(filters.query ?? "");
  }, [filters.query]);

  const handleSearch = (value: string) => {
    setLocalQuery(value);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      onChange({ ...filters, query: value, page: 1 });
    }, 300);
  };

  return (
    <div className="space-y-5">
      <label className="crex-card flex min-h-[60px] items-center gap-3 px-4">
        <Search size={18} className="text-crex-muted" />
        <input
          value={localQuery}
          onChange={(event) => handleSearch(event.target.value)}
          placeholder="Search players"
          className="w-full bg-transparent font-display text-2xl uppercase tracking-[0.05em] outline-none placeholder:text-crex-muted"
        />
      </label>

      <div className="flex gap-2 overflow-x-auto pb-2">
        {IPL_TEAMS.map((team) => {
          const active = filters.team?.includes(team.abbr);
          const next = active
            ? (filters.team ?? []).filter((item) => item !== team.abbr)
            : [...(filters.team ?? []), team.abbr];

          return (
            <button
              key={team.abbr}
              onClick={() => onChange({ ...filters, team: next, page: 1 })}
              className="tap-target shrink-0 rounded-xl border-2 px-4 py-2 font-display text-xl uppercase tracking-[0.08em] shadow-[0_10px_18px_rgba(91,33,182,0.14)] transition-transform duration-200 hover:-translate-y-1"
              style={{
                background: active ? team.primaryColor : "white",
                color: active ? "white" : team.primaryColor,
                borderColor: active ? "var(--crex-border)" : team.primaryColor,
              }}
            >
              {team.abbr}
            </button>
          );
        })}
      </div>

      <div className="flex flex-wrap gap-2">
        {roles.map((role) => {
          const active = filters.role?.includes(role);
          const next = active ? (filters.role ?? []).filter((item) => item !== role) : [...(filters.role ?? []), role];
          return (
            <button
              key={role}
              onClick={() => onChange({ ...filters, role: next, page: 1 })}
              className={`tap-target rounded-xl border-2 px-4 py-2 font-display text-xl uppercase tracking-[0.08em] shadow-[0_10px_18px_rgba(91,33,182,0.14)] transition-transform duration-200 hover:-translate-y-1 ${active ? "border-crex-border bg-crex-accent text-white" : "border-crex-border bg-crex-panel text-crex-accent"}`}
            >
              {role}
            </button>
          );
        })}
        {nationalities.map((value) => {
          const active = filters.nationality?.includes(value);
          const next = active
            ? (filters.nationality ?? []).filter((item) => item !== value)
            : [...(filters.nationality ?? []), value];
          return (
            <button
              key={value}
              onClick={() => onChange({ ...filters, nationality: next, page: 1 })}
              className={`tap-target rounded-xl border-2 px-4 py-2 font-display text-xl uppercase tracking-[0.08em] shadow-[0_10px_18px_rgba(91,33,182,0.14)] transition-transform duration-200 hover:-translate-y-1 ${active ? "border-crex-border bg-crex-accent-soft text-white" : "border-crex-border bg-crex-panel text-crex-accent"}`}
            >
              {value}
            </button>
          );
        })}
      </div>
    </div>
  );
}
