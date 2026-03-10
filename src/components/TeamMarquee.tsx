"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { cn } from "@/utils/cn";

const TEAMS = [
  { name: "MUMBAI INDIANS", short: "MI", textColor: "#004BA0", bgClass: "bg-sun" },
  { name: "CHENNAI SUPER KINGS", short: "CSK", textColor: "#F5A623", bgClass: "bg-royal border-4 border-[#F5A623]" },
  { name: "ROYAL CHALLENGERS BENGALURU", short: "RCB", textColor: "#E6001A", bgClass: "bg-white" },
  { name: "KOLKATA KNIGHT RIDERS", short: "KKR", textColor: "#3A225D", bgClass: "bg-sun" },
  { name: "SUNRISERS HYDERABAD", short: "SRH", textColor: "#F26522", bgClass: "bg-white" },
  { name: "GUJARAT TITANS", short: "GT", textColor: "#FFFFFF", bgClass: "bg-ink" },
  { name: "RAJASTHAN ROYALS", short: "RR", textColor: "#EA1A85", bgClass: "bg-white" },
  { name: "DELHI CAPITALS", short: "DC", textColor: "#00008B", bgClass: "bg-sky" },
  { name: "PUNJAB KINGS", short: "PBKS", textColor: "#D71920", bgClass: "bg-white" },
  { name: "LUCKNOW SUPER GIANTS", short: "LSG", textColor: "#0050A0", bgClass: "bg-sky" },
];

const STATS = [
  { name: "VIRAT KOHLI", metric: "7263 RUNS", team: "RCB" },
  { name: "SHIKHAR DHAWAN", metric: "6617 RUNS", team: "PBKS" },
  { name: "DAVID WARNER", metric: "6397 RUNS", team: "DC" },
  { name: "ROHIT SHARMA", metric: "6211 RUNS", team: "MI" },
  { name: "SURESH RAINA", metric: "5528 RUNS", team: "CSK" },
  { name: "AB DE VILLIERS", metric: "5162 RUNS", team: "RCB" },
  { name: "MS DHONI", metric: "5082 RUNS", team: "CSK" },
  { name: "YUZVENDRA CHAHAL", metric: "187 WICKETS", team: "RR" },
  { name: "DJ BRAVO", metric: "183 WICKETS", team: "CSK" },
  { name: "PIYUSH CHAWLA", metric: "179 WICKETS", team: "MI" },
];

export function TeamMarquee() {
  const row1Ref = useRef<HTMLDivElement>(null);
  const row2Ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let row1Tween: gsap.core.Tween;
    let row2Tween: gsap.core.Tween;

    const ctx = gsap.context(() => {
      // Row 1
      if (row1Ref.current) {
        row1Tween = gsap.to(row1Ref.current, {
          xPercent: -50,
          repeat: -1,
          duration: 25,
          ease: "none",
        });
      }

      // Row 2 (opposite direction)
      if (row2Ref.current) {
        gsap.set(row2Ref.current, { xPercent: -50 });
        row2Tween = gsap.to(row2Ref.current, {
          xPercent: 0,
          repeat: -1,
          duration: 25,
          ease: "none",
        });
      }
    });

    const handleHover = (pause: boolean) => {
      gsap.to([row1Tween, row2Tween], { 
        timeScale: pause ? 0.1 : 1, 
        duration: 0.8,
        ease: "power2.out"
      });
    };

    const section = row1Ref.current?.parentElement?.parentElement;
    if (section) {
      section.addEventListener("mouseenter", () => handleHover(true));
      section.addEventListener("mouseleave", () => handleHover(false));
    }

    return () => {
      ctx.revert();
      if (section) {
        section.removeEventListener("mouseenter", () => handleHover(true));
        section.removeEventListener("mouseleave", () => handleHover(false));
      }
    };
  }, []);

  // Double the arrays for seamless infinite marquee loop
  const duplicateTeams = [...TEAMS, ...TEAMS];
  const duplicateStats = [...STATS, ...STATS];

  return (
    <section className="relative w-full overflow-hidden bg-royal py-16 z-10 border-y-[12px] border-ink">
      
      {/* Row 1 - Team Pills */}
      <div className="flex whitespace-nowrap w-[200vw]">
        <div ref={row1Ref} className="flex gap-6 md:gap-8 items-center flex-nowrap shrink-0 px-4">
          {duplicateTeams.map((team, idx) => (
            <div
              key={`${team.short}-${idx}`}
              className={cn(
                "px-8 py-3 rounded-full flex items-center justify-center shrink-0 shadow-[6px_6px_0_#0A0A1A] border-4 border-transparent",
                team.bgClass
              )}
            >
              <span 
                className="text-[clamp(40px,6vw,80px)] leading-[0.8] font-black uppercase"
                style={{ fontFamily: "'Barlow Condensed', sans-serif", color: team.textColor }}
              >
                {team.name}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="h-4" /> {/* 16px Gap between rows */}

      {/* Row 2 - Live Stats Ticker */}
      <div className="flex whitespace-nowrap w-[200vw]">
        <div ref={row2Ref} className="flex gap-8 md:gap-12 items-center flex-nowrap shrink-0 px-4">
          {duplicateStats.map((stat, idx) => (
            <div
              key={`${stat.name}-${idx}`}
              className="flex items-center gap-8 md:gap-12 shrink-0"
            >
              <div 
                className="text-sun font-bold text-xl md:text-3xl tracking-widest uppercase flex items-center gap-3"
                style={{ fontFamily: "'JetBrains Mono', monospace" }}
              >
                <span>{stat.name}</span>
                <span className="text-sky text-shadow-sm font-black mx-2">·</span>
                <span>{stat.metric}</span>
                <span className="text-sky text-shadow-sm font-black mx-2">·</span>
                <span>{stat.team}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </section>
  );
}
