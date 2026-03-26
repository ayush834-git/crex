import { cn } from "@/utils/cn";

const styles = {
  "Form Pick": "bg-crex-live/10 text-crex-live",
  "Value Play": "bg-crex-accent/10 text-crex-accent",
  "Captain Core": "bg-[#1d2d6b]/10 text-[#1d2d6b]",
  Differential: "bg-[#3A225D]/10 text-[#3A225D]",
};

export function FantasyInsightChip({ label }: { label: keyof typeof styles }) {
  return <span className={cn("inline-flex rounded-full px-3 py-1 text-xs font-semibold", styles[label])}>{label}</span>;
}
