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
      <label className="flex min-h-[52px] items-center gap-3 rounded-2xl border border-crex-border bg-white px-4 shadow-crex">
        <Search size={18} className="text-crex-muted" />
        <input
          value={localQuery}
          onChange={(event) => handleSearch(event.target.value)}
          placeholder="Search players"
          className="w-full bg-transparent outline-none placeholder:text-crex-muted"
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
              className="tap-target shrink-0 rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-white"
              style={{
                background: active ? team.primaryColor : "white",
                color: active ? "white" : team.primaryColor,
                borderColor: team.primaryColor,
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
              className={`tap-target rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] ${active ? "border-crex-accent bg-crex-accent text-white" : "border-crex-border bg-white text-crex-text"}`}
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
              className={`tap-target rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] ${active ? "border-crex-accent bg-crex-accent text-white" : "border-crex-border bg-white text-crex-text"}`}
            >
              {value}
            </button>
          );
        })}
      </div>
    </div>
  );
}
