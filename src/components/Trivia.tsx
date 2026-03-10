"use client";

import { useState, useRef, useEffect } from "react";
import confetti from "canvas-confetti";
import gsap from "gsap";
import { Flame, Check } from "lucide-react";
import { cn } from "@/utils/cn";
import { motion } from "framer-motion";

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
  const cardRef = useRef<HTMLDivElement>(null);
  const wrongPanelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const saved = localStorage.getItem("crex-trivia-streak");
    if (saved) setStreak(parseInt(saved, 10));
  }, []);

  const handleSelect = (id: string, isCorrect: boolean) => {
    if (answered) return;
    setSelectedId(id);
    setAnswered(true);

    if (isCorrect) {
      // Confetti burst for correct answer
      confetti({
        particleCount: 150,
        spread: 80,
        origin: { y: 0.6 },
        colors: ["#FFE500", "#1A1AE6", "#00B4E6", "#00E640", "#FFFFFF"],
        zIndex: 100,
      });
      const newStreak = streak + 1;
      setStreak(newStreak);
      localStorage.setItem("crex-trivia-streak", newStreak.toString());
    } else {
      // Reset streak
      setStreak(0);
      localStorage.setItem("crex-trivia-streak", "0");
      
      // GSAP Shake animation on the whole card
      if (cardRef.current) {
        gsap.to(cardRef.current, {
          x: "random(-10, 10, 5)",
          y: "random(-5, 5, 3)",
          duration: 0.1,
          repeat: 5,
          yoyo: true,
          clearProps: "all"
        });
      }

      // Slide up violet stat panel
      if (wrongPanelRef.current) {
        gsap.to(wrongPanelRef.current, {
          y: 0,
          opacity: 1,
          duration: 0.5,
          ease: "back.out(1)",
          delay: 0.3,
        });
      }
    }
  };

  return (
    <section ref={containerRef} className="py-24 md:py-32 bg-crimson w-full min-h-[90vh] flex items-center relative overflow-hidden">
      <div className="max-w-[1440px] mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-8 items-center w-full z-10 relative">
        
        {/* Left Side Text Block */}
        <div className="flex flex-col items-start uppercase leading-[0.8] tracking-tighter" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
          <motion.div initial={{ x: -100, opacity: 0 }} whileInView={{ x: 0, opacity: 1 }} transition={{ delay: 0.1, type: "spring", stiffness: 100 }}>
             <span className="text-white drop-shadow-[6px_6px_0_#0A0A1A]" style={{ fontSize: "clamp(100px, 14vw, 160px)" }}>TEST</span>
          </motion.div>
          <motion.div initial={{ x: 100, opacity: 0 }} whileInView={{ x: 0, opacity: 1 }} transition={{ delay: 0.2, type: "spring", stiffness: 100 }}>
             <span className="text-sun drop-shadow-[6px_6px_0_#1A1AE6]" style={{ fontSize: "clamp(100px, 14vw, 160px)" }}>YOUR</span>
          </motion.div>
          <motion.div initial={{ x: -100, opacity: 0 }} whileInView={{ x: 0, opacity: 1 }} transition={{ delay: 0.3, type: "spring", stiffness: 100 }}>
             <span className="text-white drop-shadow-[6px_6px_0_#0A0A1A]" style={{ fontSize: "clamp(60px, 8vw, 100px)" }}>CRICKET</span>
          </motion.div>
          <motion.div initial={{ y: 100, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }} transition={{ delay: 0.4, type: "spring", stiffness: 100 }}>
             <span className="text-sun drop-shadow-[6px_6px_0_#1A1AE6]" style={{ fontSize: "clamp(100px, 14vw, 160px)" }}>
                 IQ<span className="text-violet">.</span>
             </span>
          </motion.div>

          {/* Streak Badge */}
          <motion.div 
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            transition={{ type: "spring", bounce: 0.6, delay: 0.6 }}
            className="mt-12 bg-white rounded-full px-6 py-3 flex items-center gap-3 border-[4px] border-ink shadow-[4px_4px_0_#0A0A1A]"
          >
            <Flame className="text-crimson animate-pulse" size={32} />
            <span className="text-crimson font-black tracking-widest text-2xl uppercase" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
              CURRENT STREAK: {streak}
            </span>
          </motion.div>
        </div>

        {/* Right Side Interactive Card */}
        <div className="flex justify-center lg:justify-end w-full">
           <div 
             ref={cardRef}
             className="w-full max-w-[500px] bg-white border-4 border-royal p-8 pt-10 shadow-[16px_16px_0_#1A1AE6] relative"
           >
              {/* Question */}
              <h3 
                className="text-ink font-bold text-xl leading-tight mb-8 drop-shadow-sm"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              >
                {TRIVIA_DATA.question}
              </h3>

              {/* Options */}
              <div className="space-y-4 relative z-10 bg-white">
                {TRIVIA_DATA.options.map((option) => {
                  let stateClasses = "bg-white border-ink text-ink hover:bg-royal hover:text-white";
                  let showCheck = false;

                  if (answered) {
                    if (option.isCorrect) {
                      stateClasses = "bg-lime border-lime text-white z-10 pointer-events-none scale-105";
                      showCheck = true;
                    } else if (selectedId === option.id) {
                      stateClasses = "bg-crimson border-crimson text-white z-0 pointer-events-none";
                    } else {
                      stateClasses = "bg-gray-100 border-gray-300 text-gray-400 pointer-events-none";
                    }
                  }

                  return (
                    <button
                      key={option.id}
                      onClick={() => handleSelect(option.id, option.isCorrect)}
                      disabled={answered}
                      className={cn(
                        "w-full flex items-center p-4 border-2 font-bold text-lg transition-all duration-300 relative shadow-[4px_4px_0_#0A0A1A]",
                        stateClasses
                      )}
                      style={{ fontFamily: "'DM Sans', sans-serif" }}
                    >
                      <span className="bg-ink text-white font-black w-8 h-8 flex items-center justify-center mr-4 border-2 border-white pointer-events-none">
                        {option.id}
                      </span>
                      <span>{option.text}</span>
                      
                      {showCheck && (
                        <Check size={28} strokeWidth={4} className="ml-auto text-white" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Reveal Panel (Slides up over bottom of card on Wrong Answer) */}
              <div 
                ref={wrongPanelRef}
                className="absolute bottom-0 left-0 w-full bg-violet border-t-8 border-ink p-8 translate-y-full opacity-0 z-20 shadow-[0_-8px_16px_rgba(0,0,0,0.2)]"
                style={{ top: "30%" }} // Cover most options except question
              >
                 <span className="bg-white text-ink text-sm font-black tracking-widest uppercase px-3 py-1 inline-block mb-3 border-2 border-ink shadow-[2px_2px_0_#0A0A1A]">
                   INCORRECT
                 </span>
                 <h4 className="text-white font-black uppercase tracking-wider text-xl mb-2" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
                   {TRIVIA_DATA.stats.title}
                 </h4>
                 <p className="text-white text-base font-medium leading-relaxed" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                   {TRIVIA_DATA.stats.desc}
                 </p>
              </div>
           </div>
        </div>

      </div>
    </section>
  );
}
