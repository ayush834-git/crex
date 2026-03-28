"use client";

import { motion } from "framer-motion";
import { cn } from "@/utils/cn";

interface MatchTabsProps {
  active: string;
  onChange: (value: string) => void;
  className?: string;
}

const tabs = ["live", "recent", "upcoming"];

export function MatchTabs({ active, onChange, className }: MatchTabsProps) {
  return (
    <div className={cn("inline-flex rounded-2xl border border-white/18 bg-white/12 p-1 shadow-[0_18px_32px_rgba(91,33,182,0.16)] backdrop-blur-sm", className)}>
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => onChange(tab)}
          className={cn(
            "relative tap-target rounded-xl px-5 py-2.5 font-display text-2xl uppercase tracking-[0.08em]",
            active === tab ? "text-white" : "text-white/78"
          )}
        >
          {active === tab ? (
            <motion.span
              layoutId="match-tab"
              className="absolute inset-0 rounded-xl bg-[linear-gradient(135deg,#1d4ed8,#6d28d9)]"
              transition={{ duration: 0.3 }}
            />
          ) : null}
          <span className="relative z-10">{tab}</span>
        </button>
      ))}
    </div>
  );
}
