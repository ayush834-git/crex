"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import confetti from "canvas-confetti";
import { motion } from "framer-motion";

const QUESTIONS = [
  { q: "Who is IPL's all-time leading run-scorer?", opts: ["Rohit Sharma", "Virat Kohli", "Suresh Raina", "David Warner"], answer: 1 },
  { q: "Which team has won the most IPL titles?", opts: ["CSK", "MI", "KKR", "RCB"], answer: 1 },
  { q: "Who has the most IPL wickets all-time?", opts: ["Bumrah", "Malinga", "Yuzvendra Chahal", "Rashid Khan"], answer: 2 },
  { q: "What is the highest individual IPL score?", opts: ["158*", "175*", "167*", "172*"], answer: 1 },
  { q: "Who scored 175* in IPL 2013?", opts: ["AB de Villiers", "Chris Gayle", "Brendon McCullum", "David Warner"], answer: 1 },
  { q: "Which player won 3 Orange Caps?", opts: ["Kohli", "Rohit", "David Warner", "Buttler"], answer: 2 },
  { q: "What does the Impact Player rule allow?", opts: ["2 extra overs", "An extra substitute player", "DRS review", "Power play extension"], answer: 1 },
  { q: "How many centuries did Buttler score in IPL 2022?", opts: ["2", "3", "4", "5"], answer: 2 },
  { q: "Who captained KKR to back-to-back titles in 2012 and 2014?", opts: ["Dhoni", "Gambhir", "Dravid", "Sehwag"], answer: 1 },
  { q: "Which team did Hardik Pandya captain to their first IPL title?", opts: ["MI", "RCB", "GT", "SRH"], answer: 2 },
  { q: "Rashid Khan's IPL economy rate is approximately?", opts: ["7.8", "7.1", "6.8", "6.77"], answer: 3 },
  { q: "Which IPL season was played entirely in South Africa?", opts: ["2008", "2009", "2010", "2014"], answer: 1 },
  { q: "Who hit the first century in IPL history?", opts: ["Sehwag", "McCullum", "Gayle", "Hayden"], answer: 1 },
  { q: "How many runs did Kohli score in IPL 2016?", opts: ["723", "800", "873", "919"], answer: 2 },
  { q: "Which player is known as 'Mr. IPL'?", opts: ["Rohit Sharma", "MS Dhoni", "Suresh Raina", "Virat Kohli"], answer: 2 },
];

const OPTION_STYLES = [
  { bg: "#1A1AE6", text: "#FFFFFF", dark: false },
  { bg: "#9B5DE5", text: "#FFFFFF", dark: false },
  { bg: "#00C9A7", text: "#080C18", dark: true },
  { bg: "#FF9F1C", text: "#080C18", dark: true },
];

