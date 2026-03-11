"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight } from "lucide-react";
import { PlayerImage } from "@/components/player/PlayerImage";
import { usePlayers } from "@/hooks/usePlayers";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface PlayerStats {
  batting: { matches: number; innings: number; runs: number; balls: number; fours: number; sixes: number; dismissals: number; highest: number; centuries: number; fifties: number; avg: number; sr: number };
  bowling: { balls: number; runs_conceded: number; wickets: number; maidens: number; avg: number; econ: number };
}

const getRoleStyle = (role: string) => {
  switch (role) {
    case "BATTER": return { bg: "#E63946", text: "#FFFFFF" };
    case "BOWLER": return { bg: "#00C9A7", text: "#080C18" };
    case "ALLROUNDER": return { bg: "#9B5DE5", text: "#FFFFFF" };
    case "WICKETKEEPER": return { bg: "#1A1AE6", text: "#F5C518" };
    default: return { bg: "#080C18", text: "#FFFFFF" };
  }
};

function getDisplayStats(player: any, stats: PlayerStats | null) {
  if (!stats) return [["MATCHES", "—"], ["RUNS", "—"], ["AVG", "—"], ["SR", "—"]];
  const b = stats.batting;
  const bw = stats.bowling;
  if (player.role === "BOWLER") {
    return [["WKTS", bw.wickets], ["AVG", bw.avg], ["ECON", bw.econ], ["MATCHES", b.matches]];
  }
  if (player.role === "ALLROUNDER") {
    return [["RUNS", b.runs], ["WKTS", bw.wickets], ["SR", b.sr], ["ECON", bw.econ]];
  }
  // BATTER / WICKETKEEPER
  return [["RUNS", b.runs], ["AVG", b.avg], ["SR", b.sr], ["100s", b.centuries]];
}

