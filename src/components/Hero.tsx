"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import gsap from "gsap";
import { usePlayers } from "@/hooks/usePlayers";

export function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [query, setQuery] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const { players } = usePlayers();

  const filtered = query.trim().length > 0
    ? players.filter((p: any) => p.name.toLowerCase().includes(query.toLowerCase())).slice(0, 6)
    : [];

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".hero-element", {
        y: 30,
        opacity: 0,
        stagger: 0.1,
        duration: 0.8,
        ease: "back.out(1.2)"
      });
    }, containerRef);
    return () => ctx.revert();
  }, []);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === "Escape") setShowDropdown(false);
  }, []);

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [handleKeyDown]);

  return (
    <section 
      ref={containerRef} 
      className="relative min-h-[100svh] w-full overflow-hidden flex items-center bg-[#1A1AE6]"
    >
      <div className="max-w-[1440px] w-full mx-auto px-6 md:px-12 relative z-10 pt-24 md:pt-0">
        
        <div className="flex flex-col justify-center w-full">
          
          <div className="hero-element uppercase mb-6" style={{ fontFamily: "'Inter', sans-serif", fontWeight: 700, fontSize: "12px", color: "#F5C518", letterSpacing: "5px" }}>
            IPL ANALYTICS
          </div>

          <h1 className="hero-element font-black block" 
            style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: "clamp(100px, 14vw, 160px)", color: "#F5C518", letterSpacing: "-3px", lineHeight: 0.85 }}>
            CREX
          </h1>

          <h2 className="hero-element font-bold block"
            style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: "clamp(24px, 3.5vw, 40px)", color: "#FFFFFF", letterSpacing: "2px", marginTop: "8px" }}>
            THE NUMBERS
          </h2>

          <h3 className="hero-element font-black block"
            style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: "clamp(32px, 5vw, 56px)", color: "#FFFFFF", marginTop: "-4px" }}>
            BEHIND IPL.
          </h3>

          <div className="hero-element" style={{ width: "48px", height: "3px", background: "#F5C518", marginTop: "16px", marginBottom: "20px" }} />

          {/* Search Bar */}
          <div ref={dropdownRef} className="hero-element relative w-full mt-6 mb-10 group" style={{ maxWidth: "440px" }}>
             <div className="relative flex items-center justify-between transition-all duration-300 bg-white"
                  style={{ border: "3px solid #1A1AE6", borderRadius: "4px", padding: "14px 18px", color: "#080C18", fontFamily: "'Inter', sans-serif", fontWeight: 500, fontSize: "15px", boxShadow: "5px 5px 0 rgba(26,26,230,0.5)" }}
                  tabIndex={-1}>
                <div className="flex items-center w-full">
                  <input type="text" placeholder="Search players, teams, matches..." 
                    className="bg-transparent border-none outline-none w-full text-[#080C18] placeholder:text-[#080C18]/50"
                    value={query}
                    onChange={e => { setQuery(e.target.value); setShowDropdown(true); }}
                    onFocus={() => { if (query.trim()) setShowDropdown(true); }}
                    style={{ fontFamily: "Inter, sans-serif" }}
                  />
                </div>
                <button 
                  className="bg-[#1A1AE6] text-white flex items-center justify-center shrink-0 hover:bg-[#F5C518] hover:text-[#1A1AE6] transition-colors cursor-pointer"
                  style={{ padding: "8px 20px", fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 900, fontSize: "16px", borderRadius: "2px", border: "none" }}
                  onClick={() => { if (filtered.length > 0) router.push(`/players/${filtered[0].id}`); }}>
                  SEARCH
                </button>
             </div>

             {showDropdown && filtered.length > 0 && (
               <div className="absolute top-full left-0 w-full mt-2 rounded z-50 shadow-[5px_5px_0_rgba(26,26,230,0.5)] bg-white overflow-hidden" style={{ border: "3px solid #1A1AE6" }}>
                 {filtered.map(p => (
                   <button key={p.id}
                     className="w-full flex items-center gap-3 px-4 py-3 hover:bg-[#F5C518] transition-colors text-left cursor-pointer"
                     style={{ borderLeft: `6px solid #1A1AE6`, borderBottom: "1px solid #1A1AE6" }}
                     onClick={() => { router.push(`/players/${p.id}`); setShowDropdown(false); setQuery(""); }}>
                     <span className="text-[#080C18] font-black text-sm flex-1 uppercase" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>{p.name}</span>
                     <span className="text-[11px] font-bold px-2 py-0.5 rounded-sm" style={{ background: p.teamColor, color: "#fff", fontFamily: "Inter, sans-serif" }}>{p.team}</span>
                     <span className="text-[#080C18]/60 text-[11px] font-bold" style={{ fontFamily: "Inter, sans-serif" }}>{p.role}</span>
                   </button>
                 ))}
               </div>
             )}

             {showDropdown && query.trim().length > 0 && filtered.length === 0 && (
               <div className="absolute top-full left-0 w-full mt-2 overflow-hidden z-50 shadow-2xl p-4 text-center" style={{ background: "#FFFFFF", border: "3px solid #1A1AE6", boxShadow: "4px 4px 0 #1A1AE6" }}>
                  <span className="text-[#1A1AE6] text-sm font-black" style={{ fontFamily: "Inter, sans-serif" }}>No players found</span>
                </div>
             )}
          </div>

          {/* Stat Chips */}
          <div className="hero-element flex flex-row flex-wrap gap-4 mt-6">
             {[
               { num: "8,661", suffix: "KOHLI RUNS" },
               { num: "267", suffix: "IPL MATCHES" },
               { num: "18", suffix: "SEASONS" },
               { num: "175+", suffix: "BUMRAH WKTS" }
             ].map((stat, i) => (
               <div className="flex items-center gap-4 bg-[#F5C518] px-4 py-2" key={i} style={{ border: "3px solid #1A1AE6", boxShadow: "4px 4px 0 rgba(26,26,230,0.5)" }}>
                 <div className="flex flex-col">
                   <span style={{ color: "#1A1AE6", fontFamily: "'JetBrains Mono', monospace", fontWeight: 900, fontSize: "24px", lineHeight: 1 }}>{stat.num}</span>
                   <span style={{ color: "#080C18", fontFamily: "'Inter', sans-serif", fontWeight: 900, fontSize: "10px", textTransform: "uppercase" }}>{stat.suffix}</span>
                 </div>
               </div>
             ))}
          </div>
        </div>
      </div>
    </section>
  );
}
