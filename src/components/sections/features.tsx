import { Activity, Brain, Trophy } from "lucide-react";

const items = [
  {
    icon: Activity,
    title: "Live Ball-by-Ball",
    description: "Never miss a moment. Scores update in under 2 seconds with phase-aware context.",
  },
  {
    icon: Brain,
    title: "Predictive Analytics",
    description: "AI-powered win probability and momentum tracking tuned for IPL match states.",
  },
  {
    icon: Trophy,
    title: "Fantasy Intelligence",
    description: "Roster insights ranked by form, pitch, and conditions before lock.",
  },
];

export function FeatureSection() {
  return (
    <section className="crex-section">
      <div className="crex-container">
        <div className="mb-10">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-crex-muted">Platform Capabilities</p>
          <h2 className="mt-3 font-display text-5xl uppercase text-crex-text md:text-6xl">Built for every phase of an IPL night</h2>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {items.map((item) => {
            const Icon = item.icon;
            return (
              <article key={item.title} className="crex-card border-l-4 border-l-crex-accent">
                <Icon size={44} className="text-crex-accent" />
                <h3 className="mt-6 font-display text-3xl uppercase text-crex-text">{item.title}</h3>
                <p className="mt-4 text-sm leading-7 text-crex-muted">{item.description}</p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
