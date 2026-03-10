"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import gsap from "gsap";
import { Menu, X } from "lucide-react";
import { cn } from "@/utils/cn";

const NAV_LINKS = ["Matches", "Teams", "Players", "Stats", "Trivia"];

export function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [activeLink, setActiveLink] = useState("Matches");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const linksRef = useRef<(HTMLAnchorElement | null)[]>([]);

  // Handle scroll for frosted glass effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 60);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Magnetic hover effect using GSAP
  useEffect(() => {
    const context = gsap.context(() => {
      linksRef.current.forEach((link) => {
        if (!link) return;

        const handleMouseMove = (e: MouseEvent) => {
          const rect = link.getBoundingClientRect();
          const cx = rect.left + rect.width / 2;
          const cy = rect.top + rect.height / 2;
          const dx = e.clientX - cx;
          const dy = e.clientY - cy;

          // Shift text by max 4px
          gsap.to(link, {
            x: dx * 0.15,
            y: dy * 0.15,
            duration: 0.3,
            ease: "power2.out",
          });
        };

        const handleMouseLeave = () => {
          gsap.to(link, {
            x: 0,
            y: 0,
            duration: 0.5,
            ease: "elastic.out(1, 0.3)",
          });
        };

        link.addEventListener("mousemove", handleMouseMove);
        link.addEventListener("mouseleave", handleMouseLeave);

        return () => {
          link.removeEventListener("mousemove", handleMouseMove);
          link.removeEventListener("mouseleave", handleMouseLeave);
        };
      });
    });

    return () => context.revert();
  }, [scrolled]); // re-run if layout completely shifts but generally safe

  return (
    <>
      <nav
        className={cn(
          "fixed top-0 left-0 right-0 z-40 transition-all duration-300 px-6 py-4 md:px-12",
          scrolled ? "bg-void/80 backdrop-blur-2xl border-b border-navy" : "bg-transparent"
        )}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo */}
          <div
            className="text-2xl font-black tracking-widest text-white cursor-pointer"
            style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
          >
            CREX
          </div>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map((link, i) => (
              <a
                key={link}
                ref={(el) => {
                  linksRef.current[i] = el;
                }}
                className="relative cursor-pointer text-sm font-medium uppercase tracking-wider text-white/80 hover:text-white transition-colors py-2 px-1"
                onClick={() => setActiveLink(link)}
              >
                {link}
                {activeLink === link && (
                  <motion.div
                    layoutId="active-nav-indicator"
                    className="absolute -bottom-1 left-0 right-0 h-[2px] bg-gold"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
              </a>
            ))}

            {/* CTA Button w/ cycling gradient border */}
            <div className="relative group p-[1px] rounded overflow-hidden cursor-pointer ml-4">
              <div className="absolute inset-0 bg-gradient-to-r from-cyan via-gold to-magenta animate-gradient-x bg-[length:200%_200%]" />
              <div className="relative bg-void px-6 py-2 rounded text-sm font-bold uppercase tracking-wide text-white group-hover:bg-opacity-80 transition-all">
                IPL 2026
              </div>
            </div>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden text-white z-50 relative"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </nav>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ y: "-100%" }}
            animate={{ y: 0 }}
            exit={{ y: "-100%" }}
            transition={{ type: "tween", ease: "easeInOut", duration: 0.4 }}
            className="fixed inset-0 z-30 bg-void/95 backdrop-blur-3xl flex flex-col items-center justify-center pt-20"
          >
            {NAV_LINKS.map((link, i) => (
              <motion.a
                key={link}
                initial={{ opacity: 0, scale: 0.9, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 10 }}
                transition={{
                  duration: 0.3,
                  delay: i * 0.05 + 0.2, // stagger reveal
                }}
                className={cn(
                  "text-3xl font-black uppercase tracking-widest my-4 cursor-pointer",
                  activeLink === link ? "text-gold" : "text-white"
                )}
                style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
                onClick={() => {
                  setActiveLink(link);
                  setMobileMenuOpen(false);
                }}
              >
                {link}
              </motion.a>
            ))}
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="mt-8 relative group p-[2px] rounded overflow-hidden"
              onClick={() => setMobileMenuOpen(false)}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-cyan via-gold to-magenta bg-[length:200%_200%] animate-gradient-x" />
              <div className="relative bg-void px-8 py-3 rounded text-xl font-bold uppercase tracking-wide text-white">
                IPL 2026
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
