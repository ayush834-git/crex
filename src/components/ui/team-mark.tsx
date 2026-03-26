"use client";

import Image from "next/image";
import { useState } from "react";
import { getTeamByAbbr, normalizeTeamAbbr } from "@/lib/constants/teams";
import { cn } from "@/utils/cn";

interface TeamMarkProps {
  abbr: string;
  logo?: string;
  className?: string;
}

export function TeamMark({ abbr, logo, className }: TeamMarkProps) {
  const [hasError, setHasError] = useState(false);
  const team = getTeamByAbbr(abbr);
  const label = normalizeTeamAbbr(abbr);
  const usableLogo = logo || team?.logo;

  return (
    <div
      className={cn("relative flex h-12 w-12 items-center justify-center overflow-hidden rounded-2xl border border-crex-border", className)}
      style={{
        background: `linear-gradient(135deg, ${team?.primaryColor ?? "var(--crex-accent)"}, ${team?.accentColor ?? "#ffffff"})`,
      }}
    >
      {usableLogo && !hasError ? (
        <Image src={usableLogo} alt={label} fill sizes="48px" className="object-cover" onError={() => setHasError(true)} />
      ) : (
        <span className="font-display text-lg tracking-wide text-white">{label}</span>
      )}
    </div>
  );
}