export function PlayerStatsPreview() {
  const { players } = usePlayers();
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollWrapperRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [allStats, setAllStats] = useState<Record<string, PlayerStats> | null>(null);

  // Load real stats from processed Cricsheet data
  useEffect(() => {
    fetch("/data/player-stats.json")
      .then(r => r.json())
      .then(data => setAllStats(data))
      .catch(() => setAllStats(null));
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const scrollDist = (players.length - 3) * (window.innerWidth * 0.3) + 300; 

      gsap.to(scrollWrapperRef.current, {
        x: -scrollDist,
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          pin: true,
          scrub: 1,
          end: `+=${scrollDist}`,
          onUpdate: (self) => {
            const newIndex = Math.min(
              players.length - 1,
              Math.floor(self.progress * players.length)
            );
            setActiveIndex(newIndex);
          }
        },
      });
      
      gsap.to(".scroll-arrow", {
        x: 15,
        repeat: -1,
        yoyo: true,
        duration: 0.8,
        ease: "power1.inOut"
      });

    }, containerRef);

    return () => ctx.revert();
  }, [players.length]);

  return (
    <section ref={containerRef} className="h-screen flex flex-col justify-center overflow-hidden relative pt-12 pb-24" style={{ background: "#F5C518", borderBottom: "4px solid #1A1AE6" }}>
      
      {/* Title */}
      <div className="px-6 md:px-12 mb-10 shrink-0">
         <h2 
           className="text-[clamp(60px,10vw,120px)] leading-[0.8] font-black uppercase tracking-tighter"
           style={{ fontFamily: "'Barlow Condensed', sans-serif", color: "#1A1AE6" }}
          >
           DEEP DIVE<span style={{ color: "#E63946" }}>.</span>
         </h2>
      </div>

      {/* Cards Wrapper - GSAP animated horizontally */}
      <div className="w-full pl-6 md:pl-12 flex-grow flex items-center">
        <div ref={scrollWrapperRef} className="flex gap-8 md:gap-12 relative">
          {players.map((player: any) => {
            const stats = allStats?.[player.cricsheetName] ?? null;
            const displayStats = getDisplayStats(player, stats);

            return (
              <div 
                key={player.id}
                className="w-[85vw] md:w-[45vw] lg:w-[30vw] shrink-0 flex flex-col relative group transition-all duration-300 hover:-translate-y-2 cursor-pointer overflow-hidden bg-white"
                style={{
                  height: "clamp(380px, 60vh, 520px)",
                  border: `4px solid ${player.teamColor}`,
                  boxShadow: `6px 6px 0 ${player.teamColor}`
                }}
                onMouseEnter={(e) => {
                  const target = e.currentTarget;
                  target.style.boxShadow = `10px 10px 0 ${player.teamColor}`;
                }}
                onMouseLeave={(e) => {
                  const target = e.currentTarget;
                  target.style.boxShadow = `6px 6px 0 ${player.teamColor}`;
                }}
              >
                {/* Image Zone (Full Bleed Background) */}
                <div className="absolute inset-0 z-0">
                  <PlayerImage
                    espnId={player.espnId}
                    name={player.name}
                    teamColor={player.teamColor}
                    className="w-full h-full"
                  />
                </div>

                {/* Gradient Overlay */}
                <div className="absolute inset-0 z-10" style={{
                  background: `linear-gradient(to top, #FFFFFF 0%, #FFFFFF 38%, ${player.teamColor}22 65%, transparent 100%)`
                }} />

                {/* Top Elements (Badge & Role) */}
                <div className="relative z-20 flex justify-between items-start p-6 w-full">
                  <div className="flex flex-col gap-2">
                    <span className="text-[12px] md:text-sm font-black tracking-widest px-4 py-1.5 uppercase shadow-[3px_3px_0_#080C18]" style={{ fontFamily: "'Barlow Condensed', sans-serif", background: getRoleStyle(player.role).bg, color: getRoleStyle(player.role).text, border: "2px solid #080C18" }}>
                      {player.role}
                    </span>
                    {player.active === false && (
                      <span className="px-3 py-1 bg-[#E63946] text-white text-[10px] font-bold tracking-widest self-start shadow-[2px_2px_0_#080C18]" style={{ fontFamily: "Inter, sans-serif", border: "2px solid #080C18" }}>
                        RETIRED
                      </span>
                    )}
                  </div>
                  <span className="px-4 py-1.5 text-[14px] font-black uppercase shadow-[3px_3px_0_#080C18]"
                    style={{
                      background: player.teamColor,
                      border: `2px solid #080C18`,
                      color: "#FFFFFF",
                      fontFamily: "'Barlow Condensed', sans-serif",
                      letterSpacing: "1px",
                    }}>
                    {player.team}
                  </span>
                </div>

                {/* Bottom Elements (Text & Stats) */}
                <div className="relative z-20 p-6 md:p-8 flex flex-col mt-auto w-full">
                  <h3 
                    className="text-[48px] md:text-[56px] font-black leading-[0.85] tracking-tighter uppercase mb-4"
                    style={{ fontFamily: "'Barlow Condensed', sans-serif", color: player.teamColor }}
                  >
                    {player.name}
                  </h3>

                  {/* Stats Grid 2x2 */}
                  <div className="grid grid-cols-2 gap-4 pt-4" style={{ borderTop: `4px solid ${player.teamColor}` }}>
                    {displayStats.map(([key, val]) => (
                      <div key={String(key)} className="flex flex-col">
                        <span 
                           className="block text-[11px] uppercase font-bold mb-1 tracking-widest" 
                           style={{ fontFamily: "'Inter', sans-serif", color: "#080C18" }}
                        >
                          {key}
                        </span>
                        <span 
                           className="block text-[28px] font-black leading-none" 
                           style={{ fontFamily: "'JetBrains Mono', monospace", color: "#1A1AE6" }}
                        >
                          {val}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Scroll indicator Bottom Left */}
      <div className="absolute bottom-8 left-6 md:left-12 z-30 flex items-center gap-6">
        <div className="flex gap-2">
           {players.map((_: any, i: number) => (
             <div 
               key={i} 
               className={`w-3 h-3 border-2 transition-all duration-300 ${i === activeIndex ? 'bg-[#1A1AE6] scale-125 border-[#1A1AE6]' : 'bg-transparent border-[#1A1AE6]'}`}
             />
           ))}
        </div>
        <div className="flex items-center text-[#1A1AE6] font-bold uppercase tracking-widest text-sm" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
          <span>SCROLL TO EXPLORE</span>
          <ArrowRight className="scroll-arrow ml-2 w-5 h-5 text-[#1A1AE6] stroke-[3px]" />
        </div>
      </div>

    </section>
  );
}
