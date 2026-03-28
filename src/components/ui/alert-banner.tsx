"use client";

import Link from "next/link";
import { useState } from "react";
import { X } from "lucide-react";
import { cn } from "@/utils/cn";

interface AlertBannerProps {
  message: string;
  cta?: { text: string; href: string };
  dismissible?: boolean;
  className?: string;
}

export function AlertBanner({ message, cta, dismissible = true, className }: AlertBannerProps) {
  const [open, setOpen] = useState(true);

  if (!open) return null;

  return (
    <div className={cn("crex-stage crex-stage-red border-b border-white/16 px-4 py-2 text-white", className)}>
      <div className="crex-container flex items-center justify-between gap-3 text-base uppercase">
        <div className="flex items-center gap-3">
          <span className="h-3 w-3 rounded-full bg-[#8bff5d] animate-live-pulse" />
          <span className="font-display tracking-[0.06em]">{message}</span>
          {cta ? (
            <Link href={cta.href} className="font-display text-crex-surface underline underline-offset-4">
              {cta.text}
            </Link>
          ) : null}
        </div>
        {dismissible ? (
          <button aria-label="Dismiss alert" className="tap-target rounded-xl border border-white/24 px-2 py-1 text-white/80 hover:bg-white/10" onClick={() => setOpen(false)}>
            <X size={16} />
          </button>
        ) : null}
      </div>
    </div>
  );
}
