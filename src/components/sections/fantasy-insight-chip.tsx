import { cn } from "@/utils/cn";

const styles = {
  "Form Pick": "bg-[#00c978] text-crex-text",
  "Value Play": "bg-crex-accent text-crex-surface",
  "Captain Core": "bg-crex-hot text-crex-surface",
  Differential: "bg-crex-accent-soft text-crex-surface",
};

export function FantasyInsightChip({ label }: { label: keyof typeof styles }) {
  return <span className={cn("inline-flex border-2 border-crex-border px-3 py-1 font-display text-lg uppercase tracking-[0.08em] shadow-[3px_3px_0_var(--crex-shadow)]", styles[label])}>{label}</span>;
}
