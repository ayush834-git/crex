import { cn } from "@/utils/cn";

export function LiveBadge({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-xl border border-white/16 bg-[linear-gradient(135deg,rgba(109,40,217,0.22),rgba(255,255,255,0.12))] px-3 py-1 font-display text-lg uppercase tracking-[0.08em] text-white shadow-[0_12px_22px_rgba(91,33,182,0.16)] backdrop-blur-sm",
        className
      )}
    >
      <span className="h-2.5 w-2.5 rounded-full bg-[#8bff5d] animate-live-pulse" />
      Live
    </span>
  );
}