const TIERS = [
  { min: 130, label: "CRICKET GENIUS 🏆", color: "#F5C518" },
  { min: 90, label: "REAL FAN 🔥", color: "#E63946" },
  { min: 50, label: "CASUAL VIEWER 👀", color: "#00C9A7" },
  { min: 0, label: "JUST STARTED 🏏", color: "#FFFFFF" },
];

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function Trivia() {
  const [questions, setQuestions] = useState(QUESTIONS);
  const [currentQ, setCurrentQ] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [timeLeft, setTimeLeft] = useState(15);
  const [gameOver, setGameOver] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const question = questions[currentQ];

  const advance = useCallback(() => {
    if (currentQ >= questions.length - 1) {
      setGameOver(true);
    } else {
      setCurrentQ(prev => prev + 1);
      setSelected(null);
      setTimeLeft(15);
    }
  }, [currentQ, questions.length]);

  useEffect(() => {
    if (gameOver || selected !== null) return;
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          setTimeout(() => advance(), 500);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [currentQ, selected, gameOver, advance]);

  const handleSelect = (idx: number) => {
    if (selected !== null || gameOver) return;
    setSelected(idx);
    if (timerRef.current) clearInterval(timerRef.current);
    if (idx === question.answer) {
      setScore(prev => prev + 10);
      confetti({ particleCount: 80, spread: 60, origin: { y: 0.7 }, colors: ["#F5C518", "#1A1AE6", "#00C9A7", "#9B5DE5"], zIndex: 100 });
    }
    setTimeout(() => advance(), 1200);
  };

  const restart = () => {
    setQuestions(shuffle(QUESTIONS));
    setCurrentQ(0);
    setScore(0);
    setSelected(null);
    setTimeLeft(15);
    setGameOver(false);
  };

  const tier = TIERS.find(t => score >= t.min) || TIERS[TIERS.length - 1];

  if (gameOver) {
    return (
      <section className="py-24 md:py-32 w-full min-h-[90vh] flex items-center relative overflow-hidden" style={{ background: "#E63946" }}>
        <div className="max-w-[600px] mx-auto px-6 text-center z-10 relative">
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", bounce: 0.5 }}>
            <h2 className="font-black uppercase leading-[0.85] text-[#1A1AE6] mb-4"
              style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: "clamp(60px,12vw,100px)" }}>
              {score}<span style={{ color: "#F5C518" }}>/{questions.length * 10}</span>
            </h2>
            <p className="text-3xl font-black uppercase tracking-wider mb-2" style={{ fontFamily: "'Barlow Condensed', sans-serif", color: tier.color }}>
              {tier.label}
            </p>
            <p className="text-base mb-12 font-bold" style={{ fontFamily: "Inter, sans-serif", color: "white" }}>
              You got {score / 10} out of {questions.length} questions correct
            </p>
            <button onClick={restart}
              className="px-8 py-4 font-black text-lg uppercase tracking-widest rounded-sm cursor-pointer hover:bg-white transition-all shadow-[4px_4px_0_rgba(26,26,230,0.5)]"
              style={{ background: "#F5C518", color: "#1A1AE6", fontFamily: "'Barlow Condensed', sans-serif", border: "4px solid #1A1AE6" }}>
              PLAY AGAIN
            </button>
          </motion.div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-24 md:py-32 w-full min-h-[90vh] flex items-center relative overflow-hidden" style={{ background: "#E63946" }}>
      <div className="max-w-[1440px] mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-8 items-center w-full z-10 relative">
        
        {/* Left — Title */}
        <div className="flex flex-col items-start uppercase leading-[0.8] tracking-tighter" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
          <motion.div initial={{ x: -100, opacity: 0 }} whileInView={{ x: 0, opacity: 1 }} transition={{ delay: 0.1, type: "spring", stiffness: 100 }}>
             <span className="text-white" style={{ fontSize: "clamp(100px, 14vw, 160px)", textShadow: "6px 6px 0 #080C18" }}>TEST</span>
          </motion.div>
          <motion.div initial={{ x: 100, opacity: 0 }} whileInView={{ x: 0, opacity: 1 }} transition={{ delay: 0.2, type: "spring", stiffness: 100 }}>
             <span style={{ fontSize: "clamp(100px, 14vw, 160px)", color: "#F5C518", textShadow: "6px 6px 0 #1A1AE6" }}>YOUR</span>
          </motion.div>
          <motion.div initial={{ x: -100, opacity: 0 }} whileInView={{ x: 0, opacity: 1 }} transition={{ delay: 0.3, type: "spring", stiffness: 100 }}>
             <span className="text-white" style={{ fontSize: "clamp(60px, 8vw, 100px)", textShadow: "6px 6px 0 #080C18" }}>CRICKET</span>
          </motion.div>
          <motion.div initial={{ y: 100, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }} transition={{ delay: 0.4, type: "spring", stiffness: 100 }}>
             <span style={{ fontSize: "clamp(100px, 14vw, 160px)", color: "#F5C518", textShadow: "6px 6px 0 #1A1AE6" }}>
                 IQ<span style={{ color: "#9B5DE5" }}>.</span>
             </span>
          </motion.div>
        </div>

        {/* Right — Interactive Card */}
        <div className="flex justify-center lg:justify-end w-full">
           <div className="w-full max-w-[500px] p-8 pt-10 relative bg-[#F5C518] shadow-[8px_8px_0_rgba(26,26,230,0.4)]"
             style={{ border: "4px solid #1A1AE6" }}>
              
              {/* Header */}
              <div className="flex justify-between items-center mb-6">
                <span className="text-[#1A1AE6] text-sm font-black uppercase tracking-widest" style={{ fontFamily: "Inter, sans-serif" }}>
                  Q{currentQ + 1} / {questions.length}
                </span>
                <div>
                  <span className="text-[#080C18] text-sm font-bold mr-2" style={{ fontFamily: "Inter, sans-serif" }}>SCORE:</span>
                  <span className="text-2xl font-black" style={{ fontFamily: "'JetBrains Mono', monospace", color: "#1A1AE6" }}>{score}</span>
                </div>
              </div>

              {/* Timer bar */}
              <div className="w-full h-2 mb-6 overflow-hidden bg-[rgba(26,26,230,0.2)]">
                <motion.div className="h-full bg-[#1A1AE6]"
                  key={currentQ}
                  initial={{ width: "100%" }}
                  animate={{ width: "0%" }}
                  transition={{ duration: 15, ease: "linear" }}
                />
              </div>

              {/* Question */}
              <h3 className="font-black text-2xl leading-tight mb-8" style={{ fontFamily: "'Barlow Condensed', sans-serif", color: "#1A1AE6", textTransform: "uppercase" }}>
                {question.q}
              </h3>

              {/* Options — vivid colored cards */}
              <div className="space-y-3">
                {question.opts.map((opt, idx) => {
                  const style = OPTION_STYLES[idx];
                  let bg = style.bg;
                  let text = style.text;
                  let border = "transparent";
                  let badgeContent = String.fromCharCode(65 + idx);
                  let badgeBg = "#FFFFFF";
                  let badgeText = style.bg;
                  const scale = 1;

                  if (selected !== null) {
                    if (idx === question.answer) {
                      bg = "#00C9A7"; text = "#080C18"; border = "#F5C518";
                      badgeContent = "✓"; badgeBg = "#F5C518"; badgeText = "#080C18";
                    } else if (idx === selected) {
                      bg = "#E63946"; text = "#FFFFFF"; border = "#FFFFFF";
                      badgeContent = "✗"; badgeBg = "#FFFFFF"; badgeText = "#E63946";
                    } else {
                      bg = `${style.bg}55`; text = `${style.text}66`; border = "transparent";
                      badgeBg = `${style.text}33`; badgeText = `${style.text}66`;
                    }
                  }

                  return (
                    <motion.button
                      key={idx}
                      onClick={() => handleSelect(idx)}
                      disabled={selected !== null}
                      whileHover={selected === null ? { scale: 1.02, filter: "brightness(1.15)", borderColor: "#F5C518" } : {}}
                      className="w-full flex items-center p-4 rounded-lg font-bold text-base transition-all cursor-pointer disabled:cursor-default"
                      style={{
                        background: bg,
                        color: text,
                        borderBottomWidth: "3px",
                        borderTopWidth: "3px",
                        borderLeftWidth: "3px",
                        borderRightWidth: "3px",
                        borderStyle: "solid",
                        borderColor: border,
                        fontFamily: "Inter, sans-serif",
                        transform: `scale(${scale})`,
                      }}
                    >
                      <span className="font-black w-8 h-8 flex items-center justify-center mr-3 text-base shrink-0 rounded-md"
                        style={{ background: badgeBg, color: badgeText, fontFamily: "'Barlow Condensed', sans-serif", fontSize: "18px" }}>
                        {badgeContent}
                      </span>
                      <span className="text-left font-bold">{opt}</span>
                    </motion.button>
                  );
                })}
              </div>

              {/* Timer text */}
              <div className="mt-6 text-center">
                <span className="text-sm font-bold" style={{ fontFamily: "'JetBrains Mono', monospace", color: "#1A1AE6" }}>
                  {timeLeft > 0 ? `${timeLeft}s remaining` : "Time's up!"}
                </span>
              </div>
           </div>
        </div>
      </div>
    </section>
  );
}
