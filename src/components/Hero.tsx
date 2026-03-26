/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import gsap from "gsap";
import { usePlayers } from "@/hooks/usePlayers";
import { FeaturedPlayerCard } from "./FeaturedPlayerCard";

export function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [query, setQuery] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const { players } = usePlayers();

  const filtered =
    query.trim().length > 0
      ? players
          .filter((p: any) =>
            p.name.toLowerCase().includes(query.toLowerCase())
          )
          .slice(0, 6)
      : [];

  // GSAP entrance — more dramatic than before
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".hero-element", {
        y: 50,
        opacity: 0,
        stagger: 0.12,
        duration: 1,
        ease: "back.out(1.4)",
        delay: 0.2,
      });

      gsap.from(".stat-chip", {
        scale: 0.5,
        opacity: 0,
        y: 30,
        stagger: 0.15,
        duration: 0.8,
        ease: "back.out(1.6)",
        delay: 0.8,
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
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
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
      className="relative min-h-[100svh] w-full overflow-hidden flex items-center bg-[#080C18]"
    >
      {/* ── 3D Canvas Background (right side glow source) ─────────────── */}
      <div
        className="absolute inset-0 z-0"
        style={{ pointerEvents: "none" }}
        aria-hidden="true"
      >
        {/* gradient vignettes for depth */}
        <div
          className="absolute inset-0 z-10"
          style={{
            background:
              "radial-gradient(ellipse 70% 100% at 70% 50%, transparent 30%, #080C18 85%)",
          }}
        />
        {/* left-side fade so text stays readable */}
        <div
          className="absolute inset-0 z-10"
          style={{
            background:
              "linear-gradient(to right, #080C18 25%, transparent 60%)",
          }}
        />
        {/* 3D Ball removed per request */}
      </div>

      {/* ── Featured Player Widget ────────────────────────────────────── */}
      <div className="absolute top-[15%] right-[5%] w-full max-w-sm hidden lg:block z-20 pointer-events-auto">
        <FeaturedPlayerCard />
      </div>

      {/* ── UI Overlay ────────────────────────────────────────────────── */}
      <div className="max-w-[1440px] w-full mx-auto px-6 md:px-12 relative z-10 pt-24 md:pt-0">
        {/* Glassmorphism panel */}
        <div
          className="flex flex-col justify-center w-full max-w-[580px]"
          style={{
            background: "rgba(255,255,255,0.04)",
            backdropFilter: "blur(12px) saturate(1.2)",
            WebkitBackdropFilter: "blur(12px) saturate(1.2)",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: "20px",
            padding: "40px 36px",
          }}
        >
          {/* Label */}
          <div
            className="hero-element uppercase mb-6"
            style={{
              fontFamily: "'Inter', sans-serif",
              fontWeight: 700,
              fontSize: "11px",
              color: "#F5C518",
              letterSpacing: "6px",
            }}
          >
            ⚡ IPL ANALYTICS PLATFORM
          </div>

          {/* Headline: CREX with golden glow */}
          <h1
            className="hero-element font-black block"
            style={{
              fontFamily: "'Barlow Condensed', sans-serif",
              fontSize: "clamp(90px, 13vw, 150px)",
              color: "#F5C518",
              letterSpacing: "-3px",
              lineHeight: 0.85,
              textShadow:
                "0 0 40px rgba(245,197,24,0.55), 0 0 80px rgba(245,197,24,0.2)",
            }}
          >
            CREX
          </h1>

          <h2
            className="hero-element font-bold block"
            style={{
              fontFamily: "'Barlow Condensed', sans-serif",
              fontSize: "clamp(22px, 3.2vw, 38px)",
              color: "#FFFFFF",
              letterSpacing: "2px",
              marginTop: "8px",
              opacity: 0.9,
            }}
          >
            THE NUMBERS
          </h2>

          <h3
            className="hero-element font-black block"
            style={{
              fontFamily: "'Barlow Condensed', sans-serif",
              fontSize: "clamp(28px, 4.5vw, 52px)",
              color: "#FFFFFF",
              marginTop: "-4px",
            }}
          >
            BEHIND IPL.
          </h3>

          {/* Yellow divider */}
          <div
            className="hero-element"
            style={{
              width: "52px",
              height: "3px",
              background: "linear-gradient(to right, #F5C518, #FFE066)",
              marginTop: "16px",
              marginBottom: "20px",
              boxShadow: "0 0 12px rgba(245,197,24,0.7)",
              borderRadius: "2px",
            }}
          />

          {/* Search Bar */}
          <div
            ref={dropdownRef}
            className="hero-element relative w-full mt-6 mb-10 group"
            style={{ maxWidth: "440px" }}
          >
            <div
              className="relative flex items-center justify-between transition-all duration-300"
              style={{
                background: "rgba(255,255,255,0.95)",
                border: "3px solid #1A1AE6",
                borderRadius: "6px",
                padding: "14px 18px",
                color: "#080C18",
                fontFamily: "'Inter', sans-serif",
                fontWeight: 500,
                fontSize: "15px",
                boxShadow:
                  "5px 5px 0 rgba(26,26,230,0.5), 0 0 20px rgba(245,197,24,0.15)",
              }}
            >
              <div className="flex items-center w-full">
                <input
                  type="text"
                  placeholder="Search players, teams, matches..."
                  className="bg-transparent border-none outline-none w-full text-[#080C18] placeholder:text-[#080C18]/50"
                  value={query}
                  onChange={(e) => {
                    setQuery(e.target.value);
                    setShowDropdown(true);
                  }}
                  onFocus={() => {
                    if (query.trim()) setShowDropdown(true);
                  }}
                  style={{ fontFamily: "Inter, sans-serif" }}
                />
              </div>
              <button
                className="bg-[#1A1AE6] text-white flex items-center justify-center shrink-0 hover:bg-[#F5C518] hover:text-[#1A1AE6] transition-all cursor-pointer"
                style={{
                  padding: "8px 20px",
                  fontFamily: "'Barlow Condensed', sans-serif",
                  fontWeight: 900,
                  fontSize: "16px",
                  borderRadius: "3px",
                  border: "none",
                  letterSpacing: "1px",
                }}
                onClick={() => {
                  if (filtered.length > 0)
                    router.push(`/players/${filtered[0].id}`);
                }}
              >
                SEARCH
              </button>
            </div>

            {showDropdown && filtered.length > 0 && (
              <div
                className="absolute top-full left-0 w-full mt-2 rounded z-50 overflow-hidden"
                style={{
                  background: "#FFFFFF",
                  border: "3px solid #1A1AE6",
                  boxShadow: "5px 5px 0 rgba(26,26,230,0.5)",
                }}
              >
                {filtered.map((p) => (
                  <button
                    key={p.id}
                    className="w-full flex items-center gap-3 px-4 py-3 hover:bg-[#F5C518] transition-colors text-left cursor-pointer"
                    style={{
                      borderLeft: `6px solid #1A1AE6`,
                      borderBottom: "1px solid #1A1AE6",
                    }}
                    onClick={() => {
                      router.push(`/players/${p.id}`);
                      setShowDropdown(false);
                      setQuery("");
                    }}
                  >
                    <span
                      className="text-[#080C18] font-black text-sm flex-1 uppercase"
                      style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
                    >
                      {p.name}
                    </span>
                    <span
                      className="text-[11px] font-bold px-2 py-0.5 rounded-sm"
                      style={{
                        background: p.teamColor,
                        color: "#fff",
                        fontFamily: "Inter, sans-serif",
                      }}
                    >
                      {p.team}
                    </span>
                    <span
                      className="text-[#080C18]/60 text-[11px] font-bold"
                      style={{ fontFamily: "Inter, sans-serif" }}
                    >
                      {p.role}
                    </span>
                  </button>
                ))}
              </div>
            )}

            {showDropdown &&
              query.trim().length > 0 &&
              filtered.length === 0 && (
                <div
                  className="absolute top-full left-0 w-full mt-2 p-4 text-center z-50"
                  style={{
                    background: "#FFFFFF",
                    border: "3px solid #1A1AE6",
                    boxShadow: "4px 4px 0 #1A1AE6",
                  }}
                >
                  <span
                    className="text-[#1A1AE6] text-sm font-black"
                    style={{ fontFamily: "Inter, sans-serif" }}
                  >
                    No players found
                  </span>
                </div>
              )}
          </div>

          {/* Stat Chips — hologram glow style */}
          <div className="hero-element flex flex-row flex-wrap gap-3 mt-2">
            {[
              { num: "8,661", suffix: "KOHLI RUNS" },
              { num: "267", suffix: "IPL MATCHES" },
              { num: "18", suffix: "SEASONS" },
              { num: "175+", suffix: "BUMRAH WKTS" },
            ].map((stat, i) => (
              <MagneticChip key={i} stat={stat} index={i} />
            ))}
          </div>
        </div>
      </div>

      {/* ── Inline keyframe for chip pulse ────────────────────────────── */}
      <style>{`
        @keyframes chipPulse {
          0%, 100% { box-shadow: 0 0 12px rgba(245,197,24,0.3), inset 0 0 8px rgba(245,197,24,0.05); }
          50%       { box-shadow: 0 0 24px rgba(245,197,24,0.6), inset 0 0 14px rgba(245,197,24,0.12); }
        }
      `}</style>
    </section>
  );
}

