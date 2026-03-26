"use client";

import { useEffect, useState } from "react";

interface NumberTickerProps {
  value: number | string;
  className?: string;
}

export function NumberTicker({ value, className }: NumberTickerProps) {
  const target = typeof value === "number" ? value : Number(value);
  const [display, setDisplay] = useState(Number.isFinite(target) ? 0 : value);

  useEffect(() => {
    if (!Number.isFinite(target)) {
      setDisplay(value);
      return;
    }

    let frame = 0;
    const duration = 500;
    const start = performance.now();

    const tick = (now: number) => {
      const progress = Math.min(1, (now - start) / duration);
      setDisplay(Math.round(target * progress));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [target, value]);

  return <span className={className}>{display}</span>;
}
