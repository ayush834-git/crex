"use client";

import { useRef, useState } from "react";
import { Brain, Target, Activity, Zap, TrendingUp, Shield } from "lucide-react";
import { motion, Variants } from "framer-motion";
import { FeatureModal } from "@/components/modals/FeatureModal";
import { PredictiveEngineDemo } from "@/components/modals/PredictiveEngineDemo";
import { PlayerMatchupsDemo } from "@/components/modals/PlayerMatchupsDemo";
import { LiveTelemetryDemo } from "@/components/modals/LiveTelemetryDemo";
import { MomentumTrackerDemo } from "@/components/modals/MomentumTrackerDemo";
import { FantasyInsightsDemo } from "@/components/modals/FantasyInsightsDemo";
import { ImpactPlayerDemo } from "@/components/modals/ImpactPlayerDemo";

const FEATURES = [
  {
    title: "PREDICTIVE ENGINE",
    desc: "Real-time win probability and deep learning models tracking ball-by-ball momentum shifts.",
    icon: Brain,
    bg: "#1A1AE6", iconColor: "#F5C518", text: "#FFFFFF", tryColor: "#F5C518",
    rotation: -2,
    modalTitle: "PREDICTIVE ENGINE",
    Demo: PredictiveEngineDemo,
  },
  {
    title: "PLAYER MATCHUPS",
    desc: "Historical performance filtering. See exactly how Bumrah bowls to Kohli in the death overs.",
    icon: Target,
    bg: "#E63946", iconColor: "#F5C518", text: "#FFFFFF", tryColor: "#F5C518",
    rotation: 2,
    modalTitle: "PLAYER MATCHUPS",
    Demo: PlayerMatchupsDemo,
  },
  {
    title: "LIVE TELEMETRY",
    desc: "Pitch maps, wagon wheels, and ball tracking velocity updated instantly.",
    icon: Activity,
    bg: "#9B5DE5", iconColor: "#F5C518", text: "#FFFFFF", tryColor: "#F5C518",
    rotation: -1.5,
    modalTitle: "LIVE TELEMETRY",
    Demo: LiveTelemetryDemo,
  },
  {
    title: "MOMENTUM TRACKER",
    desc: "Graphical visualizer indicating which team has the upper hand minute by minute.",
    icon: Zap,
    bg: "#00C9A7", iconColor: "#080C18", text: "#080C18", tryColor: "#1A1AE6",
    rotation: 1.5,
    modalTitle: "MOMENTUM TRACKER",
    Demo: MomentumTrackerDemo,
  },
  {
    title: "FANTASY INSIGHTS",
    desc: "Data-backed player recommendations based on venue stats and current form.",
    icon: TrendingUp,
    bg: "#FF9F1C", iconColor: "#080C18", text: "#080C18", tryColor: "#1A1AE6",
    rotation: -2,
    modalTitle: "FANTASY INSIGHTS",
    Demo: FantasyInsightsDemo,
  },
  {
    title: "IMPACT PLAYER ALERTS",
    desc: "Strategic substitution analysis predicting the optimal moment to use the Impact Rule.",
    icon: Shield,
    bg: "#F5C518", iconColor: "#1A1AE6", text: "#080C18", tryColor: "#E63946",
    rotation: 2,
    modalTitle: "IMPACT PLAYER ALERTS",
    Demo: ImpactPlayerDemo,
  },
];

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 },
  },
};

const cardVariants: Variants = {
  hidden: { y: 200, opacity: 0 },
  visible: { 
    y: 0, opacity: 1, 
    transition: { type: "spring", bounce: 0.5, damping: 12, stiffness: 100 }
  },
};

export function Features() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [openModal, setOpenModal] = useState<number | null>(null);

  return (
    <section ref={containerRef} className="py-24 md:py-32 relative z-10 px-6 md:px-12" style={{ background: "#E63946", borderBottom: "4px solid #1A1AE6" }}>
      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Section Title */}
        <div className="mb-16 md:mb-24 flex justify-start overflow-hidden">
          <motion.h2
            initial={{ y: 150, rotate: 5, opacity: 0 }}
            whileInView={{ y: 0, rotate: 0, opacity: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ type: "spring", bounce: 0.4, damping: 14 }}
            className="font-black uppercase flex items-end tracking-tighter leading-[0.8]"
            style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: "clamp(80px, 12vw, 120px)", color: "#F5C518", textShadow: "4px 4px 0 #1A1AE6" }}
          >
            WHAT CREX DOES<span style={{ color: "#1A1AE6" }}>.</span>
          </motion.h2>
        </div>

        {/* 6 Feature Cards Grid — vivid colored, brutalist */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
        >
          {FEATURES.map((feature, idx) => (
            <motion.div
              key={feature.title}
              variants={cardVariants}
              whileHover={{ 
                y: -8, rotate: feature.rotation,
                transition: { type: "spring", stiffness: 400, damping: 15 }
              }}
              className="relative overflow-hidden p-8 flex flex-col items-start"
              style={{
                minHeight: "320px",
                background: feature.bg,
                border: "4px solid #080C18",
                boxShadow: "5px 5px 0 #080C18",
              }}
            >
              <div className="relative z-10 flex flex-col h-full w-full">
                <div className="mb-8">
                  <feature.icon size={48} strokeWidth={3} color={feature.iconColor} />
                </div>
                <h3 className="text-[32px] font-black uppercase tracking-wide mb-3 leading-none"
                  style={{ fontFamily: "'Barlow Condensed', sans-serif", color: feature.text }}>
                  {feature.title}
                </h3>
                <p className="text-base font-bold leading-relaxed mb-6 flex-grow"
                  style={{ fontFamily: "Inter, sans-serif", color: feature.text, opacity: 0.9 }}>
                  {feature.desc}
                </p>
                <button
                  onClick={() => setOpenModal(idx)}
                  className="text-sm font-black uppercase tracking-widest flex items-center gap-2 hover:gap-4 transition-all cursor-pointer"
                  style={{ fontFamily: "Inter, sans-serif", color: feature.tryColor }}
                >
                  TRY IT <span className="text-lg">→</span>
                </button>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Modals */}
      {FEATURES.map((feature, idx) => (
        <FeatureModal
          key={feature.title}
          open={openModal === idx}
          onClose={() => setOpenModal(null)}
          title={feature.modalTitle}
        >
          <feature.Demo />
        </FeatureModal>
      ))}
    </section>
  );
}
