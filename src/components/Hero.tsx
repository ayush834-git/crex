"use client";

import { useEffect, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import gsap from "gsap";
import { Search } from "lucide-react";
import { CricketBallSeam } from "./CricketBallSeam";

export function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const stripeRef = useRef<HTMLDivElement>(null);
  const textContentRef = useRef<HTMLDivElement>(null);
  const crexLettersRef = useRef<HTMLHeadingElement[]>([]);
  const iplRef = useRef<HTMLHeadingElement>(null);
  const intelRef = useRef<HTMLHeadingElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);
  const ballRef = useRef<HTMLDivElement>(null);
  const bottomBarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline();

      // Initial States
      gsap.set(containerRef.current, { clipPath: "polygon(0 0, 0 0, 0 100%, 0 100%)" });
      gsap.set(crexLettersRef.current, { y: -300, opacity: 0 });
      gsap.set(iplRef.current, { opacity: 0, x: -50 });
      gsap.set(intelRef.current, { opacity: 0, x: -50 });
      gsap.set(stripeRef.current, { scaleX: 0, opacity: 0 });
      gsap.set(ballRef.current, { opacity: 0 });
      gsap.set(searchRef.current, { y: 50, opacity: 0 });
      gsap.set(bottomBarRef.current, { y: 80 });

      // GSAP Entrance Timeline from specs
      // t=0.0: Yellow background floods in from left (clip-path wipe)
      tl.to(containerRef.current, {
        clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)",
        duration: 0.3,
        ease: "power2.inOut"
      }, 0.0)
      
      // t=0.3: "CREX" letters slam down from top, stagger 60ms each
      .to(crexLettersRef.current, {
        y: 0,
        opacity: 1,
        duration: 0.6,
        stagger: 0.06,
        ease: "back.out(1.5)"
      }, 0.3)
      .to([iplRef.current, intelRef.current], {
        opacity: 1,
        x: 0,
        duration: 0.4,
        stagger: 0.1
      }, 0.4)
      
      // t=0.6: Red diagonal stripe draws across screen
      .to(stripeRef.current, {
        scaleX: 1,
        opacity: 1,
        duration: 0.4,
        ease: "power3.out"
      }, 0.6)
      
      // t=0.8: Ball fades in + starts spinning
      .to(ballRef.current, {
        opacity: 1,
        duration: 0.4
      }, 0.8)
      
      // t=1.0: Search bar slides up from bottom
      .to(searchRef.current, {
        y: 0,
        opacity: 1,
        duration: 0.4,
        ease: "back.out(1.2)"
      }, 1.0)
      
      // t=1.2: Blue stat strip slides up
      .to(bottomBarRef.current, {
        y: 0,
        duration: 0.4,
        ease: "power2.out"
      }, 1.2);

    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} className="relative h-[100svh] w-full bg-sun overflow-hidden flex items-center">
      
      {/* Thick diagonal red stripe (10deg skew, 40px wide) */}
      <div 
        ref={stripeRef} 
        className="absolute inset-0 z-0 flex items-center justify-center pointer-events-none origin-bottom-left"
      >
         <div 
           className="w-[200%] h-[40px] bg-crimson" 
           style={{ transform: "rotate(-10deg) translateY(100px)" }} 
         />
      </div>

      <div className="max-w-[1440px] w-full h-full mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-2 relative z-10 pt-24 md:pt-0">
        
        {/* LEFT SIDE - TEXT BLOCK */}
        <div ref={textContentRef} className="flex flex-col justify-center h-full pb-20 mt-10 md:mt-0">
          
          {/* Line 1: CREX */}
          <div className="flex -space-x-4 overflow-hidden pt-4 pb-2 z-10">
            {"CREX".split("").map((char, i) => (
               <h1 
                 key={i} 
                 ref={(el) => { if(el) crexLettersRef.current[i] = el; }}
                 className="text-royal leading-[0.8] font-black pointer-events-none" 
                 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 'clamp(120px, 15vw, 200px)' }}
               >
                 {char}
               </h1>
            ))}
          </div>

          {/* Line 2: IPL */}
          <h2 
            ref={iplRef} 
            className="text-crimson leading-[0.8] font-black z-10 pointer-events-none" 
            style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 'clamp(80px, 10vw, 120px)', transform: 'skewX(-8deg)' }}
          >
            IPL
          </h2>

          {/* Line 3: INTELLIGENCE */}
          <h3 
            ref={intelRef} 
            className="text-ink font-bold mt-2 md:mt-4 leading-none tracking-widest z-10 pointer-events-none" 
            style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 'clamp(32px, 5vw, 48px)' }}
          >
            INTELLIGENCE
          </h3>

          {/* Search bar */}
          <div ref={searchRef} className="mt-8 md:mt-12 flex items-center bg-white border-4 border-royal w-full max-w-[500px] z-20">
             <input 
               type="text" 
               placeholder="Search players, teams, matches..." 
               className="bg-transparent text-ink placeholder-ink/50 w-full p-3 md:p-4 font-sans font-medium outline-none text-base md:text-lg" 
             />
             <button className="bg-crimson text-white px-6 md:px-8 py-3 md:py-4 font-bold border-l-4 border-royal flex items-center justify-center hover:bg-ink transition-colors">
                <Search className="w-6 h-6 stroke-[3px]" />
             </button>
          </div>

        </div>

        {/* RIGHT SIDE - 3D BALL */}
        <div className="relative flex items-center justify-center h-full pb-20 pointer-events-none z-10">
           {/* Fills 50% of right column approx. Restricting height/width explicitly for Canvas rendering scale */}
           <div ref={ballRef} className="w-[100%] max-w-[500px] aspect-square absolute right-0 md:mt-0 -mt-20 pointer-events-auto">
             <Canvas camera={{ position: [0, 0, 5], fov: 45 }} gl={{ alpha: true }}>
                <ambientLight intensity={0.4} />
                <pointLight position={[-5, 5, 5]} color="#FFE500" intensity={3} />
                <pointLight position={[5, 0, 5]} color="#FFFFFF" intensity={1} />
                <CricketBallSeam />
             </Canvas>
           </div>
        </div>
      </div>

      {/* BOTTOM BAR: inside hero, above fold */}
      <div 
        ref={bottomBarRef} 
        className="absolute bottom-0 left-0 w-full h-[80px] bg-royal border-t-8 border-ink flex items-center z-20"
      >
        <div className="flex items-center justify-between w-full h-full mx-auto max-w-[1440px] text-sun font-mono text-sm md:text-lg lg:text-xl font-bold divide-x-4 divide-sun">
          <div className="px-2 md:px-6 w-full text-center tracking-tight truncate">342 PLAYERS</div>
          <div className="px-2 md:px-6 w-full text-center tracking-tight truncate">1084 MATCHES</div>
          <div className="px-2 md:px-6 w-full text-center tracking-tight truncate hidden sm:block">2.1M DATA POINTS</div>
          <div className="px-2 md:px-6 w-full text-center tracking-tight truncate hidden md:block">IPL 2008–2026</div>
        </div>
      </div>
    </section>
  );
}
