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
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-crex-accent/10 text-crex-accent">
        <CircleDot size={28} />
      </div>
      <div>
        <h3 className="font-display text-3xl uppercase text-crex-text">{title}</h3>
        <p className="mt-2 max-w-md text-sm leading-6 text-crex-muted">{subtitle}</p>
      </div>
      {cta ? (
        <Link href={cta.href} className="tap-target rounded-2xl bg-crex-accent px-5 py-3 font-semibold text-white">
          {cta.text}
        </Link>
      ) : null}
    </div>
  );
}
