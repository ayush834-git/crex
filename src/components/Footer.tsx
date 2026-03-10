"use client";

import { Instagram, Twitter, Youtube, Github } from "lucide-react";
import { cn } from "@/utils/cn";

export function Footer() {
  return (
    <footer className="relative bg-void w-full pt-20 pb-10 px-6 md:px-12 border-t border-navy overflow-hidden">
      {/* Visual Accent */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-cyan via-gold to-magenta" />
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-2xl h-[400px] bg-gold/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10 flex flex-col items-center">
        
        {/* Massive Logo */}
        <div 
          className="text-[clamp(100px,25vw,300px)] font-black leading-none tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-white/10 select-none mb-16"
          style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
        >
          CREX
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 w-full gap-10 md:gap-0 max-w-4xl text-center md:text-left mb-20 border-t border-b border-navy py-12">
          
          <div className="flex flex-col gap-4">
            <h4 className="text-white text-sm font-bold uppercase tracking-widest">Platform</h4>
            <a href="#" className="text-white/50 hover:text-cyan transition-colors text-sm font-mono tracking-wide">MATCHES</a>
            <a href="#" className="text-white/50 hover:text-cyan transition-colors text-sm font-mono tracking-wide">PLAYERS</a>
            <a href="#" className="text-white/50 hover:text-cyan transition-colors text-sm font-mono tracking-wide">TEAMS</a>
            <a href="#" className="text-white/50 hover:text-cyan transition-colors text-sm font-mono tracking-wide">FANTASY</a>
          </div>

          <div className="flex flex-col gap-4">
            <h4 className="text-white text-sm font-bold uppercase tracking-widest">Resources</h4>
            <a href="#" className="text-white/50 hover:text-magenta transition-colors text-sm font-mono tracking-wide">API ACCESS</a>
            <a href="#" className="text-white/50 hover:text-magenta transition-colors text-sm font-mono tracking-wide">LABS</a>
            <a href="#" className="text-white/50 hover:text-magenta transition-colors text-sm font-mono tracking-wide">METHODOLOGY</a>
            <a href="#" className="text-white/50 hover:text-magenta transition-colors text-sm font-mono tracking-wide">CAREERS</a>
          </div>

          <div className="flex flex-col gap-4">
            <h4 className="text-white text-sm font-bold uppercase tracking-widest">Legal</h4>
            <a href="#" className="text-white/50 hover:text-gold transition-colors text-sm font-mono tracking-wide">PRIVACY</a>
            <a href="#" className="text-white/50 hover:text-gold transition-colors text-sm font-mono tracking-wide">TERMS</a>
            <a href="#" className="text-white/50 hover:text-gold transition-colors text-sm font-mono tracking-wide">COOKIES</a>
          </div>

          <div className="flex flex-col gap-4 justify-start md:items-end">
             <h4 className="text-white text-sm font-bold uppercase tracking-widest md:text-right w-full mb-2">Socials</h4>
             <div className="flex gap-6 justify-center md:justify-end w-full">
                <a href="#" className="text-white/40 hover:text-white transition-colors">
                  <Twitter size={20} />
                </a>
                <a href="#" className="text-white/40 hover:text-white transition-colors">
                  <Instagram size={20} />
                </a>
                <a href="#" className="text-white/40 hover:text-white transition-colors">
                  <Youtube size={20} />
                </a>
                <a href="#" className="text-white/40 hover:text-white transition-colors">
                  <Github size={20} />
                </a>
             </div>
          </div>

        </div>

        <div className="w-full flex flex-col md:flex-row items-center justify-between text-white/30 font-mono text-xs tracking-widest font-bold">
          <p>© {new Date().getFullYear()} CREX INTELLIGENCE HQ</p>
          <p className="mt-4 md:mt-0 flex items-center">
            BUILT DURING IPL 2026. <span className="text-cyan ml-2 animate-pulse">●</span>
          </p>
        </div>

      </div>
    </footer>
  );
}
