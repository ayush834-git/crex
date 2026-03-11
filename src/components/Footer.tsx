"use client";

import { Instagram, Twitter, Youtube, Github } from "lucide-react";

export function Footer() {
  return (
    <footer className="relative bg-royal w-full pt-32 pb-10 px-6 md:px-12 overflow-hidden">
      
      {/* Decorative sunburst behind logo */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[1200px] opacity-[0.03] pointer-events-none origin-center animate-[spin_100s_linear_infinite]">
        <svg viewBox="0 0 100 100" className="w-full h-full">
          {[...Array(24)].map((_, i) => (
            <path key={i} d="M50 50 L100 45 L100 55 Z" fill="#FFE500" transform={`rotate(${i * 15} 50 50)`} />
          ))}
        </svg>
      </div>

      <div className="max-w-7xl mx-auto relative z-10 flex flex-col items-center">
        
        {/* Massive Logo */}
        <div 
          className="text-[clamp(120px,25vw,350px)] font-black leading-[0.7] tracking-tighter text-sun select-none mb-16 relative w-full text-center"
          style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
        >
          <span className="relative z-10" style={{ textShadow: "10px 10px 0px #E6001A" }}>
            CREX
          </span>
          {/* Duplicate for shadow / 3D block effect */}
          <span className="absolute inset-0 text-white z-0 transform translate-y-4 -translate-x-2" style={{ clipPath: "polygon(0 50%, 100% 50%, 100% 100%, 0 100%)" }}>
            CREX
          </span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 w-full gap-10 md:gap-0 max-w-5xl text-center md:text-left mb-20 bg-ink border-[6px] border-sun p-12 shadow-[16px_16px_0_#F5C518] transform -rotate-1 hover:rotate-0 transition-transform duration-500">
          
          <div className="flex flex-col gap-4">
            <h4 className="text-sun text-lg font-black uppercase tracking-widest border-b-4 border-sun pb-2 inline-block">Platform</h4>
            <a href="#" className="text-royal hover:text-crimson transition-colors font-black tracking-wide uppercase hover:translate-x-1 duration-200">MATCHES</a>
            <a href="#" className="text-royal hover:text-crimson transition-colors font-black tracking-wide uppercase hover:translate-x-1 duration-200">PLAYERS</a>
            <a href="#" className="text-royal hover:text-crimson transition-colors font-black tracking-wide uppercase hover:translate-x-1 duration-200">TEAMS</a>
            <a href="#" className="text-royal hover:text-crimson transition-colors font-black tracking-wide uppercase hover:translate-x-1 duration-200">FANTASY</a>
          </div>

          <div className="flex flex-col gap-4">
            <h4 className="text-sun text-lg font-black uppercase tracking-widest border-b-4 border-sun pb-2 inline-block">Resources</h4>
            <a href="#" className="text-sky hover:text-crimson transition-colors font-black tracking-wide uppercase hover:translate-x-1 duration-200">API ACCESS</a>
            <a href="#" className="text-sky hover:text-crimson transition-colors font-black tracking-wide uppercase hover:translate-x-1 duration-200">LABS</a>
            <a href="#" className="text-sky hover:text-crimson transition-colors font-black tracking-wide uppercase hover:translate-x-1 duration-200">METHODOLOGY</a>
            <a href="#" className="text-sky hover:text-crimson transition-colors font-black tracking-wide uppercase hover:translate-x-1 duration-200">CAREERS</a>
          </div>

          <div className="flex flex-col gap-4">
            <h4 className="text-sun text-lg font-black uppercase tracking-widest border-b-4 border-sun pb-2 inline-block">Legal</h4>
            <a href="#" className="text-violet hover:text-crimson transition-colors font-black tracking-wide uppercase hover:translate-x-1 duration-200">PRIVACY</a>
            <a href="#" className="text-violet hover:text-crimson transition-colors font-black tracking-wide uppercase hover:translate-x-1 duration-200">TERMS</a>
            <a href="#" className="text-violet hover:text-crimson transition-colors font-black tracking-wide uppercase hover:translate-x-1 duration-200">COOKIES</a>
          </div>

          <div className="flex flex-col gap-4 justify-start md:items-end w-full">
             <h4 className="text-sun text-lg font-black text-center md:text-right uppercase tracking-widest border-b-4 border-sun pb-2 w-full">Socials</h4>
             <div className="flex gap-4 justify-center md:justify-end w-full mt-4">
                <a href="#" className="bg-ink text-white p-3 hover:bg-sun hover:text-ink hover:-translate-y-1 transition-all border-2 border-transparent hover:border-ink shadow-[4px_4px_0_#FFF]">
                  <Twitter size={24} />
                </a>
                <a href="#" className="bg-ink text-white p-3 hover:bg-sun hover:text-ink hover:-translate-y-1 transition-all border-2 border-transparent hover:border-ink shadow-[4px_4px_0_#FFF]">
                  <Instagram size={24} />
                </a>
                <a href="#" className="bg-ink text-white p-3 hover:bg-sun hover:text-ink hover:-translate-y-1 transition-all border-2 border-transparent hover:border-ink shadow-[4px_4px_0_#FFF]">
                  <Youtube size={24} />
                </a>
                <a href="#" className="bg-ink text-white p-3 hover:bg-sun hover:text-ink hover:-translate-y-1 transition-all border-2 border-transparent hover:border-ink shadow-[4px_4px_0_#FFF]">
                  <Github size={24} />
                </a>
             </div>
          </div>

        </div>

        <div className="w-full flex flex-col md:flex-row items-center justify-between text-sun font-mono text-sm tracking-widest font-bold px-4">
          <p className="bg-ink px-4 py-2 border-2 border-sun shadow-[4px_4px_0_#E63946]">© {new Date().getFullYear()} CREX INTELLIGENCE HQ</p>
          <p className="mt-6 md:mt-0 flex items-center bg-ink text-sun px-4 py-2 border-2 border-sun shadow-[4px_4px_0_#F5C518]">
            BUILT DURING IPL 2026. <span className="text-crimson ml-3 animate-pulse pb-1 text-2xl">●</span>
          </p>
        </div>

      </div>
    </footer>
  );
}
