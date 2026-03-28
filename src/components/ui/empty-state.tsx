import Link from "next/link";
import { CircleDot } from "lucide-react";

interface EmptyStateProps {
  title: string;
  subtitle: string;
  cta?: { text: string; href: string };
}

export function EmptyState({ title, subtitle, cta }: EmptyStateProps) {
  return (
    <div className="crex-empty-state">
      <div className="flex h-16 w-16 items-center justify-center rounded-xl border-2 border-crex-border bg-[linear-gradient(135deg,#1d4ed8,#6d28d9)] text-white shadow-crex">
        <CircleDot size={28} />
      </div>
      <div>
        <h3 className="font-display text-4xl uppercase tracking-[0.08em] text-crex-accent">{title}</h3>
        <p className="mt-2 max-w-md text-lg uppercase leading-5 text-crex-text">{subtitle}</p>
      </div>
      {cta ? (
        <Link href={cta.href} className="crex-button tap-target text-xl">
          {cta.text}
        </Link>
      ) : null}
    </div>
  );
}
