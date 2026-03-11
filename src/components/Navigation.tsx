/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import gsap from "gsap";
import { Menu, X } from "lucide-react";
import Link from "next/link";

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Players", href: "/players" },
];

export function Navigation() {
  const [liveMatches, setLiveMatches] = useState<any[]>([]);
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const linksRef = useRef<(HTMLAnchorElement | null)[]>([]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const load = () =>
      fetch("/api/live-scores")
        .then(r => r.json())
        .then(d => setLiveMatches(
          (d.data ?? []).filter((m: any) =>
            m.matchType === "T20" &&
            m.status?.toLowerCase().includes("live") ||
            (m.score?.length > 0 && m.score.some((s: any) => s.o < 20))
          )
        ))
        .catch(() => {})

    load()
    const t = setInterval(load, 120000)
    return () => clearInterval(t)
  }, [])

  useEffect(() => {
    const context = gsap.context(() => {
      linksRef.current.forEach((link) => {
        if (!link) return;
        const handleMouseMove = (e: MouseEvent) => {
          const rect = link.getBoundingClientRect();
          const dx = e.clientX - (rect.left + rect.width / 2);
          const dy = e.clientY - (rect.top + rect.height / 2);
          gsap.to(link, { x: dx * 0.15, y: dy * 0.15, duration: 0.3, ease: "power2.out" });
        };
        const handleMouseLeave = () => {
          gsap.to(link, { x: 0, y: 0, duration: 0.5, ease: "elastic.out(1, 0.3)" });
        };
        link.addEventListener("mousemove", handleMouseMove);
        link.addEventListener("mouseleave", handleMouseLeave);
      });
    });
    return () => context.revert();
  }, [scrolled]);

  return (
    <>
      {liveMatches.length > 0 && (
        <div style={{ background: "#E63946", borderBottom: "4px solid #1A1AE6", position: "fixed", top: 0, left: 0, right: 0, zIndex: 50 }}
          className="w-full px-6 py-1.5 flex gap-8 overflow-x-auto text-white">
          {liveMatches.map((m, i) => {
            const s = m.score ?? []
            const inn1 = s[0]
            const inn2 = s[1]
            return (
              <span key={i} className="shrink-0 flex items-center gap-3 text-white"
                style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 13 }}>
                <span className="flex items-center gap-1">
                  <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#FFF",
                    display: "inline-block", animation: "pulse 1s infinite" }} />
                  <span style={{ fontWeight: 700 }}>LIVE</span>
                </span>
                <span>{m.teamInfo?.[0]?.shortname ?? m.teams?.[0]}</span>
                {inn1 && <span>{inn1.r}/{inn1.w} ({inn1.o})</span>}
                <span style={{ color: "rgba(255,255,255,0.7)" }}>vs</span>
                <span>{m.teamInfo?.[1]?.shortname ?? m.teams?.[1]}</span>
                {inn2 && <span>{inn2.r}/{inn2.w} ({inn2.o})</span>}
              </span>
            )
          })}
        </div>
      )}
      <nav className="fixed left-0 right-0 z-40 transition-all duration-300 px-6 py-4 md:px-12"
        style={{
          top: liveMatches.length > 0 ? "39px" : "0px",
          background: "#F5C518",
          borderBottom: "4px solid #1A1AE6",
        }}>
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="text-3xl font-black tracking-widest cursor-pointer"
            style={{ fontFamily: "'Barlow Condensed', sans-serif", color: "#1A1AE6" }}>
            CREX
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map((link, i) => (
              <Link key={link.label} href={link.href}
                ref={(el) => { linksRef.current[i] = el; }}
                className="relative cursor-pointer text-sm font-black uppercase tracking-wider text-[#1A1AE6] hover:text-[#E63946] transition-colors py-2 px-1"
                style={{ fontFamily: "Inter, sans-serif" }}>
                {link.label}
              </Link>
            ))}
            <div className="px-5 py-2 rounded-sm text-sm font-black uppercase tracking-wide cursor-pointer"
              style={{ background: "#1A1AE6", color: "#F5C518", fontFamily: "'Barlow Condensed', sans-serif", border: "2px solid #1A1AE6", boxShadow: "4px 4px 0 rgba(26,26,230,0.5)" }}>
              IPL 2026
            </div>
          </div>

          {/* Mobile Toggle */}
          <button className="md:hidden text-[#1A1AE6] z-50 relative cursor-pointer"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </nav>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ y: "-100%" }} animate={{ y: 0 }} exit={{ y: "-100%" }}
            transition={{ type: "tween", ease: "easeInOut", duration: 0.4 }}
            className="fixed inset-0 z-30 flex flex-col items-center justify-center pt-20"
            style={{ background: "#F5C518" }}>
            {NAV_LINKS.map((link, i) => (
              <motion.div key={link.label}
                initial={{ opacity: 0, scale: 0.9, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 10 }}
                transition={{ duration: 0.3, delay: i * 0.05 + 0.2 }}>
                <Link href={link.href}
                  className="text-4xl font-black uppercase tracking-widest my-4 cursor-pointer block text-center text-[#1A1AE6] hover:text-[#E63946] transition-colors"
                  style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
                  onClick={() => setMobileMenuOpen(false)}>
                  {link.label}
                </Link>
              </motion.div>
            ))}
            <motion.div
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
              className="mt-8 px-8 py-3 rounded-sm text-2xl font-black uppercase tracking-wide cursor-pointer shadow-[6px_6px_0_rgba(26,26,230,0.5)]"
              style={{ background: "#1A1AE6", color: "#F5C518", fontFamily: "'Barlow Condensed', sans-serif", border: "4px solid #1A1AE6" }}
              onClick={() => setMobileMenuOpen(false)}>
              IPL 2026
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
