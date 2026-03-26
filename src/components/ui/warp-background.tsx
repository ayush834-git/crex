"use client";

import { useEffect, useState } from "react";
import { cn } from "@/utils/cn";

export function WarpBackground({ className }: { className?: string }) {
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(media.matches);
    const listener = () => setReducedMotion(media.matches);
    media.addEventListener("change", listener);
    return () => media.removeEventListener("change", listener);
  }, []);

  return (
    <div className={cn("absolute inset-0 overflow-hidden", className)} aria-hidden="true">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,107,53,0.28),transparent_32%),radial-gradient(circle_at_80%_15%,rgba(217,37,29,0.28),transparent_30%),radial-gradient(circle_at_50%_80%,rgba(0,120,188,0.18),transparent_35%)]" />
      <div
        className={cn(
          "absolute inset-[-20%] bg-[conic-gradient(from_120deg,rgba(255,107,53,0.18),rgba(217,37,29,0.12),rgba(0,120,188,0.12),rgba(255,107,53,0.18))] blur-3xl",
          reducedMotion ? "" : "animate-[spin_22s_linear_infinite]"
        )}
      />
    </div>
  );
}
