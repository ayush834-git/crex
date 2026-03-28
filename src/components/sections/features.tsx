import { Activity, Brain, Trophy } from "lucide-react";

const items = [
  {
    icon: Activity,
    title: "Live Ball-by-Ball",
    description: "No muted dashboards. The pressure points stay front and center as the chase moves.",
    accent: "from-[#facc15] to-[#ea580c]",
    iconClass: "text-[#facc15]",
  },
  {
    icon: Brain,
    title: "Predictive Analytics",
    description: "Momentum, venue bias, and matchup context presented like a poster, not a spreadsheet.",
    accent: "from-[#60a5fa] to-[#7c3aed]",
    iconClass: "text-[#facc15]",
  },
  {
    icon: Trophy,
    title: "Fantasy Intelligence",
    description: "Short, sharp recommendation cards that keep the product feeling decisive on match night.",
    accent: "from-[#f472b6] to-[#facc15]",
    iconClass: "text-[#facc15]",
  },
];

export function FeatureSection() {
  return (
    <section className="crex-section crex-stage crex-stage-purple border-y border-white/16">
      <div className="crex-container">
        <div className="mb-10">
          <p className="font-display text-3xl uppercase tracking-[0.08em] text-crex-surface">Platform Capabilities</p>
          <h2 className="mt-3 font-poster text-[4.25rem] uppercase leading-[0.84] text-crex-surface crex-title-shadow md:text-[6rem]">
            Built for the full arc
            <span className="block text-crex-surface crex-blue-shadow">of an IPL night.</span>
          </h2>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {items.map((item) => {
            const Icon = item.icon;
            return (
              <article
                key={item.title}
                className="crex-card crex-card-interactive [--crex-card-glow:rgba(250,204,21,0.24)] bg-[linear-gradient(180deg,rgba(76,29,149,0.96),rgba(157,23,77,0.94))] text-white"
              >
                <div className={`h-2 w-28 rounded-full bg-gradient-to-r ${item.accent}`} />
                <Icon size={44} className={`mt-6 ${item.iconClass}`} />
                <h3 className="mt-6 font-display text-4xl uppercase leading-none tracking-[0.08em] text-[#facc15]">{item.title}</h3>
                <p className="mt-4 text-xl uppercase leading-6 text-[#fde68a]">{item.description}</p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
