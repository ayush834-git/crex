"use client";

import { useRef } from "react";
import { Brain, Target, Activity, Zap, TrendingUp, Shield } from "lucide-react";
import { motion, Variants } from "framer-motion";

const FEATURES = [
  {
    title: "PREDICTIVE ENGINE",
    desc: "Real-time win probability and deep learning models tracking ball-by-ball momentum shifts.",
    icon: Brain,
    bgClass: "bg-sun",
    textClass: "text-royal",
    borderClass: "border-royal",
    iconColor: "text-crimson",
    barClass: "bg-crimson",
    rotation: -2,
  },
  {
    title: "PLAYER MATCHUPS",
    desc: "Historical performance filtering. See exactly how Bumrah bowls to Kohli in the death overs.",
    icon: Target,
    bgClass: "bg-royal",
    textClass: "text-white",
    borderClass: "border-ink",
    iconColor: "text-sun",
    barClass: "bg-sun",
    rotation: 2,
  },
  {
    title: "LIVE TELEMETRY",
    desc: "Pitch maps, wagon wheels, and ball tracking velocity updated instantly.",
    icon: Activity,
    bgClass: "bg-crimson",
    textClass: "text-white",
    borderClass: "border-ink",
    iconColor: "text-sun",
    barClass: "bg-sun",
    rotation: -1.5,
  },
  {
    title: "MOMENTUM TRACKER",
    desc: "Graphical visualizer indicating which team has the upper hand minute by minute.",
    icon: Zap,
    bgClass: "bg-violet",
    textClass: "text-white",
    borderClass: "border-ink",
    iconColor: "text-sky",
    barClass: "bg-sky",
    rotation: 1.5,
  },
  {
    title: "FANTASY INSIGHTS",
    desc: "Data-backed player recommendations based on venue stats and current form.",
    icon: TrendingUp,
    bgClass: "bg-sky",
    textClass: "text-ink",
    borderClass: "border-royal",
    iconColor: "text-crimson",
    barClass: "bg-crimson",
    rotation: -2,
  },
  {
    title: "IMPACT PLAYER ALERTS",
    desc: "Strategic substitution analysis predicting the optimal moment to use the Impact Rule.",
    icon: Shield,
    bgClass: "bg-sun",
    textClass: "text-royal",
    borderClass: "border-violet",
    iconColor: "text-violet",
    barClass: "bg-violet",
    rotation: 2,
  },
];

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1, // 100ms stagger
      delayChildren: 0.2,
    },
  },
};

const cardVariants: Variants = {
  hidden: { y: 200, opacity: 0 },
  visible: { 
    y: 0, 
    opacity: 1, 
    transition: { type: "spring", bounce: 0.5, damping: 12, stiffness: 100 }
  },
};

export function Features() {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <section ref={containerRef} className="py-24 md:py-32 bg-white relative z-10 px-6 md:px-12">
      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Section Title */}
        <div className="mb-16 md:mb-24 flex justify-start overflow-hidden">
          <motion.h2
            initial={{ y: 150, rotate: 5, opacity: 0 }}
            whileInView={{ y: 0, rotate: 0, opacity: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ type: "spring", bounce: 0.4, damping: 14 }}
            className="text-royal font-black uppercase flex items-end tracking-tighter leading-[0.8] drop-shadow-[4px_4px_0_#FFE500]"
            style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: "clamp(80px, 12vw, 120px)" }}
          >
            WHAT CREX DOES<span className="text-crimson">.</span>
          </motion.h2>
        </div>

        {/* 6 Feature Cards Grid */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
        >
          {FEATURES.map((feature) => (
            <motion.div
              key={feature.title}
              variants={cardVariants}
              whileHover={{ 
                y: -8, 
                rotate: feature.rotation, 
                borderWidth: "12px",
                transition: { type: "spring", stiffness: 400, damping: 15 }
              }}
              className={`relative overflow-hidden p-8 flex flex-col items-start border-[8px] transition-colors ${feature.bgClass} ${feature.borderClass}`}
              style={{ minHeight: "320px" }}
            >
              <div className="relative z-10 flex flex-col h-full w-full">
                
                {/* Colored Icon */}
                <div className="mb-8">
                  <feature.icon size={48} strokeWidth={3} className={feature.iconColor} />
                </div>
                
                {/* Title */}
                <h3 
                  className={`text-[32px] font-bold uppercase tracking-wide mb-3 leading-none ${feature.textClass}`}
                  style={{ fontFamily: "'Bebas Neue', sans-serif" }}
                >
                  {feature.title}
                </h3>
                
                {/* Body */}
                <p className={`text-base font-bold leading-relaxed mb-6 flex-grow ${feature.textClass} opacity-95`} style={{ fontFamily: "'DM Sans', sans-serif" }}>
                  {feature.desc}
                </p>
                
              </div>
              
              {/* Bottom colored bar */}
              <div className={`absolute bottom-0 left-0 w-full h-[6px] ${feature.barClass}`} />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
