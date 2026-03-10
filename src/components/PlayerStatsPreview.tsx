"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight } from "lucide-react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const PLAYERS = [
  {
    name: "VIRAT KOHLI",
    team: "RCB",
    teamColor: "#E6001A",
    role: "BATSMAN",
    roleClass: "bg-crimson text-white",
    stats: { MATCHES: 237, RUNS: 7263, AVERAGE: 37.2, "STRIKE RATE": 130.0 },
    watermark: "RCB",
  },
  {
    name: "MS DHONI",
    team: "CSK",
    teamColor: "#F5A623",
    role: "WICKETKEEPER",
    roleClass: "bg-royal text-sun",
    stats: { MATCHES: 250, RUNS: 5082, DISMISSALS: 180, "STRIKE RATE": 135.9 },
    watermark: "CSK",
  },
  {
    name: "JASPRIT BUMRAH",
    team: "MI",
    teamColor: "#004BA0",
    role: "BOWLER",
    roleClass: "bg-sky text-ink",
    stats: { MATCHES: 120, WICKETS: 148, ECONOMY: 7.39, BEST: "5/10" },
    watermark: "MI",
  },
  {
    name: "SUNIL NARINE",
    team: "KKR",
    teamColor: "#3A225D",
    role: "ALL-ROUNDER",
    roleClass: "bg-violet text-sun",
    stats: { MATCHES: 162, WICKETS: 163, RUNS: 1046, "STRIKE RATE": 159.6 },
    watermark: "KKR",
  },
  {
    name: "RASHID KHAN",
    team: "GT",
    teamColor: "#1B2133",
    role: "BOWLER",
    roleClass: "bg-ink text-sun",
    stats: { MATCHES: 109, WICKETS: 139, ECONOMY: 6.67, BEST: "4/24" },
    watermark: "GT",
  }
];

export function PlayerStatsPreview() {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollWrapperRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Calculate scroll distance based on container width to show exactly 3 cards optimally
      // We'll slide to the left until the last card is visible on screen
      const scrollDist = (PLAYERS.length - 3) * (window.innerWidth * 0.3) + 300; 

      gsap.to(scrollWrapperRef.current, {
        x: -scrollDist,
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          pin: true,
          scrub: 1,
          end: `+=${scrollDist}`,
          onUpdate: (self) => {
            // Update the active dot indicator
            const newIndex = Math.min(
              PLAYERS.length - 1,
              Math.floor(self.progress * PLAYERS.length)
            );
            setActiveIndex(newIndex);
          }
        },
      });
      
      // Animate Arrow
      gsap.to(".scroll-arrow", {
        x: 15,
        repeat: -1,
        yoyo: true,
        duration: 0.8,
        ease: "power1.inOut"
      });

    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} className="h-screen bg-violet flex flex-col justify-center overflow-hidden border-b-8 border-ink relative pt-12 pb-24">
      
      {/* Title */}
      <div className="px-6 md:px-12 mb-10 shrink-0">
         <h2 
           className="text-[clamp(60px,10vw,120px)] leading-[0.8] font-black text-sun uppercase tracking-tighter drop-shadow-[6px_6px_0_#1A1AE6]"
           style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
          >
           DEEP DIVE<span className="text-white">.</span>
         </h2>
      </div>

      {/* Cards Wrapper - GSAP animated horizontally */}
      <div className="w-full pl-6 md:pl-12 flex-grow flex items-center">
        <div ref={scrollWrapperRef} className="flex gap-8 md:gap-12 relative">
          {PLAYERS.map((player) => (
            <div 
              key={player.name}
              className="w-[85vw] md:w-[45vw] lg:w-[30vw] shrink-0 bg-white border-4 border-ink p-6 md:p-8 flex flex-col relative group shadow-[12px_12px_0_#0A0A1A] transition-all duration-300 hover:scale-[1.02] hover:-translate-y-2 cursor-pointer"
              style={{
                // Explicitly defining the dynamic hover border color using CSS variable via logic below
              }}
              onMouseEnter={(e) => {
                const target = e.currentTarget;
                target.style.borderColor = player.teamColor;
                const stats = target.querySelectorAll('.stat-metric');
                stats.forEach(s => (s as HTMLElement).style.color = player.teamColor);
              }}
              onMouseLeave={(e) => {
                const target = e.currentTarget;
                target.style.borderColor = "var(--crex-ink)";
                const stats = target.querySelectorAll('.stat-metric');
                stats.forEach(s => (s as HTMLElement).style.color = "var(--crex-ink)");
              }}
            >
              {/* Top accent bar */}
              <div 
                className="absolute top-0 left-0 w-full h-[8px]" 
                style={{ backgroundColor: player.teamColor }} 
              />

              {/* Large Team Watermark */}
              <div 
                className="absolute inset-x-0 top-[20%] text-center text-[160px] leading-[0.8] font-black pointer-events-none select-none overflow-hidden flex items-center justify-center opacity-20" 
                style={{ color: player.teamColor, fontFamily: "'Barlow Condensed', sans-serif" }}
              >
                {player.watermark}
              </div>

              {/* Content Header */}
              <div className="relative z-10 mb-8">
                <span className={`text-base font-black tracking-widest px-4 py-1.5 inline-block mb-6 border-2 border-ink shadow-[4px_4px_0_0_#0A0A1A] ${player.roleClass}`} style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
                  {player.role}
                </span>
                <h3 
                  className="text-[64px] font-black leading-[0.85] tracking-tighter uppercase"
                  style={{ fontFamily: "'Barlow Condensed', sans-serif", color: player.teamColor }}
                >
                  {player.name}
                </h3>
              </div>

              {/* Stats Grid 2x2 */}
              <div className="grid grid-cols-2 gap-4 mt-auto relative z-10 pt-16">
                {Object.entries(player.stats).map(([key, val]) => (
                  <div key={key} className="bg-white/90 border-t-2 border-ink/20 pt-2 flex flex-col group/stat">
                    <span 
                       className="block text-xs md:text-sm uppercase font-black text-ink/60 mb-1" 
                       style={{ fontFamily: "'JetBrains Mono', monospace" }}
                    >
                      {key}
                    </span>
                    <span 
                       className="stat-metric transition-colors duration-300 block text-3xl font-black text-ink" 
                       style={{ fontFamily: "'JetBrains Mono', monospace" }}
                    >
                      {val}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll indicator Bottom Left */}
      <div className="absolute bottom-8 left-6 md:left-12 z-30 flex items-center gap-6">
        <div className="flex gap-2">
           {PLAYERS.map((_, i) => (
             <div 
               key={i} 
               className={`w-3 h-3 rounded-full border-2 border-sun transition-all duration-300 ${i === activeIndex ? 'bg-sun scale-125' : 'bg-transparent'}`}
             />
           ))}
        </div>
        <div className="flex items-center text-sun font-bold uppercase tracking-widest text-sm" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
          <span>SCROLL TO EXPLORE</span>
          <ArrowRight className="scroll-arrow ml-2 w-5 h-5 text-sun stroke-[3px]" />
        </div>
      </div>

    </section>
  );
}
