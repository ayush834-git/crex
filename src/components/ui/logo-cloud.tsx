import { IPL_TEAMS } from "@/lib/constants/teams";
import { TeamMark } from "@/components/ui/team-mark";

export function LogoCloud() {
  const items = [...IPL_TEAMS, ...IPL_TEAMS];

  return (
    <section className="overflow-hidden border-y border-crex-border bg-white py-6">
      <div className="flex w-max animate-crex-marquee items-center gap-6 px-4">
        {items.map((team, index) => (
          <div key={`${team.id}-${index}`} className="flex items-center gap-3 rounded-2xl bg-crex-surface px-4 py-3">
            <TeamMark abbr={team.abbr} logo={team.logo} />
            <span className="font-medium text-crex-text">{team.name}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
