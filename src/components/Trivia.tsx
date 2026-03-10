"use client";

import { useState, useEffect, useRef } from "react";
import confetti from "canvas-confetti";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Flame } from "lucide-react";
import { cn } from "@/utils/cn";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const TRIVIA_DATA = {
  question: "Who holds the record for the most sixes hit in a single IPL season?",
  options: [
    { id: "A", text: "Chris Gayle", isCorrect: true },
    { id: "B", text: "Andre Russell", isCorrect: false },
    { id: "C", text: "Jos Buttler", isCorrect: false },
    { id: "D", text: "Virat Kohli", isCorrect: false },
  ],
  stats: {
    title: "MIND-BLOWING STAT:",
    value: "59",
    desc: "Chris Gayle smashed 59 sixes in 14 innings during the 2012 IPL season for RCB. No other player has crossed 55 in a single edition.",
  },
};

export function Trivia() {
  const [streak, setStreak] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLHeadingElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const statsPanelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Load streak from local storage
    const savedStreak = localStorage.getItem("crex-trivia-streak");
    if (savedStreak) setStreak(parseInt(savedStreak, 10));

    const ctx = gsap.context(() => {
      // Character-by-character scroll reveal for the left text
      if (textRef.current) {
        const letters = textRef.current.querySelectorAll("span");
        gsap.fromTo(
          letters,
          { opacity: 0.1, color: "var(--crex-navy)" },
          {
            opacity: 1,
            color: "var(--crex-white)",
            stagger: 0.05,
            scrollTrigger: {
              trigger: containerRef.current,
              start: "top 60%",
              end: "bottom 80%",
              scrub: 1,
            },
          }
        );
      }
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const handleSelect = (id: string, isCorrect: boolean) => {
    if (answered) return;
    setSelectedId(id);
    setAnswered(true);

    if (isCorrect) {
      // Correct: Green pulse + confetti
      const rect = cardRef.current?.getBoundingClientRect();
      if (rect) {
        const x = (rect.left + rect.width / 2) / window.innerWidth;
        const y = (rect.top + rect.height / 2) / window.innerHeight;
        confetti({
          particleCount: 150,
          spread: 80,
          origin: { x, y },
          colors: ["#00C2E0", "#F5B800", "#D42060"],
          zIndex: 100,
        });
      }
      const newStreak = streak + 1;
      setStreak(newStreak);
      localStorage.setItem("crex-trivia-streak", newStreak.toString());
      
      gsap.fromTo(cardRef.current, { scale: 1 }, { scale: 1.05, yoyo: true, repeat: 1, duration: 0.2, ease: "power2.out" });
    } else {
      // Wrong: Red shake
      setStreak(0);
      localStorage.setItem("crex-trivia-streak", "0");
      gsap.fromTo(
        cardRef.current,
        { x: -10 },
        { x: 10, clearProps: "x", duration: 0.05, yoyo: true, repeat: 5 }
      );
    }

    // Slide up stats panel
    if (statsPanelRef.current) {
      gsap.to(statsPanelRef.current, {
        y: 0,
        opacity: 1,
        duration: 0.6,
        ease: "power3.out",
        delay: 0.5,
      });
    }
  };

  const textToReveal = "TEST YOUR CRICKET IQ.";

  return (
    <section ref={containerRef} className="py-24 md:py-40 bg-navy relative z-10 px-6 md:px-12 border-t border-blue/30">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16">
        
        {/* Left Side: Scroll Reveal Text */}
        <div className="w-full lg:w-1/2">
          <h2
            ref={textRef}
            className="text-[clamp(60px,8vw,120px)] font-black uppercase leading-[0.85] tracking-tight"
            style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
          >
            {textToReveal.split("").map((char, i) => (
              <span key={i} className="inline-block">
                {char === " " ? "\u00A0" : char}
              </span>
            ))}
          </h2>
          <div className="mt-8 flex items-center gap-3">
            <div className="bg-void/50 border border-gold/30 rounded-full px-4 py-2 flex items-center gap-2">
              <Flame className="text-amber animate-pulse" size={20} />
              <span className="text-white font-mono font-bold text-sm">
                CURRENT STREAK: <span className="text-gold text-lg">{streak}</span>
              </span>
            </div>
          </div>
        </div>

        {/* Right Side: Interactive Trivia Card */}
        <div className="w-full lg:w-1/2 flex justify-center lg:justify-end">
          <div 
            ref={cardRef}
            className="w-full max-w-md bg-void border border-navy rounded-2xl p-8 relative overflow-hidden shadow-2xl"
          >
            {/* Background Accent */}
            <div className="absolute -top-20 -right-20 w-40 h-40 bg-magenta/10 blur-[50px] rounded-full pointer-events-none" />

            <div className="mb-8">
              <span className="text-magenta text-xs font-black tracking-widest uppercase mb-4 inline-block">DAILY TRIVIA</span>
              <h3 className="text-2xl font-bold text-white mb-2 leading-tight">
                {TRIVIA_DATA.question}
              </h3>
            </div>

            <div className="space-y-3 relative z-10">
              {TRIVIA_DATA.options.map((option) => {
                let stateClass = "border-navy hover:border-cyan hover:bg-navy/30";
                
                if (answered) {
                  if (option.isCorrect) {
                     stateClass = "border-green-500 bg-green-500/10 text-green-400"; // Correct answer styling
                  } else if (selectedId === option.id) {
                     stateClass = "border-red-500 bg-red-500/10 text-red-400"; // Wrong selected styling
                  } else {
                     stateClass = "border-navy opacity-50"; // Other unselected
                  }
                }

                return (
                  <button
                    key={option.id}
                    onClick={() => handleSelect(option.id, option.isCorrect)}
                    disabled={answered}
                    className={cn(
                      "w-full text-left p-4 rounded-xl border transition-all duration-300 flex items-center gap-4 bg-void font-bold",
                      stateClass
                    )}
                  >
                    <span 
                      className={cn(
                        "flex items-center justify-center w-8 h-8 rounded-md font-mono text-sm border",
                        answered && option.isCorrect ? "bg-green-500/20 border-green-500" :
                        answered && selectedId === option.id ? "bg-red-500/20 border-red-500" :
                        "bg-navy border-white/10"
                      )}
                    >
                      {option.id}
                    </span>
                    {option.text}
                  </button>
                );
              })}
            </div>

            {/* Stats Reveal Panel */}
            <div 
              ref={statsPanelRef}
              className="absolute bottom-0 left-0 right-0 bg-blue border-t border-cyan p-6 transform translate-y-full opacity-0"
            >
              <h4 className="text-gold font-black uppercase tracking-wider text-sm mb-1">{TRIVIA_DATA.stats.title}</h4>
              <div className="flex items-baseline gap-2 mb-2">
                <span className="text-4xl font-mono font-black text-white">{TRIVIA_DATA.stats.value}</span>
              </div>
              <p className="text-white/80 text-sm leading-relaxed">
                {TRIVIA_DATA.stats.desc}
              </p>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