function MagneticChip({ stat, index }: { stat: { num: string; suffix: string }; index: number }) {
  const chipRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!chipRef.current) return;
    const rect = chipRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    
    gsap.to(chipRef.current, {
      x: x * 0.3, 
      y: y * 0.3,
      duration: 0.5,
      ease: "power2.out",
    });
  };

  const handleMouseLeave = () => {
    if (!chipRef.current) return;
    gsap.to(chipRef.current, {
      x: 0,
      y: 0,
      duration: 0.7,
      ease: "elastic.out(1, 0.3)",
    });
  };

  return (
    <div
      ref={chipRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="stat-chip flex items-center gap-3 px-4 py-2 cursor-pointer"
      style={{
        background: "rgba(245, 197, 24, 0.12)",
        border: "2px solid #F5C518",
        borderRadius: "6px",
        boxShadow: "0 0 12px rgba(245,197,24,0.3), inset 0 0 8px rgba(245,197,24,0.05)",
        animation: `chipPulse 2.5s ease-in-out ${index * 0.4}s infinite`,
      }}
    >
      <div className="flex flex-col" style={{ pointerEvents: "none" }}>
        <span
          style={{
            color: "#F5C518",
            fontFamily: "'JetBrains Mono', monospace",
            fontWeight: 900,
            fontSize: "22px",
            lineHeight: 1,
            textShadow: "0 0 10px rgba(245,197,24,0.6)",
          }}
        >
          {stat.num}
        </span>
        <span
          style={{
            color: "rgba(255,255,255,0.7)",
            fontFamily: "'Inter', sans-serif",
            fontWeight: 700,
            fontSize: "9px",
            textTransform: "uppercase",
            letterSpacing: "1px",
          }}
        >
          {stat.suffix}
        </span>
      </div>
    </div>
  );
}
