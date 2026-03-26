import { cn } from "@/utils/cn";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  eyebrow?: string;
  badge?: string;
  className?: string;
}

export function PageHeader({ title, subtitle, eyebrow, badge, className }: PageHeaderProps) {
  return (
    <section className={cn("border-b border-crex-border/80 bg-white/80 backdrop-blur-sm", className)}>
      <div className="crex-container py-8 md:py-10">
        {eyebrow ? <p className="mb-3 text-xs font-semibold uppercase tracking-[0.24em] text-crex-muted">{eyebrow}</p> : null}
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="font-display text-5xl uppercase leading-none text-crex-text md:text-7xl">{title}</h1>
            {subtitle ? <p className="mt-3 max-w-2xl text-base leading-7 text-crex-muted md:text-lg">{subtitle}</p> : null}
          </div>
          {badge ? (
            <span className="crex-pill border-crex-accent/30 bg-crex-accent/10 text-crex-accent">{badge}</span>
          ) : null}
        </div>
      </div>
    </section>
  );
}
