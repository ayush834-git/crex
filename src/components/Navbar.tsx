"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";
import { useMatches } from "@/hooks/useMatches";
import { LiveBadge } from "@/components/ui/live-badge";
import { MobileMenu } from "@/components/ui/mobile-menu";
import { AnimatedDock } from "@/components/ui/animated-dock";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/matches", label: "Matches" },
  { href: "/players", label: "Players" },
  { href: "/analytics", label: "Analytics" },
];

export function Navbar() {
  const { matches } = useMatches("live", 2);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <>
      <header className="sticky top-0 z-30 border-b border-white/20 bg-[linear-gradient(90deg,rgba(185,28,28,0.92),rgba(234,88,12,0.9)_48%,rgba(29,78,216,0.92))] backdrop-blur-md shadow-[0_18px_38px_rgba(91,33,182,0.2)]">
        <div className="crex-container flex items-center justify-between py-4 md:py-5">
          <Link href="/" className="font-display text-5xl uppercase tracking-[0.08em] text-white crex-blue-shadow md:text-6xl">
            CREX
          </Link>
          <nav className="hidden items-center gap-8 md:flex">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-xl px-3 py-2 font-display text-2xl uppercase tracking-[0.08em] transition-all duration-200 ${pathname === item.href ? "bg-white/18 text-white shadow-[0_10px_18px_rgba(91,33,182,0.16)]" : "text-white/78 hover:bg-white/10 hover:text-white"}`}
              >
                {item.label}
              </Link>
            ))}
            {matches.length ? <LiveBadge /> : <span className="crex-pill">IPL 2026</span>}
          </nav>
          <button className="tap-target crex-button px-3 py-2 md:hidden" onClick={() => setOpen(true)} aria-label="Open navigation">
            <Menu size={18} />
          </button>
        </div>
      </header>
      <MobileMenu open={open} onClose={() => setOpen(false)} />
      <AnimatedDock />
    </>
  );
}
