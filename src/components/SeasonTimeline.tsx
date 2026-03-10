"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Trophy } from "lucide-react";
import { cn } from "@/utils/cn";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const SEASONS = [
  { year: 2008, team: "RR", color: "var(--crex-magenta)", runs: 4423, wickets: 180 },
  { year: 2009, team: "DC", color: "var(--crex-blue)", runs: 4210, wickets: 172 },
  { year: 2010, team: "CSK", color: "var(--crex-gold)", runs: 5123, wickets: 198 },
  { year: 2011, team: "CSK", color: "var(--crex-gold)", runs: 4980, wickets: 185 },
  { year: 2012, team: "KKR", color: "#3a225d", runs: 5200, wickets: 204 },
  { year: 2013, team: "MI", color: "var(--crex-blue)", runs: 5410, wickets: 211 },
  { year: 2014, team: "KKR", color: "#3a225d", runs: 5010, wickets: 190 },
  { year: 2015, team: "MI", color: "var(--crex-blue)", runs: 5320, wickets: 205 },
  { year: 2016, team: "SRH", color: "var(--crex-amber)", runs: 5543, wickets: 215 },
  { year: 2017, team: "MI", color: "var(--crex-blue)", runs: 5120, wickets: 199 },
  { year: 2018, team: "CSK", color: "var(--crex-gold)", runs: 5670, wickets: 220 },
  { year: 2019, team: "MI", color: "var(--crex-blue)", runs: 5800, wickets: 222 },
  { year: 2020, team: "MI", color: "var(--crex-blue)", runs: 5740, wickets: 218 },
  { year: 2021, team: "CSK", color: "var(--crex-gold)", runs: 5890, wickets: 225 },
  { year: 2022, team: "GT", color: "var(--crex-cyan)", runs: 6010, wickets: 230 },
  { year: 2023, team: "CSK", color: "var(--crex-gold)", runs: 6150, wickets: 235 },
  { year: 2026, team: "TBD", color: "var(--crex-white)", runs: 0, wickets: 0 },
];

export function SeasonTimeline() {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollWrapperRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const [activeSeason, setActiveSeason] = useState(SEASONS[0].year);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Pinning the section and translating the wrapper horizontally
      const scrollDist = (SEASONS.length - 1) * 250; // Approximated width
      
      const tl = gsap.to(scrollWrapperRef.current, {
        x: -scrollDist,
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          pin: true,
          scrub: 1,
          end: `+=${scrollDist}`,
          onUpdate: (self) => {
            // Update active season based on scroll progress
            const maxIndex = SEASONS.length - 1;
            const index = Math.floor(self.progress * maxIndex);
            
            // Only update state if it changed to avoid excessive re-renders
            setActiveSeason((prev) => {
              const next = SEASONS[index].year;
              return prev !== next ? next : prev;
            });
            
            // Update the width of the animated connecting line
            if (lineRef.current) {
               gsap.set(lineRef.current, { scaleX: self.progress });
            }
          }
        },
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} className="h-screen bg-navy flex flex-col justify-center overflow-hidden border-t-2 border-void relative py-32">
       <div className="absolute top-12 md:top-24 left-6 md:left-12 z-20">
         <h2 
           className="text-4xl md:text-5xl font-black text-white uppercase tracking-wider"
           style={{ fontFamily: "'Bebas Neue', 'Barlow Condensed', sans-serif" }}
          >
           THE <span className="text-gold">LEGACY.</span>
         </h2>
      </div>

      <div className="relative w-full overflow-hidden mt-12 md:mt-24 h-64 md:h-96 flex items-center">
        
        {/* Animated Connecting Line (Background) */}
        <div className="absolute top-1/2 left-0 w-[4000px] h-1 bg-void -translate-y-1/2 z-0" />
        <div className="absolute top-1/2 left-0 w-[4000px] h-1 origin-left -translate-y-1/2 z-0">
          <div ref={lineRef} className="h-full bg-cyan transform scale-x-0 origin-left" />
        </div>

        <div ref={scrollWrapperRef} className="flex items-center px-[50vw] sm:px-[30vw]">
          {SEASONS.map((season) => {
            const isActive = season.year === activeSeason;
            return (
              <div 
                key={season.year} 
                className="relative flex flex-col items-center justify-center shrink-0 w-[250px] transition-all duration-500 ease-in-out"
                style={{
                  transform: isActive ? 'scale(1.2)' : 'scale(0.8)',
                  opacity: isActive ? 1 : 0.4,
                  zIndex: isActive ? 10 : 1
                }}
              >
                {/* Year Badge */}
                <div 
                  className={cn(
                    "mb-6 text-xl md:text-3xl font-black tracking-widest px-4 py-2 bg-void border transition-colors duration-300",
                    isActive ? "text-cyan border-cyan" : "text-white/50 border-transparent"
                  )}
                  style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
                >
                  {season.year}
                </div>

                {/* Main Node */}
                <div 
                  className={cn(
                    "w-16 h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center border-4 shadow-xl transition-all duration-500 z-10",
                    isActive ? "bg-void border-white" : "bg-navy border-navy"
                  )}
                  style={{ borderColor: isActive ? season.color : undefined }}
                >
                  <Trophy 
                    className="w-8 h-8 md:w-10 md:h-10 transition-transform duration-500" 
                    style={{ 
                      color: isActive ? season.color : "white",
                      transform: isActive ? "scale(1.1)" : "scale(1)"
                    }} 
                  />
                </div>

                {/* Expanding Stats Panel */}
                <div 
                   className={cn(
                     "absolute top-[120%] lg:top-full lg:mt-6 bg-void/90 backdrop-blur border rounded-xl p-4 w-48 text-center transition-all duration-500",
                     isActive ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"
                   )}
                   style={{ borderColor: season.color }}
                >
                  <h4 
                    className="text-3xl font-black tracking-widest mb-2"
                    style={{ fontFamily: "'Barlow Condensed', sans-serif", color: season.color }}
                  >
                    {season.team}
                  </h4>
                  <div className="grid grid-cols-2 gap-2 text-left">
                    <div>
                      <span className="text-[10px] text-white/50 uppercase block font-bold tracking-widest">Runs</span>
                      <span className="font-mono text-sm text-white">{season.runs}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-white/50 uppercase block font-bold tracking-widest">Wickets</span>
                      <span className="font-mono text-sm text-white">{season.wickets}</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
