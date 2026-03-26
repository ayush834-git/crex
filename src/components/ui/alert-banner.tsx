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
    <div className={cn("border-b border-crex-accent/20 bg-crex-accent px-4 py-2 text-white", className)}>
      <div className="crex-container flex items-center justify-between gap-3 text-sm">
        <div className="flex items-center gap-3">
          <span className="h-2 w-2 rounded-full bg-white animate-live-pulse" />
          <span className="font-medium">{message}</span>
          {cta ? (
            <Link href={cta.href} className="font-semibold underline underline-offset-4">
              {cta.text}
            </Link>
          ) : null}
        </div>
        {dismissible ? (
          <button aria-label="Dismiss alert" className="tap-target rounded-full p-2 text-white/80 hover:bg-white/10" onClick={() => setOpen(false)}>
            <X size={16} />
          </button>
        ) : null}
      </div>
    </div>
  );
}
