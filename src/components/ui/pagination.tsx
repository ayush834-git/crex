"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/utils/cn";

interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

export function Pagination({ page, totalPages, onPageChange, className }: PaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <div className={cn("flex items-center justify-center gap-2", className)}>
      <button
        disabled={page <= 1}
        onClick={() => onPageChange(page - 1)}
        className="tap-target rounded-xl border-2 border-crex-border bg-crex-panel px-4 py-2 text-crex-accent shadow-[0_10px_18px_rgba(91,33,182,0.14)] disabled:opacity-40"
      >
        <ChevronLeft size={18} />
      </button>
      {Array.from({ length: totalPages }, (_, index) => index + 1).map((value) => (
        <button
          key={value}
          onClick={() => onPageChange(value)}
          className={cn(
            "tap-target min-w-[44px] rounded-xl border-2 px-4 py-2 font-display text-xl uppercase tracking-[0.08em] shadow-[0_10px_18px_rgba(91,33,182,0.14)]",
            value === page ? "border-crex-border bg-crex-accent text-white shadow-[0_14px_24px_rgba(29,78,216,0.2)]" : "border-crex-border bg-crex-panel text-crex-accent"
          )}
        >
          {value}
        </button>
      ))}
      <button
        disabled={page >= totalPages}
        onClick={() => onPageChange(page + 1)}
        className="tap-target rounded-xl border-2 border-crex-border bg-crex-panel px-4 py-2 text-crex-accent shadow-[0_10px_18px_rgba(91,33,182,0.14)] disabled:opacity-40"
      >
        <ChevronRight size={18} />
      </button>
    </div>
  );
}
