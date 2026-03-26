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
        className="tap-target rounded-2xl border border-crex-border bg-white px-4 py-2 text-crex-text disabled:opacity-40"
      >
        <ChevronLeft size={18} />
      </button>
      {Array.from({ length: totalPages }, (_, index) => index + 1).map((value) => (
        <button
          key={value}
          onClick={() => onPageChange(value)}
          className={cn(
            "tap-target min-w-[44px] rounded-2xl border px-4 py-2 text-sm font-semibold",
            value === page ? "border-crex-accent bg-crex-accent text-white" : "border-crex-border bg-white text-crex-text"
          )}
        >
          {value}
        </button>
      ))}
      <button
        disabled={page >= totalPages}
        onClick={() => onPageChange(page + 1)}
        className="tap-target rounded-2xl border border-crex-border bg-white px-4 py-2 text-crex-text disabled:opacity-40"
      >
        <ChevronRight size={18} />
      </button>
    </div>
  );
}
