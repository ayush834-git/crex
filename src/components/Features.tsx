"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Brain, Activity, Target, Zap, TrendingUp, Shield } from "lucide-react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const FEATURES = [
  {
    title: "PREDICTIVE ENGINE",
    desc: "Real-time win probability and deep learning models tracking ball-by-ball momentum shifts.",
    icon: Brain,
    color: "var(--crex-cyan)",
    borderClass: "group-hover:border-cyan",
    bgAccent: "bg-cyan",
  },
  {
    title: "PLAYER MATCHUPS",
    desc: "Historical performance filtering. See exactly how Bumrah bowls to Kohli in the death overs.",
    icon: Target,
    color: "var(--crex-magenta)",
    borderClass: "group-hover:border-magenta",
    bgAccent: "bg-magenta",
  },
  {
    title: "LIVE TELEMETRY",
    desc: "Pitch maps, wagon wheels, and ball tracking velocity updated instantly.",
    icon: Activity,
    color: "var(--crex-gold)",
    borderClass: "group-hover:border-gold",
    bgAccent: "bg-gold",
  },
  {
    title: "MOMENTUM TRACKER",
    desc: "Graphical visualizer indicating which team has the upper hand minute by minute.",
    icon: Zap,
    color: "var(--crex-amber)",
    borderClass: "group-hover:border-amber",
    bgAccent: "bg-amber",
  },
  {
    title: "FANTASY INSIGHTS",
    desc: "Data-backed player recommendations based on venue stats and current form.",
    icon: TrendingUp,
    color: "var(--crex-blue)",
    borderClass: "group-hover:border-blue",
    bgAccent: "bg-blue",
  },
  {
    title: "IMPACT PLAYER ALERTS",
    desc: "Strategic substitution analysis predicting the optimal moment to use the Impact Rule.",
    icon: Shield,
    color: "var(--crex-cyan)",
    borderClass: "group-hover:border-cyan",
    bgAccent: "bg-cyan", // Using cyan again for the last one to complete 6 variations
  },
];

export function Features() {
  const containerRef = useRef<HTMLDivElement>(null);
  const titleWordsRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Title reveal animation
      if (titleWordsRef.current) {
        const words = titleWordsRef.current.querySelectorAll(".feature-word");
        gsap.fromTo(
          words,
          { y: 100, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            stagger: 0.1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: containerRef.current,
              start: "top 70%",
            },
          }
        );
      }

      // Cards staggered reveal
      cardsRef.current.forEach((card, i) => {
        if (!card) return;
        gsap.fromTo(
          card,
          { opacity: 0, x: -50, y: 32 },
          {
            opacity: 1,
            x: 0,
            y: 0,
            duration: 0.6,
            delay: i * 0.12, // Stagger from left 120ms apart
            ease: "back.out(1.2)",
            scrollTrigger: {
              trigger: ".cards-grid",
              start: "top 80%",
            },
          }
        );
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} className="py-24 md:py-32 bg-void relative z-10 px-6 md:px-12">
      <div className="max-w-7xl mx-auto">
        <div className="mb-16 md:mb-24 flex items-end justify-between">
          <h2
            ref={titleWordsRef}
            className="text-4xl md:text-6xl font-black uppercase text-white flex gap-4 overflow-hidden"
            style={{ fontFamily: "'Bebas Neue', 'Barlow Condensed', sans-serif" }}
          >
            <span className="feature-word inline-block">INTELLIGENCE</span>
            <span className="feature-word inline-block text-gold">REDEFINED.</span>
          </h2>
          <div className="hidden md:block w-32 h-[1px] bg-navy mb-4 relative">
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full border border-gold" />
          </div>
        </div>

        <div className="cards-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {FEATURES.map((feature, i) => (
            <div
              key={feature.title}
              ref={(el) => { cardsRef.current[i] = el; }}
              className={`group relative bg-navy/30 backdrop-blur-sm p-8 rounded-lg overflow-hidden border border-navy transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 cursor-pointer ${feature.borderClass}`}
            >
              {/* Inner glowing effect container */}
              <div 
                className="absolute inset-0 opacity-0 group-hover:opacity-10 pointer-events-none transition-opacity duration-1000"
                style={{ backgroundColor: feature.color }}
              />

              <div className="relative z-10 flex flex-col h-full">
                <feature.icon size={32} style={{ color: feature.color }} className="mb-6 opacity-80 group-hover:opacity-100 transition-opacity drop-shadow-lg" />
                
                <h3 
                  className="text-2xl font-bold uppercase tracking-wide text-white mb-4"
                  style={{ fontFamily: "'Bebas Neue', 'Barlow Condensed', sans-serif" }}
                >
                  {feature.title}
                </h3>
                
                <p className="text-white/70 text-sm leading-relaxed mb-8 flex-grow">
                  {feature.desc}
                </p>

                {/* Bottom Accent Bar Animation */}
                <div className="w-full h-[2px] bg-void mt-auto relative overflow-hidden">
                   <div className={`absolute top-0 left-0 bottom-0 w-full ${feature.bgAccent} -translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-in-out`} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
