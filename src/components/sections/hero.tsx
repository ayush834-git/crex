"use client";

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

const playerNames = ["Rohit Sharma", "Virat Kohli", "Jasprit Bumrah", "MS Dhoni", "KL Rahul"];

const featurePosters = [
  {
    title: "Predictive Engine",
    copy: "Win probability and momentum reads built to move with the innings.",
    href: "/analytics",
    style: "bg-[linear-gradient(135deg,#1d4ed8,#6d28d9)] text-white",
  },
  {
    title: "Player Matchups",
    copy: "Surface exactly how a batter and bowler have attacked each other over time.",
    href: "/analytics",
    style: "bg-[linear-gradient(135deg,#be185d,#ea580c)] text-white",
  },
  {
    title: "Live Telemetry",
    copy: "Shot maps, pressure pockets, and ball-by-ball signals in a single canvas.",
    href: "/matches",
    style: "bg-[linear-gradient(135deg,#6d28d9,#be185d)] text-white",
  },
  {
    title: "Fantasy Edge",
    copy: "Use venue, form, and role context before the contest locks.",
    href: "/players",
    style: "bg-[linear-gradient(135deg,#eab308,#ea580c)] text-[#25124d]",
  },
];

export function HeroSection() {
  const { matches } = useMatches("live", 4);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => setIndex((value) => (value + 1) % playerNames.length), 2200);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <section className="gradient-hero crex-stage relative overflow-hidden border-b border-white/18">
      <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_0,transparent_46%,rgba(250,204,21,0.12)_46%,rgba(250,204,21,0.12)_52%,transparent_52%,transparent_100%)] opacity-80" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.12),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(29,78,216,0.18),transparent_28%)]" />
      <motion.div
        className="crex-container relative z-10 grid min-h-[calc(100svh-88px)] gap-10 py-14 lg:grid-cols-[1.05fr_0.95fr] lg:items-end lg:py-20"
        variants={container}
        initial="hidden"
        animate="visible"
      >
        <div className="max-w-4xl">
          <motion.span variants={fadeUp} className="crex-pill">
            {matches.length} live matches on deck
          </motion.span>
          <motion.h1 variants={fadeUp} className="mt-8 font-poster text-[5.1rem] uppercase leading-[0.78] text-white md:text-[8.5rem] lg:text-[10rem]">
            <span className="block crex-title-shadow">Every</span>
            <span className="block text-crex-surface crex-blue-shadow">Delivery.</span>
            <span className="block crex-title-shadow">Every</span>
            <span className="block text-crex-surface crex-blue-shadow">Swing.</span>
          </motion.h1>
          <motion.p variants={fadeUp} className="mt-6 max-w-2xl text-2xl uppercase leading-7 text-white md:text-3xl">
            CREX tracks live score shifts, player battles, and fantasy edges without slipping into generic sports UI.
          </motion.p>
          <motion.p variants={fadeUp} className="mt-4 font-display text-3xl uppercase tracking-[0.08em] text-crex-surface">
            Tonight&apos;s focus: <span className="text-white">{playerNames[index]}</span>
          </motion.p>
          <motion.div variants={fadeUp} className="mt-8 flex flex-col gap-4 sm:flex-row">
            <Link href="/matches?tab=live" className="crex-button text-2xl">
              Watch Live
            </Link>
            <Link href="/players" className="crex-button crex-button-secondary text-2xl">
              Explore Players
            </Link>
          </motion.div>
        </div>

        <motion.div variants={fadeUp} className="grid gap-5 sm:grid-cols-2">
          {featurePosters.map((item) => (
            <Link
              key={item.title}
              href={item.href}
              className={`rounded-2xl border border-white/18 p-6 shadow-[0_20px_36px_rgba(91,33,182,0.22)] transition-all duration-200 hover:-translate-y-2 hover:scale-[1.01] ${item.style}`}
            >
              <p className="font-display text-4xl uppercase leading-none tracking-[0.08em]">{item.title}</p>
              <p className="mt-4 text-xl uppercase leading-6 opacity-90">{item.copy}</p>
              <span className="mt-8 inline-flex font-display text-2xl uppercase tracking-[0.08em]">Try It -&gt;</span>
            </Link>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}
