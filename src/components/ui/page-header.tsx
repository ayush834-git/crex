import { cn } from "@/utils/cn";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  eyebrow?: string;
  badge?: string;
  tone?: "red" | "orange" | "yellow" | "blue" | "purple" | "pink";
  className?: string;
}

const toneMap = {
  red: {
    section: "crex-stage crex-stage-red",
    eyebrow: "text-crex-surface",
    title: "text-white crex-title-shadow",
    subtitle: "text-white/88",
  },
  orange: {
    section: "crex-stage crex-stage-orange",
    eyebrow: "text-white",
    title: "text-white crex-title-shadow",
    subtitle: "text-white/86",
  },
  yellow: {
    section: "crex-stage crex-stage-yellow",
    eyebrow: "text-crex-accent",
    title: "text-crex-ink crex-blue-shadow",
    subtitle: "text-[rgba(37,18,77,0.82)]",
  },
  blue: {
    section: "crex-stage crex-stage-blue",
    eyebrow: "text-crex-surface",
    title: "text-white crex-title-shadow",
    subtitle: "text-white/86",
  },
  purple: {
    section: "crex-stage crex-stage-purple",
    eyebrow: "text-crex-surface",
    title: "text-white crex-blue-shadow",
    subtitle: "text-white/84",
  },
  pink: {
    section: "crex-stage crex-stage-pink",
    eyebrow: "text-crex-surface",
    title: "text-white crex-blue-shadow",
    subtitle: "text-white/84",
  },
} as const;

export function PageHeader({ title, subtitle, eyebrow, badge, tone = "yellow", className }: PageHeaderProps) {
  const theme = toneMap[tone];

  return (
    <section className={cn("border-b border-white/16", theme.section, className)}>
      <div className="crex-container py-12 md:py-16">
        {eyebrow ? <p className={cn("mb-3 font-display text-2xl uppercase tracking-[0.08em] md:text-3xl", theme.eyebrow)}>{eyebrow}</p> : null}
        <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className={cn("font-poster text-[4.5rem] uppercase leading-[0.82] md:text-[7.5rem]", theme.title)}>{title}</h1>
            {subtitle ? <p className={cn("mt-4 max-w-3xl text-xl uppercase leading-6 tracking-[0.04em] md:text-2xl", theme.subtitle)}>{subtitle}</p> : null}
          </div>
          {badge ? (
            <span className="crex-pill text-xl leading-none">{badge}</span>
          ) : null}
        </div>
      </div>
    </section>
  );
}
