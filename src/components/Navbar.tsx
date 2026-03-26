"use client";

import Link from "next/link";
import { useState } from "react";
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

  return (
    <>
      <header className="sticky top-0 z-30 border-b border-crex-border bg-white/80 backdrop-blur-md">
        <div className="crex-container flex items-center justify-between py-4">
          <Link href="/" className="font-display text-4xl uppercase text-crex-text">
            CREX
          </Link>
          <nav className="hidden items-center gap-6 md:flex">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href} className="text-sm font-semibold uppercase tracking-[0.18em] text-crex-muted transition-colors hover:text-crex-text">
                {item.label}
              </Link>
            ))}
            {matches.length ? <LiveBadge /> : <span className="crex-pill">IPL 2026</span>}
          </nav>
          <button className="tap-target rounded-full border border-crex-border p-3 text-crex-text md:hidden" onClick={() => setOpen(true)}>
            <Menu size={18} />
          </button>
        </div>
      </header>
      <MobileMenu open={open} onClose={() => setOpen(false)} />
      <AnimatedDock />
    </>
  );
}
