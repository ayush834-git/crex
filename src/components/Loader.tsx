"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { cn } from "@/utils/cn";

interface LoaderProps {
  onComplete: () => void;
}

export function Loader({ onComplete }: LoaderProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    if (!containerRef.current || !svgRef.current || !textRef.current || !progressRef.current) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        onComplete: () => {
          setIsComplete(true);
          // Wait briefly for the fade-out to finish before unmounting
          setTimeout(onComplete, 400); 
        },
      });

      // 1. Draw SVG paths
      const paths = svgRef.current?.querySelectorAll("path");
      if (paths) {
        gsap.set(paths, { strokeDasharray: 1000, strokeDashoffset: 1000 });
        tl.to(paths, {
          strokeDashoffset: 0,
          duration: 1.2,
          ease: "power2.inOut",
          stagger: 0.1,
        });
      }

      // 2. Text Reveal Stagger (CREX)
      const letters = textRef.current?.querySelectorAll("span");
      if (letters) {
        tl.fromTo(
          letters,
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.4, stagger: 0.08, ease: "back.out(1.7)" },
          "-=0.6" // start slightly before SVG finishes
        );
      }

      // 3. Progress bar filling left to right
      tl.to(
        progressRef.current,
        { scaleX: 1, duration: 1.6, ease: "power2.inOut" },
        0 // Start at the very beginning
      );

      // 4. Fade and scale up container
      tl.to(
        containerRef.current,
        { scale: 1.1, opacity: 0, duration: 0.4, ease: "power2.in" },
        "-=0.1"
      );
    }, containerRef);

    return () => ctx.revert();
  }, [onComplete]);

  if (isComplete) return null;

  return (
    <div
      ref={containerRef}
      className={cn(
        "fixed inset-0 z-50 flex flex-col items-center justify-center bg-void text-white",
        "pointer-events-none" // prevent interaction during load
      )}
    >
      <div className="relative flex flex-col items-center justify-center gap-6">
        {/* Cricket Ball SVG - simplified geometric representation */}
        <svg
          ref={svgRef}
          width="80"
          height="80"
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="stroke-cyan stroke-2"
        >
          {/* Main sphere */}
          <path d="M50 95C74.8528 95 95 74.8528 95 50C95 25.1472 74.8528 5 50 5C25.1472 5 5 25.1472 5 50C5 74.8528 25.1472 95 50 95Z" />
          {/* Seam lines */}
          <path d="M30 10C30 10 50 50 30 90" className="stroke-gold stroke-2" />
          <path d="M40 5C40 5 60 50 40 95" className="stroke-gold stroke-2" />
          {/* Subtle stitches */}
          <path d="M35 50L45 50" />
          <path d="M33 30L42 33" />
          <path d="M33 70L42 67" />
        </svg>

        {/* Text Reveal */}
        <div
          ref={textRef}
          className="flex overflow-hidden text-4xl font-black tracking-widest text-white"
          style={{ fontFamily: "var(--font-druck, 'Barlow Condensed', sans-serif)" }}
        >
          {["C", "R", "E", "X"].map((letter, i) => (
            <span key={i} className="inline-block transform">
              {letter}
            </span>
          ))}
        </div>

        {/* Progress bar container */}
        <div className="h-[2px] w-48 overflow-hidden rounded-full bg-navy mt-4">
          <div
            ref={progressRef}
            className="h-full w-full origin-left bg-gold scale-x-0"
          />
        </div>
      </div>
    </div>
  );
}
