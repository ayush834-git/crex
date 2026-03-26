import { cn } from "@/utils/cn";

export function LiveBadge({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full bg-crex-live/10 px-2.5 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-crex-live",
        className
      )}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-crex-live animate-live-pulse" />
      Live
    </span>
  );
}
