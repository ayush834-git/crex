"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { cn } from "@/utils/cn";

const TEAMS = [
  { name: "MUMBAI INDIANS", color: "text-blue" },
  { name: "CHENNAI SUPER KINGS", color: "text-gold" },
  { name: "ROYAL CHALLENGERS BENGALURU", color: "text-magenta" },
  { name: "KOLKATA KNIGHT RIDERS", color: "text-[#3a225d]" },
  { name: "SUNRISERS HYDERABAD", color: "text-amber" },
  { name: "GUJARAT TITANS", color: "text-cyan" },
  { name: "RAJASTHAN ROYALS", color: "text-pink-500" },
  { name: "DELHI CAPITALS", color: "text-blue-500" },
  { name: "PUNJAB KINGS", color: "text-red-500" },
  { name: "LUCKNOW SUPER GIANTS", color: "text-teal-500" },
];

const STATS = [
  "ROHIT SHARMA · 6502 RUNS · MI",
  "VIRAT KOHLI · 7263 RUNS · RCB",
  "MS DHONI · 5082 RUNS · CSK",
  "YUZVENDRA CHAHAL · 187 WICKETS · RR",
  "SHIKHAR DHAWAN · 6617 RUNS · PBKS",
  "DAVID WARNER · 6397 RUNS · DC",
  "RASHID KHAN · 139 WICKETS · GT",
  "SURYAKUMAR YADAV · 3249 RUNS · MI",
  "JASPRIT BUMRAH · 148 WICKETS · MI",
  "GLENN MAXWELL · 2719 RUNS · RCB",
];

export function TeamMarquee() {
  const row1Ref = useRef<HTMLDivElement>(null);
  const row2Ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let row1Tween: gsap.core.Tween;
    let row2Tween: gsap.core.Tween;

    const ctx = gsap.context(() => {
      // Endless horizontal scroll for Row 1
      if (row1Ref.current) {
        row1Tween = gsap.to(row1Ref.current, {
          xPercent: -50,
          repeat: -1,
          duration: 30, // Slow speed
          ease: "linear",
        });
      }

      // Endless horizontal scroll for Row 2 (opposite direction, slightly faster)
      if (row2Ref.current) {
        gsap.set(row2Ref.current, { xPercent: -50 });
        row2Tween = gsap.to(row2Ref.current, {
          xPercent: 0,
          repeat: -1,
          duration: 40,
          ease: "linear",
        });
      }
    });

    const handleHover = (pause: boolean) => {
      if (pause) {
        gsap.to([row1Tween, row2Tween], { timeScale: 0.2, duration: 0.5 });
      } else {
        gsap.to([row1Tween, row2Tween], { timeScale: 1, duration: 0.5 });
      }
    };

    const section = row1Ref.current?.parentElement;
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

  return (
    <section className="relative w-full overflow-hidden bg-void py-12 md:py-24 z-10 border-y border-navy">
      {/* Ghost gradient edges for smooth fading */}
      <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-void to-transparent z-20 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-void to-transparent z-20 pointer-events-none" />

      {/* Row 1 - Teams */}
      <div className="flex whitespace-nowrap pt-4 pb-8" style={{ width: "200%" }}>
        <div ref={row1Ref} className="flex w-full gap-8 md:gap-16 items-center flex-nowrap shrink-0">
          {[...TEAMS, ...TEAMS].map((team, idx) => (
            <div
              key={`${team.name}-${idx}`}
              className={cn(
                "text-4xl md:text-7xl font-black uppercase tracking-tighter shrink-0 hover:text-white transition-colors cursor-default",
                team.color,
                // Add a subtle text-stroke effect
                "style-stroke"
              )}
              style={{
                fontFamily: "'Barlow Condensed', sans-serif",
                WebkitTextStroke: "1px currentColor",
                color: "transparent"
              }}
            >
              {team.name}
            </div>
          ))}
        </div>
      </div>

      {/* Row 2 - Stats */}
      <div className="flex whitespace-nowrap pt-8 pb-4" style={{ width: "200%" }}>
        <div ref={row2Ref} className="flex w-full gap-12 md:gap-24 items-center flex-nowrap shrink-0">
          {[...STATS, ...STATS].map((stat, idx) => (
            <div
              key={`${stat}-${idx}`}
              className="text-lg md:text-2xl font-mono shrink-0 text-white/40 hover:text-cyan transition-colors cursor-default tracking-widest"
            >
              {stat}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
