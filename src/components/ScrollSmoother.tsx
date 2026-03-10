"use client";

import { useEffect, useRef } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function ScrollSmoother({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<InstanceType<typeof Lenis> | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    // Only initialize smooth scroll on desktop (avoid mobile issues with pinned sections sometimes)
    if (window.innerWidth < 768) return;

    gsap.registerPlugin(ScrollTrigger);

    lenisRef.current = new Lenis({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // standard easing
      smoothWheel: true,
      touchMultiplier: 2,
    });

    const onScroll = () => ScrollTrigger.update();
    lenisRef.current.on('scroll', onScroll);

    // Synchronize Lenis with GSAP ScrollTrigger
    const rafCallback = (time: number) => {
      lenisRef.current?.raf(time * 1000);
    };

    gsap.ticker.add(rafCallback);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(rafCallback);
      lenisRef.current?.destroy();
    };
  }, []);

  return <>{children}</>;
}
