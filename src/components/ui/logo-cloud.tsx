import { IPL_TEAMS } from "@/lib/constants/teams";
import { TeamMark } from "@/components/ui/team-mark";

export function LogoCloud() {
  const items = [...IPL_TEAMS, ...IPL_TEAMS];

  return (
    <section className="crex-stage crex-stage-pink overflow-hidden border-y border-white/16 py-6">
      <div className="flex w-max animate-crex-marquee items-center gap-6 px-4">
        {items.map((team, index) => (
          <div key={`${team.id}-${index}`} className="crex-card flex items-center gap-3 px-4 py-3">
            <TeamMark abbr={team.abbr} logo={team.logo} />
            <span className="font-display text-2xl uppercase tracking-[0.08em] text-crex-accent">{team.name}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
