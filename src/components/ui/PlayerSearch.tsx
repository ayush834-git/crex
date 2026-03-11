"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Search } from "lucide-react";
import type { Player } from "@/data/players";
import { PlayerImage } from "@/components/player/PlayerImage";

interface PlayerSearchProps {
  players: Player[];
  selected: Player | null;
  onSelect: (player: Player) => void;
  placeholder: string;
  showImage?: boolean;
}

const getRoleBadge = (role: string) => {
  switch (role) {
    case "BATTER": return { bg: "#E63946", text: "#FFF" };
    case "BOWLER": return { bg: "#00C9A7", text: "#080C18" };
    case "ALLROUNDER": return { bg: "#9B5DE5", text: "#F5C518" };
    case "WICKETKEEPER": return { bg: "#1A1AE6", text: "#F5C518" };
    default: return { bg: "#080C18", text: "#FFF" };
  }
};

export function PlayerSearch({ players, selected, onSelect, placeholder, showImage = true }: PlayerSearchProps) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [highlightIdx, setHighlightIdx] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const filtered = query.trim()
    ? players.filter(p => p.name.toLowerCase().includes(query.toLowerCase()))
    : players;

  const handleClickOutside = useCallback((e: MouseEvent) => {
    if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
      setOpen(false);
    }
  }, []);

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [handleClickOutside]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") { setOpen(false); return; }
    if (e.key === "ArrowDown") { e.preventDefault(); setHighlightIdx(i => Math.min(i + 1, filtered.length - 1)); }
    if (e.key === "ArrowUp") { e.preventDefault(); setHighlightIdx(i => Math.max(i - 1, 0)); }
    if (e.key === "Enter" && filtered[highlightIdx]) {
      onSelect(filtered[highlightIdx]);
      setQuery("");
      setOpen(false);
    }
  };

  return (
    <div ref={containerRef} className="relative w-full">
      <div className="relative flex items-center gap-2 px-3 py-3"
        style={{
          background: "#FFFFFF",
          border: selected ? `3px solid ${selected.teamColor}` : "3px solid #1A1AE6",
          boxShadow: "3px 3px 0 #1A1AE6",
        }}>
        <Search size={16} color="#1A1AE6" className="shrink-0" />
        {selected && !open ? (
          <button
            onClick={() => { setOpen(true); setQuery(""); }}
            className="flex items-center gap-2 w-full text-left cursor-pointer"
            style={{ background: "transparent", border: "none" }}
          >
            {showImage && (
              <div className="w-7 h-7 overflow-hidden relative shrink-0" style={{ border: `2px solid ${selected.teamColor}` }}>
                <PlayerImage espnId={selected.espnId} name={selected.name} teamColor={selected.teamColor} />
              </div>
            )}
            <span className="text-sm font-black truncate" style={{ fontFamily: "Inter, sans-serif", color: selected.teamColor }}>{selected.name}</span>
            <span className="text-[10px] font-black px-1.5 py-0.5 ml-auto shrink-0" style={{ background: selected.teamColor, color: "#FFFFFF" }}>{selected.team}</span>
          </button>
        ) : (
          <input
            type="text"
            value={query}
            onChange={e => { setQuery(e.target.value); setHighlightIdx(0); }}
            onFocus={() => setOpen(true)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            className="w-full bg-transparent border-none outline-none text-sm font-bold placeholder:text-[#1A1AE6]/40"
            style={{ fontFamily: "Inter, sans-serif", color: "#080C18" }}
          />
        )}
      </div>

      {open && (
        <div className="absolute top-full left-0 w-full mt-1 overflow-hidden z-50 shadow-2xl"
          style={{ background: "#FFFFFF", border: "2px solid #1A1AE6", maxHeight: "280px", overflowY: "auto" }}>
          {filtered.length === 0 ? (
            <div className="p-4 text-center text-sm font-bold" style={{ fontFamily: "Inter, sans-serif", color: "rgba(26,26,230,0.5)" }}>No players found</div>
          ) : (
            filtered.map((p, i) => {
              const rb = getRoleBadge(p.role);
              return (
                <button
                  key={p.id}
                  onClick={() => { onSelect(p); setQuery(""); setOpen(false); }}
                  className="w-full flex items-center gap-3 px-3 py-3 transition-colors cursor-pointer"
                  style={{
                    background: i === highlightIdx ? "rgba(26,26,230,0.08)" : "transparent",
                    borderLeft: i === highlightIdx ? `3px solid ${p.teamColor}` : "3px solid transparent",
                  }}
                  onMouseEnter={() => setHighlightIdx(i)}
                >
                  {showImage && (
                    <div className="w-10 h-10 overflow-hidden relative shrink-0" style={{ border: `2px solid ${p.teamColor}` }}>
                      <PlayerImage espnId={p.espnId} name={p.name} teamColor={p.teamColor} />
                    </div>
                  )}
                  <span className="text-sm font-bold truncate flex-1 text-left" style={{ fontFamily: "Inter, sans-serif", color: p.teamColor }}>{p.name}</span>
                  <span className="text-[9px] font-bold px-1.5 py-0.5 shrink-0 uppercase" style={{ background: rb.bg, color: rb.text, border: "1px solid #080C18" }}>{p.role}</span>
                  <span className="text-[10px] font-bold px-1.5 py-0.5 shrink-0" style={{ background: p.teamColor, color: "#FFFFFF" }}>{p.team}</span>
                </button>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}
