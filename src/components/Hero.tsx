"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Canvas } from "@react-three/fiber";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Search } from "lucide-react";
import { cn } from "@/utils/cn";
import { CricketBallSeam } from "./CricketBallSeam";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const STATS = [
  { label: "PLAYERS", value: 342, prefix: "" },
  { label: "MATCHES", value: 1084, prefix: "" },
  { label: "DATA POINTS", value: 2.1, prefix: "", suffix: "M" },
  { label: "PREDICTIONS", value: 98, prefix: "", suffix: "%" },
];

const TYPEWRITER_TEXTS = [
  "Deep learning predictions",
  "Ball-by-ball analysis",
  "Player matchups",
  "Pitch conditions",
];

export function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const textContentRef = useRef<HTMLDivElement>(null);
  const imageContainerRef = useRef<HTMLDivElement>(null);
  const numbersWordRef = useRef<HTMLDivElement>(null);
  const scrollLineRef = useRef<HTMLDivElement>(null);
  const zigzagRef = useRef<SVGPathElement>(null);
  const countersRef = useRef<(HTMLHeadingElement | null)[]>([]);

  const [typewriterIndex, setTypewriterIndex] = useState(0);
  const [typewriterText, setTypewriterText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  // Typewriter effect
  useEffect(() => {
    let timer: NodeJS.Timeout;
    const currentFullText = TYPEWRITER_TEXTS[typewriterIndex];

    if (isDeleting) {
      if (typewriterText === "") {
        setIsDeleting(false);
        setTypewriterIndex((prev) => (prev + 1) % TYPEWRITER_TEXTS.length);
      } else {
        timer = setTimeout(() => {
          setTypewriterText((prev) => prev.slice(0, -1));
        }, 50);
      }
    } else {
      if (typewriterText === currentFullText) {
        timer = setTimeout(() => setIsDeleting(true), 2000); // pause full text
      } else {
        timer = setTimeout(() => {
          setTypewriterText(currentFullText.slice(0, typewriterText.length + 1));
        }, 80);
      }
    }
    return () => clearTimeout(timer);
  }, [typewriterText, isDeleting, typewriterIndex]);

  // Initial animations and scroll triggers
  useEffect(() => {
    const ctx = gsap.context(() => {
      // 1. "THE" fades in
      gsap.fromTo(
        ".hero-the",
        { opacity: 0 },
        { opacity: 1, duration: 1, delay: 0.5, ease: "power2.out" }
      );

      // 2. "NUMBERS" stagger slide up from clip mask
      const letterSpans = numbersWordRef.current?.querySelectorAll("span");
      if (letterSpans) {
        gsap.fromTo(
          letterSpans,
          { y: 150 },
          { y: 0, duration: 0.8, stagger: 0.08, ease: "back.out(1.2)", delay: 0.8 }
        );
      }

      // 3. Zigzag SVG
      if (zigzagRef.current) {
        gsap.set(zigzagRef.current, { strokeDasharray: 200, strokeDashoffset: 200 });
        gsap.to(zigzagRef.current, {
          strokeDashoffset: 0,
          duration: 1,
          ease: "power2.out",
          delay: 1.5,
        });
      }

      // 4. Parallax scroll effect (Image moves slower than viewport)
      gsap.to(imageContainerRef.current, {
        yPercent: 30, // Move down 30% of its height over the scroll distance
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });

      // Text section parallax slightly up
      gsap.to(textContentRef.current, {
        yPercent: -15,
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });

      // 5. Scroll progress right edge line
      gsap.to(scrollLineRef.current, {
        scaleY: 1,
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });

      // 6. Number counters on viewport enter
      countersRef.current.forEach((counter, i) => {
        if (!counter) return;
        ScrollTrigger.create({
          trigger: counter,
          start: "top 90%",
          onEnter: () => {
            const target = STATS[i].value;
            // animate an object from 0 to target
            const obj = { val: 0 };
            gsap.to(obj, {
              val: target,
              duration: 2,
              ease: "power2.out",
              onUpdate: () => {
                const displayVal =
                  target % 1 === 0 ? Math.floor(obj.val) : obj.val.toFixed(1);
                counter.innerText = displayVal.toString();
              },
            });
          },
          once: true,
        });
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative min-h-[100svh] w-full overflow-hidden flex items-center bg-void pt-20"
    >
      <div className="max-w-[1440px] w-full mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-2 gap-12 relative z-10">
        
        {/* LEFT COLUMN - TEXT */}
        <div ref={textContentRef} className="flex flex-col justify-center order-2 lg:order-1 pt-12 lg:pt-0">
          
          <h1 className="flex flex-col select-none uppercase" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
            <span className="hero-the text-gold text-sm tracking-[6px] font-bold mb-2">THE</span>
            
            <div className="overflow-hidden leading-[0.8] pb-1">
              <div ref={numbersWordRef} className="text-white text-[clamp(72px,12vw,140px)] font-black flex">
                {"NUMBERS".split("").map((letter, i) => (
                  <span key={i} className="inline-block transform">
                    {letter}
                  </span>
                ))}
              </div>
            </div>

            <div className="leading-[0.8] pb-1 relative">
              <span className="text-[clamp(72px,12vw,140px)] font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan to-gold animate-gradient-x bg-[length:200%_200%]">
                BEHIND
              </span>
            </div>
            
            <div className="leading-[0.8] italic transform -skew-x-6 text-magenta">
              <span className="text-[clamp(72px,12vw,140px)] font-black">IPL</span>
            </div>
          </h1>

          <div className="mt-8 mb-10 flex items-center pr-12 lg:pr-0">
            <svg width="60" height="20" viewBox="0 0 60 20" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-6 shrink-0">
              <path ref={zigzagRef} d="M0 10L10 0L20 20L30 0L40 20L50 0L60 10" className="stroke-gold stroke-2" />
            </svg>
            <div className="text-cyan font-mono h-6 text-sm md:text-base border-r-2 border-cyan pr-1 animate-pulse">
              {typewriterText}
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative max-w-md group w-full mb-16">
            <div className="absolute inset-0 bg-gradient-to-r from-navy to-cyan/20 blur-xl opacity-0 transition-opacity duration-500 group-focus-within:opacity-100 rounded-full" />
            <div className="relative flex items-center bg-navy/40 backdrop-blur-md border border-navy group-focus-within:border-cyan transition-colors duration-300 rounded-full py-3 px-6 shadow-2xl">
              <Search className="text-white/50 group-focus-within:text-cyan w-5 h-5 mr-3 transition-colors" />
              <input 
                type="text" 
                placeholder="Search players, teams, matches..." 
                className="bg-transparent border-none outline-none w-full text-white placeholder:text-white/40 font-mono text-sm"
              />
            </div>
          </div>

          {/* Bottom Counters */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {STATS.map((stat, i) => (
              <div key={stat.label} className="flex flex-col border-l-2 border-navy pl-4">
                <div className="flex items-baseline text-white font-mono text-3xl font-bold">
                  <span>{stat.prefix}</span>
                  <h3 ref={(el) => { countersRef.current[i] = el; }}>0</h3>
                  <span>{stat.suffix}</span>
                </div>
                <span className="text-white/50 text-[10px] uppercase tracking-widest mt-1 font-bold">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>

        </div>

        {/* RIGHT COLUMN - IMAGE & 3D BALL */}
        <div className="relative flex items-center justify-center order-1 lg:order-2 h-[50vh] lg:h-auto pointer-events-none">
          {/* Note: In mobile, pointer-events-none ensures it doesn't block scrolling */}
          <div ref={imageContainerRef} className="absolute inset-0 md:inset-[-10%] z-0 flex items-center justify-center">
            <div className="relative w-[300px] h-[300px] md:w-[600px] md:h-[600px]">
              {/* Fallback glow if image is missing */}
              <div className="absolute inset-20 rounded-full bg-cyan/20 blur-[100px] mix-blend-screen" />
              <div className="absolute inset-0 flex items-center justify-center">
                 <Image 
                   src="/hero-ball.jpg" 
                   alt="IPL Cricket Ball" 
                   fill 
                   className="object-contain" // Wait, object-contain is safer to preserve the exact circle
                   priority
                   unoptimized // user provided a sample image, it might be raw
                 />
              </div>
              
              {/* R3F Canvas overlaying the ball exactly */}
              {/* Note: R3F needs pointer events to detect hover */}
              <div className="absolute inset-0 z-10 pointer-events-auto">
                <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
                  <ambientLight intensity={1} />
                  <CricketBallSeam />
                </Canvas>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Progress Line */}
      <div className="absolute right-0 top-0 bottom-0 w-[2px] bg-navy z-20 hidden md:block">
        <div 
          ref={scrollLineRef}
          className="w-full bg-gold h-full origin-top transform scale-y-0"
        />
      </div>
    </section>
  );
}
