import teamsJson from "../../public/data/teams.json";
import matchesJson from "../../public/data/matches.json";
import analyticsJson from "../../public/data/analytics.json";
import playersJson from "../../public/data/players.json";
import type {
  AnalyticsPayload,
  CREXMatch,
  CREXPlayer,
  PitchReport,
  TeamIdentity,
  WinProbabilitySnapshot,
} from "@/lib/types";

export const FALLBACK_TEAMS = teamsJson as TeamIdentity[];
export const FALLBACK_MATCHES = matchesJson as CREXMatch[];
export const FALLBACK_ANALYTICS = analyticsJson as AnalyticsPayload;
export const FALLBACK_PLAYERS = playersJson as CREXPlayer[];

export const FEATURED_PLAYER_SPOTLIGHT = FALLBACK_PLAYERS.slice(0, 4);

export function getPlayerById(id: string) {
  return FALLBACK_PLAYERS.find((player) => player.id === id) ?? null;
}

export function getWinProbability(matchId?: string) {
  if (!matchId) return FALLBACK_ANALYTICS.winProbability[0] as WinProbabilitySnapshot;
  return FALLBACK_ANALYTICS.winProbability.find((item) => item.matchId === matchId) ?? FALLBACK_ANALYTICS.winProbability[0];
}

export function getPitchReport(venue?: string) {
  return FALLBACK_ANALYTICS.pitchReports.find((item) => item.venue === venue) ?? FALLBACK_ANALYTICS.pitchReports[0] ?? ({} as PitchReport);
}
