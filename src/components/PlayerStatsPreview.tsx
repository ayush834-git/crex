"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { cn } from "@/utils/cn";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const PLAYERS = [
  {
    name: "VIRAT KOHLI",
    team: "RCB",
    role: "BATSMAN",
    stats: { matches: 237, runs: 7263, sr: 130.0 },
    color: "var(--crex-magenta)",
  },
  {
    name: "MS DHONI",
    team: "CSK",
    role: "WICKETKEEPER",
    stats: { matches: 250, runs: 5082, sr: 135.9 },
    color: "var(--crex-gold)",
  },
  {
    name: "JASPRIT BUMRAH",
    team: "MI",
    role: "BOWLER",
    stats: { matches: 120, wickets: 148, econ: 7.39 },
    color: "var(--crex-blue)",
  },
];

export function PlayerStatsPreview() {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollWrapperRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Pinning the section and translating the wrapper horizontally
      const scrollDist = (PLAYERS.length - 1) * window.innerWidth * 0.4;
      
      gsap.to(scrollWrapperRef.current, {
        x: -scrollDist,
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          pin: true,
          scrub: 1,
          end: `+=${scrollDist}`,
        },
      });
    }, containerRef);

    // Subtle 3D tilt on mousemove
    const handleMouseMove = (e: MouseEvent, card: HTMLDivElement) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const multiplier = 20; // max rotation degrees
      const xRotate = multiplier * ((y - rect.height / 2) / rect.height);
      const yRotate = -multiplier * ((x - rect.width / 2) / rect.width);
      
      gsap.to(card, {
        rotateX: xRotate,
        rotateY: yRotate,
        duration: 0.5,
        ease: "power2.out",
        transformPerspective: 1000,
      });
    };

    const handleMouseLeave = (card: HTMLDivElement) => {
      gsap.to(card, {
        rotateX: 0,
        rotateY: 0,
        duration: 0.5,
        ease: "power2.out",
      });
    };

    const activeCards = cardsRef.current.filter(Boolean) as HTMLDivElement[];
    const listeners = activeCards.map(card => {
      const moveHandler = (e: MouseEvent) => handleMouseMove(e, card);
      const leaveHandler = () => handleMouseLeave(card);
      card.addEventListener("mousemove", moveHandler);
      card.addEventListener("mouseleave", leaveHandler);
      return { card, moveHandler, leaveHandler };
    });

    return () => {
      ctx.revert();
      listeners.forEach(({ card, moveHandler, leaveHandler }) => {
        card.removeEventListener("mousemove", moveHandler);
        card.removeEventListener("mouseleave", leaveHandler);
      });
    };
  }, []);

  return (
    <section ref={containerRef} className="h-screen bg-void flex flex-col justify-center overflow-hidden border-t border-navy relative">
      <div className="absolute top-12 left-6 md:left-12 z-20">
         <h2 
           className="text-4xl md:text-5xl font-black text-white uppercase tracking-wider"
           style={{ fontFamily: "'Bebas Neue', 'Barlow Condensed', sans-serif" }}
          >
           PLAYER <span className="text-cyan">PROFILES.</span>
         </h2>
      </div>

      {/* Background large text */}
      <div 
        className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none select-none overflow-hidden"
        style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
      >
        <span className="text-[30vw] font-black tracking-tighter text-white whitespace-nowrap">
          LEGENDS
        </span>
      </div>

      <div className="w-full pl-6 md:pl-12 pt-20">
        <div ref={scrollWrapperRef} className="flex gap-8 md:gap-16 w-[150vw] md:w-[200vw] lg:w-[120vw]">
          {PLAYERS.map((player, i) => (
            <div 
              key={player.name}
              ref={(el) => { cardsRef.current[i] = el; }}
              className="w-[80vw] md:w-[60vw] lg:w-[35vw] shrink-0 bg-navy/80 backdrop-blur-md rounded-2xl border border-white/5 p-8 flex flex-col justify-between aspect-[3/4] md:aspect-square relative overflow-hidden group cursor-crosshair"
            >
              {/* Card Accent Line top */}
              <div 
                className="absolute top-0 left-0 right-0 h-1"
                style={{ backgroundColor: player.color }}
              />

              {/* Large Team Watermark */}
              <div className="absolute -right-8 -bottom-16 text-[150px] font-black opacity-10 pointer-events-none" style={{ color: player.color, fontFamily: "'Barlow Condensed', sans-serif" }}>
                {player.team}
              </div>

              <div>
                <span className="text-sm font-bold tracking-widest text-white/50 mb-2 block">{player.role}</span>
                <h3 
                  className="text-5xl md:text-7xl font-black leading-none tracking-tighter mb-4"
                  style={{ fontFamily: "'Barlow Condensed', sans-serif", color: player.color }}
                >
                  {player.name}
                </h3>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-auto">
                {Object.entries(player.stats).map(([key, val]) => (
                  <div key={key} className="bg-void/50 p-4 rounded-xl border border-white/5">
                    <span className="block text-xs uppercase tracking-widest text-white/50 font-bold mb-1">{key}</span>
                    <span className="block text-3xl font-mono font-black text-white">{val}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
