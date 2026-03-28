"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BarChart3, Flame, Home, Users } from "lucide-react";
import { cn } from "@/utils/cn";

const items = [
  { href: "/", label: "Home", icon: Home },
  { href: "/matches?tab=live", label: "Live", icon: Flame },
  { href: "/players", label: "Players", icon: Users },
  { href: "/analytics", label: "Analytics", icon: BarChart3 },
];

export function AnimatedDock() {
  const pathname = usePathname();

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t-4 border-crex-accent bg-crex-surface px-4 pb-[calc(0.75rem+env(safe-area-inset-bottom,0px))] pt-3 md:hidden">
      <div className="mx-auto flex max-w-sm items-center justify-between border-4 border-crex-border bg-crex-panel px-3 py-2 shadow-crex">
        {items.map((item) => {
          const route = item.href.split("?")[0];
          const active = pathname === route;
          const Icon = item.icon;
          return (
            <Link
              key={item.label}
              href={item.href}
              className={cn(
                "tap-target flex min-w-[68px] flex-col items-center justify-center px-2 py-2 font-display text-sm uppercase tracking-[0.08em] transition-transform duration-200",
                active ? "border-2 border-crex-border bg-crex-accent text-crex-surface shadow-[4px_4px_0_var(--crex-shadow)]" : "text-crex-accent"
              )}
            >
              <Icon size={18} />
              <span className="mt-1">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
