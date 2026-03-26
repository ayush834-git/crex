"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useEffect, useState } from "react";
import { motion, type Variants } from "framer-motion";
import { useMatches } from "@/hooks/useMatches";

const crexTransition = { duration: 0.4, ease: [0.16, 1, 0.3, 1] as const };

const container: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: crexTransition },
};

const WarpBackground = dynamic(() => import("@/components/ui/warp-background").then((mod) => mod.WarpBackground), {
  ssr: false,
});

const names = ["Rohit Sharma", "Virat Kohli", "MS Dhoni", "Jasprit Bumrah", "KL Rahul"];

export function HeroSection() {
  const [index, setIndex] = useState(0);
  const { matches } = useMatches("live", 6);

  useEffect(() => {
    const timer = window.setInterval(() => setIndex((value) => (value + 1) % names.length), 2400);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <section className="relative min-h-[100svh] overflow-hidden">
      <WarpBackground className="opacity-90" />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.4),rgba(255,247,243,0.95))]" />
      <motion.div
        className="crex-container relative z-10 flex min-h-[100svh] flex-col justify-center py-20"
        variants={container}
        initial="hidden"
        animate="visible"
      >
        <div className="max-w-4xl">
          <motion.span variants={fadeUp} className="crex-pill border-crex-accent/20 bg-white/90 text-crex-accent">{matches.length} live match{matches.length === 1 ? "" : "es"} tracked</motion.span>
          <motion.h1 variants={fadeUp} className="mt-8 font-display text-[52px] uppercase leading-none text-crex-text md:text-[96px]">
            Feel every <span className="text-crex-accent">{names[index]}</span> moment
          </motion.h1>
          <motion.p variants={fadeUp} className="mt-6 max-w-2xl text-lg leading-8 text-crex-muted md:text-xl">
            The most intelligent IPL platform. Live scores, predictive analytics, and fantasy insights built for match night clarity.
          </motion.p>
          <motion.div variants={fadeUp} className="mt-8 flex flex-col gap-4 sm:flex-row">
            <Link href="/matches" className="tap-target rounded-2xl bg-crex-accent px-6 py-4 text-center font-semibold text-white">
              Watch Live
            </Link>
            <Link href="/players" className="tap-target rounded-2xl border border-crex-accent px-6 py-4 text-center font-semibold text-crex-accent">
              Explore Players
            </Link>
          </motion.div>
          <motion.div variants={fadeUp} className="mt-10 flex flex-wrap gap-3">
            {["10 Teams", "74 Matches", "Live Analytics"].map((item) => (
              <span key={item} className="crex-pill bg-white/90">{item}</span>
            ))}
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
