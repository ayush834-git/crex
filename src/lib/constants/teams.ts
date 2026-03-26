import type { TeamIdentity } from "@/lib/types";

export const IPL_TEAMS: TeamIdentity[] = [
  {
    id: "mi",
    name: "Mumbai Indians",
    abbr: "MI",
    primaryColor: "var(--team-mi-primary)",
    accentColor: "var(--team-mi-accent)",
    logo: "/images/teams/mi.svg",
    homeGround: "Wankhede Stadium, Mumbai",
  },
  {
    id: "csk",
    name: "Chennai Super Kings",
    abbr: "CSK",
    primaryColor: "var(--team-csk-primary)",
    accentColor: "var(--team-csk-accent)",
    logo: "/images/teams/csk.svg",
    homeGround: "MA Chidambaram Stadium, Chennai",
  },
  {
    id: "rcb",
    name: "Royal Challengers Bengaluru",
    abbr: "RCB",
    primaryColor: "var(--team-rcb-primary)",
    accentColor: "var(--team-rcb-accent)",
    logo: "/images/teams/rcb.svg",
    homeGround: "M Chinnaswamy Stadium, Bengaluru",
  },
  {
    id: "kkr",
    name: "Kolkata Knight Riders",
    abbr: "KKR",
    primaryColor: "var(--team-kkr-primary)",
    accentColor: "var(--team-kkr-accent)",
    logo: "/images/teams/kkr.svg",
    homeGround: "Eden Gardens, Kolkata",
  },
  {
    id: "srh",
    name: "Sunrisers Hyderabad",
    abbr: "SRH",
    primaryColor: "var(--team-srh-primary)",
    accentColor: "var(--team-srh-accent)",
    logo: "/images/teams/srh.svg",
    homeGround: "Rajiv Gandhi International Stadium, Hyderabad",
  },
  {
    id: "dc",
    name: "Delhi Capitals",
    abbr: "DC",
    primaryColor: "var(--team-dc-primary)",
    accentColor: "var(--team-dc-accent)",
    logo: "/images/teams/dc.svg",
    homeGround: "Arun Jaitley Stadium, Delhi",
  },
  {
    id: "pbks",
    name: "Punjab Kings",
    abbr: "PBKS",
    primaryColor: "var(--team-pbks-primary)",
    accentColor: "var(--team-pbks-accent)",
    logo: "/images/teams/pbks.svg",
    homeGround: "Mullanpur Stadium, Chandigarh",
  },
  {
    id: "rr",
    name: "Rajasthan Royals",
    abbr: "RR",
    primaryColor: "var(--team-rr-primary)",
    accentColor: "var(--team-rr-accent)",
    logo: "/images/teams/rr.svg",
    homeGround: "Sawai Mansingh Stadium, Jaipur",
  },
  {
    id: "lsg",
    name: "Lucknow Super Giants",
    abbr: "LSG",
    primaryColor: "var(--team-lsg-primary)",
    accentColor: "var(--team-lsg-accent)",
    logo: "/images/teams/lsg.svg",
    homeGround: "BRSABV Ekana Stadium, Lucknow",
  },
  {
    id: "gt",
    name: "Gujarat Titans",
    abbr: "GT",
    primaryColor: "var(--team-gt-primary)",
    accentColor: "var(--team-gt-accent)",
    logo: "/images/teams/gt.svg",
    homeGround: "Narendra Modi Stadium, Ahmedabad",
  },
];

export const TEAM_ALIASES: Record<string, string> = {
  DD: "DC",
  KXP: "PBKS",
  PK: "PBKS",
  PBKS: "PBKS",
  SH: "SRH",
  "Punjab Kings": "PBKS",
  "Kings XI Punjab": "PBKS",
  "Delhi Capitals": "DC",
  "Delhi Daredevils": "DC",
  "Royal Challengers Bengaluru": "RCB",
  "Royal Challengers Bangalore": "RCB",
  "Mumbai Indians": "MI",
  "Chennai Super Kings": "CSK",
  "Kolkata Knight Riders": "KKR",
  "Sunrisers Hyderabad": "SRH",
  "Rajasthan Royals": "RR",
  "Lucknow Super Giants": "LSG",
  "Gujarat Titans": "GT",
};

export const TEAM_MAP = IPL_TEAMS.reduce<Record<string, TeamIdentity>>((acc, team) => {
  acc[team.abbr] = team;
  acc[team.id] = team;
  acc[team.name] = team;
  return acc;
}, {});

export function normalizeTeamAbbr(value?: string | null) {
  if (!value) return "IPL";
  return TEAM_ALIASES[value] ?? value.toUpperCase();
}

export function getTeamByAbbr(value?: string | null) {
  return TEAM_MAP[normalizeTeamAbbr(value)] ?? null;
}
