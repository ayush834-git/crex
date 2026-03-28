"use client";

import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

interface MobileMenuProps {
  open: boolean;
  onClose: () => void;
}

const links = [
  { href: "/", label: "Home" },
  { href: "/matches", label: "Matches" },
  { href: "/players", label: "Players" },
  { href: "/analytics", label: "Analytics" },
];

export function MobileMenu({ open, onClose }: MobileMenuProps) {
  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          initial={{ opacity: 0, x: "100%" }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: "100%" }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-50 crex-stage crex-stage-blue md:hidden"
        >
          <div className="crex-container flex h-full flex-col py-6">
            <div className="flex items-center justify-between">
              <span className="font-display text-5xl uppercase tracking-[0.08em] text-white crex-blue-shadow">CREX</span>
              <button className="tap-target crex-button px-3 py-2" onClick={onClose} aria-label="Close navigation">
                <X size={18} />
              </button>
            </div>
            <div className="mt-16 flex flex-1 flex-col gap-4">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={onClose}
                  className="crex-card crex-card-interactive px-5 py-4 font-display text-4xl uppercase tracking-[0.08em] text-crex-accent"
                >
                  {link.label}
                </Link>
              ))}
            </div>
            <div className="mb-10">
              <span className="crex-pill">IPL 2026</span>
            </div>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
