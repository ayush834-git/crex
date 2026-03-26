import { getTeamByAbbr, normalizeTeamAbbr } from "@/lib/constants/teams";
import type { CREXMatch, CREXPlayer, MatchStatus, PlayerStats } from "@/lib/types";

function normalizeStatus(status?: string): MatchStatus {
  const value = (status ?? "").toLowerCase();
  if (value.includes("not started") || value.includes("upcoming")) return "upcoming";
  if (value.includes("won") || value.includes("completed") || value.includes("result") || value.includes("abandoned")) {
    return "completed";
  }
  return "live";
}

function formatScore(score?: { r?: number; w?: number; o?: number | string }) {
  if (!score || score.r === undefined) return undefined;
  const wickets = score.w ?? 0;
  const overs = score.o !== undefined ? ` (${score.o})` : "";
  return `${score.r}/${wickets}${overs}`;
}

export function transformMatch(raw: Record<string, unknown>): CREXMatch {
  const teams = Array.isArray(raw.teams) ? (raw.teams as string[]) : [];
  const teamInfo = Array.isArray(raw.teamInfo) ? (raw.teamInfo as Array<Record<string, unknown>>) : [];
  const scores = Array.isArray(raw.score) ? (raw.score as Array<Record<string, unknown>>) : [];

  const leftAbbr = normalizeTeamAbbr((teamInfo[0]?.shortname as string) ?? teams[0]);
  const rightAbbr = normalizeTeamAbbr((teamInfo[1]?.shortname as string) ?? teams[1]);
  const leftTeam = getTeamByAbbr(leftAbbr);
  const rightTeam = getTeamByAbbr(rightAbbr);

  return {
    id: String(raw.id ?? `${leftAbbr}-${rightAbbr}-${Date.now()}`),
    title: String(raw.name ?? `${leftAbbr} vs ${rightAbbr}`),
    status: normalizeStatus(raw.status as string | undefined),
    team1: {
      name: String(teamInfo[0]?.name ?? teams[0] ?? leftTeam?.name ?? "Team 1"),
      abbr: leftAbbr,
      logo: leftTeam?.logo,
      score: formatScore(scores[0]),
      shortScore: formatScore(scores[0])?.replace(/\s+\(.+\)$/, ""),
    },
    team2: {
      name: String(teamInfo[1]?.name ?? teams[1] ?? rightTeam?.name ?? "Team 2"),
      abbr: rightAbbr,
      logo: rightTeam?.logo,
      score: formatScore(scores[1]),
      shortScore: formatScore(scores[1])?.replace(/\s+\(.+\)$/, ""),
    },
    venue: String(raw.venue ?? leftTeam?.homeGround ?? "Venue TBC"),
    startTime: String(raw.dateTimeGMT ?? raw.date ?? new Date().toISOString()),
    updatedAt: new Date().toISOString(),
    currentInnings: typeof raw.currentInnings === "number" ? raw.currentInnings : undefined,
    oversBowled:
      typeof scores[1]?.o === "number" || typeof scores[1]?.o === "string" ? String(scores[1]?.o) : undefined,
    result: typeof raw.status === "string" ? raw.status : undefined,
    runRate: typeof raw.runRate === "string" ? raw.runRate : undefined,
    note: typeof raw.matchStarted === "boolean" && !raw.matchStarted ? "Starts shortly" : undefined,
    series: typeof raw.series === "string" ? raw.series : "IPL 2026",
    source: "live",
  };
}

export function mapRole(value?: string | null): CREXPlayer["role"] {
  switch ((value ?? "").toUpperCase()) {
    case "BATTER":
    case "BATSMAN":
      return "Batsman";
    case "BOWLER":
      return "Bowler";
    case "ALLROUNDER":
    case "ALL-ROUNDER":
      return "All-rounder";
    case "WICKETKEEPER":
    case "WK":
      return "Wicket-keeper";
    default:
      return "Batsman";
  }
}

export function normalizeStats(stats?: Partial<PlayerStats> | null): PlayerStats {
  return {
    runs: Number(stats?.runs ?? 0),
    average: Number(stats?.average ?? 0),
    strikeRate: Number(stats?.strikeRate ?? 0),
    wickets: Number(stats?.wickets ?? 0),
    economy: Number(stats?.economy ?? 0),
    hundreds: Number(stats?.hundreds ?? 0),
    fifties: Number(stats?.fifties ?? 0),
    dismissals: Number(stats?.dismissals ?? 0),
    bestFigures: stats?.bestFigures ?? undefined,
  };
}

export function normalizePlayerRecord(raw: Record<string, unknown>): CREXPlayer {
  const teamValue =
    (typeof raw.team === "string" && raw.team) ||
    (typeof raw.teamShort === "string" && raw.teamShort) ||
    (typeof raw.teamName === "string" && raw.teamName) ||
    "";
  const teamAbbr = teamValue ? normalizeTeamAbbr(String(teamValue)) : "IPL";
  const team = getTeamByAbbr(teamAbbr);
  const recentFormRaw = Array.isArray(raw.recentForm) ? raw.recentForm : [];
  const careerRaw = Array.isArray(raw.career) ? raw.career : [];
  const image =
    (typeof raw.image === "string" && raw.image) ||
    (typeof raw.playerImg === "string" && raw.playerImg) ||
    (typeof raw.img === "string" && raw.img) ||
    (typeof raw.imageUrl === "string" && raw.imageUrl) ||
    undefined;
  const nationality =
    typeof raw.nationality === "string"
      ? raw.nationality
      : typeof raw.country === "string"
        ? raw.country
        : undefined;

  return {
    id: String(raw.id ?? raw.name ?? "player")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, ""),
    name: String(raw.name ?? "Unknown Player"),
    cricsheetName: String(raw.cricsheetName ?? raw.name ?? "Unknown Player"),
    espnId: Number(raw.espnId ?? 0),
    team: teamAbbr,
    role: mapRole(String(raw.role ?? "")),
    nationality:
      nationality && nationality !== "India" && nationality !== "Indian"
        ? "Overseas"
        : raw.nationality === "Overseas"
          ? "Overseas"
          : "Indian",
    image,
    teamColor: team?.primaryColor ?? "var(--crex-accent)",
    stats: normalizeStats(raw.stats as Partial<PlayerStats> | null),
    recentForm: recentFormRaw.map((value) => Number(value ?? 0)).slice(0, 5),
    highlights: Array.isArray(raw.highlights) ? raw.highlights.map(String) : [],
    active: raw.active !== false,
    countryFlag: typeof raw.countryFlag === "string" ? raw.countryFlag : undefined,
    career: careerRaw.map((entry) => ({
      season: Number((entry as Record<string, unknown>).season ?? 0),
      runs: Number((entry as Record<string, unknown>).runs ?? 0),
      wickets: Number((entry as Record<string, unknown>).wickets ?? 0),
    })),
    fantasyTag: raw.fantasyTag === "Value Play" || raw.fantasyTag === "Captain Core" ? raw.fantasyTag : "Form Pick",
  };
}
