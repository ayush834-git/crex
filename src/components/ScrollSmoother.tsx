"use client";

import { useEffect, useRef } from "react";
import Lenis from "@studio-freight/lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function ScrollSmoother({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    // Only initialize smooth scroll on desktop (avoid mobile issues with pinned sections sometimes)
    if (window.innerWidth < 768) return;

    lenisRef.current = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // standard easing
      smoothWheel: true,
      touchMultiplier: 2,
    });

    lenisRef.current.on('scroll', ScrollTrigger.update);

    // Synchronize Lenis with GSAP ScrollTrigger
    gsap.ticker.add((time) => {
      lenisRef.current?.raf(time * 1000);
    });

    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove((time) => lenisRef.current?.raf(time * 1000));
      lenisRef.current?.destroy();
    };
  }, []);

  return <>{children}</>;
}
