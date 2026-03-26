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
    <div className={cn("inline-flex rounded-2xl border border-crex-border bg-white p-1 shadow-crex", className)}>
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => onChange(tab)}
          className={cn(
            "relative tap-target rounded-2xl px-5 py-2.5 text-sm font-semibold uppercase tracking-[0.18em]",
            active === tab ? "text-white" : "text-crex-muted"
          )}
        >
          {active === tab ? (
            <motion.span
              layoutId="match-tab"
              className="absolute inset-0 rounded-2xl bg-crex-accent"
              transition={{ duration: 0.3 }}
            />
          ) : null}
          <span className="relative z-10">{tab}</span>
        </button>
      ))}
    </div>
  );
}
