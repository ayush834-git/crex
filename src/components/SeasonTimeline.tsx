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
  { year: 2008, team: "RR", color: "var(--crex-crimson)", runs: 4423, wickets: 180 },
  { year: 2009, team: "DC", color: "var(--crex-royal)", runs: 4210, wickets: 172 },
  { year: 2010, team: "CSK", color: "var(--crex-sun)", runs: 5123, wickets: 198 },
  { year: 2011, team: "CSK", color: "var(--crex-sun)", runs: 4980, wickets: 185 },
  { year: 2012, team: "KKR", color: "var(--crex-violet)", runs: 5200, wickets: 204 },
  { year: 2013, team: "MI", color: "var(--crex-royal)", runs: 5410, wickets: 211 },
  { year: 2014, team: "KKR", color: "var(--crex-violet)", runs: 5010, wickets: 190 },
  { year: 2015, team: "MI", color: "var(--crex-royal)", runs: 5320, wickets: 205 },
  { year: 2016, team: "SRH", color: "var(--crex-crimson)", runs: 5543, wickets: 215 },
  { year: 2017, team: "MI", color: "var(--crex-royal)", runs: 5120, wickets: 199 },
  { year: 2018, team: "CSK", color: "var(--crex-sun)", runs: 5670, wickets: 220 },
  { year: 2019, team: "MI", color: "var(--crex-royal)", runs: 5800, wickets: 222 },
  { year: 2020, team: "MI", color: "var(--crex-royal)", runs: 5740, wickets: 218 },
  { year: 2021, team: "CSK", color: "var(--crex-sun)", runs: 5890, wickets: 225 },
  { year: 2022, team: "GT", color: "var(--crex-ink)", runs: 6010, wickets: 230 },
  { year: 2023, team: "CSK", color: "var(--crex-sun)", runs: 6150, wickets: 235 },
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
      
      gsap.to(scrollWrapperRef.current, {
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
    <section ref={containerRef} className="h-screen bg-sky flex flex-col justify-center overflow-hidden border-b-8 border-ink relative py-32">
       
       {/* Diagnostic styling slants */}
       <div className="absolute inset-0 pointer-events-none z-0">
          <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 100">
             <polygon fill="#1A1AE6" opacity="0.05" points="0,0 100,20 100,100 0,80" />
          </svg>
       </div>

       <div className="absolute top-12 md:top-24 left-6 md:left-12 z-20">
         <h2 
           className="text-[clamp(50px,8vw,100px)] leading-[0.8] font-black text-sun uppercase tracking-wider bg-ink border-[6px] border-sun inline-block px-6 py-2 shadow-[8px_8px_0_#1A1AE6]"
           style={{ fontFamily: "'Bebas Neue', 'Barlow Condensed', sans-serif", transform: "rotate(-2deg)" }}
          >
           THE <span className="text-royal">LEGACY.</span>
         </h2>
      </div>

      <div className="relative w-full overflow-hidden mt-12 md:mt-24 h-64 md:h-96 flex items-center">
        
        {/* Animated Connecting Line (Background) */}
        <div className="absolute top-1/2 left-0 w-[4000px] h-4 bg-ink border-y-4 border-[#F5C51840] -translate-y-1/2 z-0" />
        <div className="absolute top-1/2 left-0 w-[4000px] h-4 origin-left -translate-y-1/2 z-0 border-y-4 border-[#F5C51840]">
          <div ref={lineRef} className="h-full bg-crimson transform scale-x-0 origin-left" />
        </div>

        <div ref={scrollWrapperRef} className="flex items-center px-[50vw] sm:px-[30vw]">
          {SEASONS.map((season) => {
            const isActive = season.year === activeSeason;
            return (
              <div 
                key={season.year} 
                className="relative flex flex-col items-center justify-center shrink-0 w-[250px] transition-all duration-300 ease-in-out"
                style={{
                  transform: isActive ? 'scale(1.3)' : 'scale(0.8)',
                  opacity: isActive ? 1 : 0.6,
                  zIndex: isActive ? 20 : 1
                }}
              >
                {/* Year Badge */}
                <div 
                  className={cn(
                    "mb-8 text-2xl md:text-4xl font-black tracking-widest px-4 py-2 border-[4px] border-sun shadow-[4px_4px_0_#080C18] transition-all duration-300",
                    isActive ? "bg-sun text-ink scale-110" : "bg-ink text-sun"
                  )}
                  style={{ fontFamily: "'Barlow Condensed', sans-serif", transform: isActive ? 'rotate(3deg)' : 'rotate(-2deg)' }}
                >
                  {season.year}
                </div>

                {/* Main Node */}
                <div 
                  className={cn(
                    "w-20 h-20 md:w-24 md:h-24 rounded-full flex items-center justify-center border-4 shadow-[6px_6px_0_#080C18] transition-all duration-300 z-10",
                    isActive ? "bg-ink border-sun" : "bg-ink border-sun"
                  )}
                  style={{ backgroundColor: isActive ? season.color : '#080C18' }}
                >
                  <Trophy 
                    className="w-10 h-10 md:w-12 md:h-12 transition-transform duration-300 outline-none" 
                    strokeWidth={isActive ? 2.5 : 2}
                    style={{ 
                      color: isActive ? "#FFFFFF" : "#F5C518",
                      transform: isActive ? "scale(1.1) rotate(-10deg)" : "scale(1)",
                      filter: isActive ? "drop-shadow(2px 2px 0px rgba(8,12,24,1))" : "none"
                    }} 
                  />
                </div>

                {/* Expanding Stats Panel */}
                <div 
                   className={cn(
                     "absolute top-[120%] lg:top-full lg:mt-6 bg-ink border-[4px] border-sun shadow-[6px_6px_0_#080C18] p-4 w-56 text-center transition-all duration-300 origin-top",
                     isActive ? "opacity-100 scale-100 rotate-1" : "opacity-0 scale-90 -rotate-2 pointer-events-none"
                   )}
                >
                  <h4 
                    className="text-4xl font-black tracking-tighter mb-2 uppercase"
                    style={{ fontFamily: "'Barlow Condensed', sans-serif", color: season.color }}
                  >
                    {season.team}
                  </h4>
                  <div className="grid grid-cols-2 gap-2 text-left bg-sun/10 p-2 border-2 border-sun">
                    <div>
                      <span className="text-[10px] text-sun uppercase block font-black tracking-widest mb-1">Runs</span>
                      <span className="font-mono text-xl text-white font-bold">{season.runs}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-sun uppercase block font-black tracking-widest mb-1">Wickets</span>
                      <span className="font-mono text-xl text-white font-bold">{season.wickets}</span>
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
