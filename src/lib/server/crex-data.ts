import "server-only";

import momentumJson from "../../../public/data/match-momentum.json";
import { fetchFromCricAPI } from "@/lib/api/cricapi";
import { FALLBACK_ANALYTICS, FALLBACK_MATCHES, FALLBACK_PLAYERS, getPitchReport } from "@/lib/fallback-data";
import { clampNumber } from "@/lib/format";
import { getTeamByAbbr, IPL_TEAMS, normalizeTeamAbbr } from "@/lib/constants/teams";
import { normalizePlayerRecord, transformMatch } from "@/lib/api/transforms";
import type {
  CREXMatch,
  CREXPlayer,
  FantasyPick,
  MatchStatus,
  MomentumPayload,
  PitchReport,
  PlayersResponse,
  WinProbabilitySnapshot,
} from "@/lib/types";

const IPL_SERIES_ID = process.env.CRICAPI_IPL_SERIES_ID ?? process.env.IPL_SERIES_ID ?? "";
const LIVE_REVALIDATE = Number(process.env.REVALIDATE_INTERVAL ?? "30");
const PLAYER_REVALIDATE = 60 * 60;
const TEAM_ABBRS = new Set(IPL_TEAMS.map((team) => team.abbr));

type PlayerFilters = {
  query?: string;
  team?: string[];
  role?: string[];
  nationality?: string[];
  page?: number;
  limit?: number;
};

function extractRecords(payload: unknown): Record<string, unknown>[] {
  if (Array.isArray(payload)) return payload as Record<string, unknown>[];
  if (!payload || typeof payload !== "object") return [];

  const data = (payload as { data?: unknown }).data;
  if (Array.isArray(data)) return data as Record<string, unknown>[];
  if (data && typeof data === "object") return [data as Record<string, unknown>];

  return [];
}

function extractRecord(payload: unknown) {
  return extractRecords(payload)[0] ?? null;
}

function normalizeNameKey(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "");
}

function uniqueById<T extends { id: string }>(items: T[]) {
  const deduped = new Map<string, T>();
  items.forEach((item) => {
    if (!deduped.has(item.id)) deduped.set(item.id, item);
  });
  return Array.from(deduped.values());
}

function extractTeamTokens(raw: Record<string, unknown>) {
  const teamInfo = Array.isArray(raw.teamInfo) ? (raw.teamInfo as Array<Record<string, unknown>>) : [];
  const teams = Array.isArray(raw.teams) ? (raw.teams as string[]) : [];

  return [
    ...teams,
    ...teamInfo.flatMap((team) => [String(team.shortname ?? ""), String(team.name ?? "")]),
  ]
    .map((value) => value.trim())
    .filter(Boolean);
}

function isLikelyIPLMatch(raw: Record<string, unknown>) {
  const seriesFields = [
    raw.series,
    raw.seriesName,
    raw.name,
    raw.matchType,
    raw.competition,
  ]
    .map((value) => String(value ?? "").toLowerCase())
    .join(" ");

  if (seriesFields.includes("indian premier league") || /\bipl\b/.test(seriesFields)) {
    return true;
  }

  const teams = extractTeamTokens(raw)
    .map((value) => normalizeTeamAbbr(value))
    .filter((value) => TEAM_ABBRS.has(value));

  return new Set(teams).size >= 2;
}

function sortMatches(matches: CREXMatch[], status?: MatchStatus) {
  const direction = status === "completed" ? -1 : 1;
  return [...matches].sort((left, right) => {
    const leftTime = new Date(left.startTime).getTime();
    const rightTime = new Date(right.startTime).getTime();
    return (leftTime - rightTime) * direction;
  });
}

function getFallbackMatches(status?: MatchStatus, limit?: number) {
  const filtered = status ? FALLBACK_MATCHES.filter((match) => match.status === status) : FALLBACK_MATCHES;
  const sorted = sortMatches(filtered, status);
  return limit ? sorted.slice(0, limit) : sorted;
}

function filterPlayers(players: CREXPlayer[], filters: PlayerFilters) {
  const query = filters.query?.trim().toLowerCase() ?? "";
  const teams = filters.team ?? [];
  const roles = filters.role ?? [];
  const nationalities = filters.nationality ?? [];

  return players.filter((player) => {
    if (query && !player.name.toLowerCase().includes(query)) return false;
    if (teams.length && !teams.includes(player.team)) return false;
    if (roles.length && !roles.includes(player.role)) return false;
    if (nationalities.length && !nationalities.includes(player.nationality)) return false;
    return true;
  });
}

function fallbackPlayersResponse(filters: PlayerFilters): PlayersResponse {
  const filtered = filterPlayers(FALLBACK_PLAYERS, filters);
  const page = filters.page ?? 1;
  const limit = filters.limit ?? filtered.length;
  const offset = (page - 1) * limit;

  return {
    players: filtered.slice(offset, offset + limit),
    total: filtered.length,
    source: "static",
  };
}

async function safeFetchCricAPI(
  endpoint: string,
  params: Record<string, string | number | undefined> = {},
  revalidate = LIVE_REVALIDATE
) {
  try {
    return await fetchFromCricAPI(endpoint, { offset: 0, ...params }, revalidate);
  } catch {
    return null;
  }
}

async function fetchLiveMatchesPool() {
  const commonParams = IPL_SERIES_ID ? { series_id: IPL_SERIES_ID } : {};
  const [currentPayload, matchesPayload] = await Promise.all([
    safeFetchCricAPI("/currentMatches", commonParams, LIVE_REVALIDATE),
    safeFetchCricAPI("/matches", commonParams, LIVE_REVALIDATE),
  ]);

  const transformed = [...extractRecords(currentPayload), ...extractRecords(matchesPayload)]
    .filter(isLikelyIPLMatch)
    .map(transformMatch);

  return uniqueById(transformed);
}

function mergeMatch(primary: CREXMatch, fallback?: CREXMatch | null): CREXMatch {
  if (!fallback) return primary;
  return {
    ...fallback,
    ...primary,
    team1: { ...fallback.team1, ...primary.team1 },
    team2: { ...fallback.team2, ...primary.team2 },
    venue: primary.venue || fallback.venue,
    note: primary.note || fallback.note,
    result: primary.result || fallback.result,
    source: primary.source ?? fallback.source,
  };
}

function parseScore(score?: string) {
  if (!score) return null;
  const match = score.match(/(\d+)\s*\/\s*(\d+)(?:\s*\(([\d.]+)\))?/);
  if (!match) return null;
  return {
    runs: Number(match[1]),
    wickets: Number(match[2]),
    overs: match[3] ? Number(match[3]) : undefined,
  };
}

function normalizeMomentumPayload(row?: Record<string, unknown> | null): MomentumPayload | null {
  if (!row) return null;
  const innings = Array.isArray(row.innings) ? row.innings : [];
  if (!innings.length) return null;

  return {
    matchId: String(row.matchId ?? "fallback-match"),
    teams: [
      String((row.teams as string[] | undefined)?.[0] ?? "Team 1"),
      String((row.teams as string[] | undefined)?.[1] ?? "Team 2"),
    ],
    venue: String(row.venue ?? "Venue TBC"),
    innings: innings.map((entry) => {
      const item = entry as Record<string, unknown>;
      return {
        team: String(item.team ?? "Team"),
        overs: Array.isArray(item.overs) ? item.overs.map((value) => Number(value ?? 0)) : [],
        total: Number(item.total ?? 0),
        wickets: Number(item.wickets ?? 0),
      };
    }),
  };
}

function teamStrength(teamAbbr: string) {
  const squad = FALLBACK_PLAYERS.filter((player) => player.team === teamAbbr && player.active);
  if (!squad.length) return 50;

  const rating = squad
    .slice(0, 11)
    .reduce((total, player) => total + player.stats.runs / 250 + player.stats.wickets * 1.9 + player.recentForm.reduce((a, b) => a + b, 0) / 30, 0);

  return rating / Math.max(1, Math.min(11, squad.length));
}

function derivePreMatchProbability(match: CREXMatch) {
  const team1Strength = teamStrength(match.team1.abbr);
  const team2Strength = teamStrength(match.team2.abbr);
  const raw = 50 + (team1Strength - team2Strength) * 2.4;
  const team1WinPct = clampNumber(Math.round(raw), 35, 65);

  return {
    team1WinPct,
    team2WinPct: 100 - team1WinPct,
    reason: `${match.team1.abbr} hold a slight edge based on active-squad production and recent form trends.`,
  };
}

function deriveLiveProbability(match: CREXMatch) {
  const left = parseScore(match.team1.score);
  const right = parseScore(match.team2.score);

  if (!left && !right) {
    return {
      team1WinPct: 50,
      team2WinPct: 50,
      reason: "Analysis pending while live scoring stabilizes.",
    };
  }

  if (left && !right) {
    const overs = left.overs ?? 0;
    const parAtOvers = overs > 0 ? overs * 8.4 : 160;
    const raw = 50 + (left.runs - parAtOvers) * 0.45 - left.wickets * 2.5;
    const team1WinPct = clampNumber(Math.round(raw), 18, 82);
    return {
      team1WinPct,
      team2WinPct: 100 - team1WinPct,
      reason: `${match.team1.abbr} are setting the pace in the first innings with ${left.runs}/${left.wickets}.`,
    };
  }

  if (left && right) {
    const target = left.runs + 1;
    const runsNeeded = Math.max(0, target - right.runs);
    const oversBowled = right.overs ?? parseFloat(match.oversBowled ?? "0");
    const ballsRemaining = Math.max(0, Math.round((20 - oversBowled) * 6));
    const wicketsRemaining = Math.max(0, 10 - right.wickets);
    const requiredRate = ballsRemaining > 0 ? (runsNeeded * 6) / ballsRemaining : runsNeeded > 0 ? 99 : 0;
    const currentRate = oversBowled > 0 ? right.runs / oversBowled : 0;
    const chaseAdvantage = currentRate - requiredRate;
    const rawTeam2 = 50 + chaseAdvantage * 7 + wicketsRemaining * 1.6 - runsNeeded * 0.12;
    const team2WinPct = clampNumber(Math.round(rawTeam2), 5, 95);

    return {
      team1WinPct: 100 - team2WinPct,
      team2WinPct,
      reason:
        runsNeeded > 0
          ? `${match.team2.abbr} need ${runsNeeded} from ${ballsRemaining} balls with ${wicketsRemaining} wickets in hand.`
          : `${match.team2.abbr} are ahead on the chase at ${right.runs}/${right.wickets}.`,
    };
  }

  return {
    team1WinPct: 50,
    team2WinPct: 50,
    reason: "Analysis pending while live scoring stabilizes.",
  };
}

function mapMomentumFallback(match: CREXMatch): MomentumPayload {
  const fallbackRows = momentumJson as unknown as Array<Record<string, unknown>>;
  const fallback = normalizeMomentumPayload(fallbackRows.find((item) => String(item.matchId ?? "") === match.id) ?? fallbackRows[0]);
  if (fallback) return fallback;

  const team1Score = parseScore(match.team1.score);
  const team2Score = parseScore(match.team2.score);
  return {
    matchId: match.id,
    teams: [match.team1.abbr, match.team2.abbr],
    venue: match.venue,
    innings: [
      {
        team: match.team1.abbr,
        overs: [],
        total: team1Score?.runs ?? 0,
        wickets: team1Score?.wickets ?? 6,
      },
      {
        team: match.team2.abbr,
        overs: [],
        total: team2Score?.runs ?? 0,
        wickets: team2Score?.wickets ?? 6,
      },
    ],
  };
}

function scoreFantasyPlayer(player: CREXPlayer, pitchReport: PitchReport) {
  const recentForm = player.recentForm.reduce((total, innings) => total + innings, 0) / Math.max(1, player.recentForm.length);
  const battingValue = player.stats.runs / 140 + player.stats.strikeRate / 9 + player.stats.average;
  const bowlingValue = player.stats.wickets * 5 + Math.max(0, 10 - player.stats.economy) * 7;
  const roleBoost =
    player.role === "All-rounder"
      ? 35
      : player.role === "Wicket-keeper"
        ? 18
        : player.role === "Bowler"
          ? pitchReport.chaseWinRate < 50
            ? 28
            : 20
          : 22;

  return recentForm + battingValue + bowlingValue + roleBoost;
}

function labelFantasyPick(player: CREXPlayer) {
  if ((player.fantasyTag ?? "") === "Captain Core") return "Captain Core" as const;
  if ((player.fantasyTag ?? "") === "Value Play") return "Value Play" as const;
  return "Form Pick" as const;
}

async function fetchLivePlayerCandidate(name: string) {
  const payload = await safeFetchCricAPI("/players", { search: name }, PLAYER_REVALIDATE);
  const records = extractRecords(payload);
  if (!records.length) return null;

  const nameKey = normalizeNameKey(name);
  return (
    records.find((item) => normalizeNameKey(String(item.name ?? "")) === nameKey) ??
    records.find((item) => normalizeNameKey(String(item.name ?? "")).includes(nameKey)) ??
    records[0]
  );
}

function mergePlayer(base: CREXPlayer | null, incoming: CREXPlayer | null) {
  if (!incoming) return base;
  if (!base) return incoming;

  const incomingStats = incoming.stats;
  const stats = {
    runs: incomingStats.runs || base.stats.runs,
    average: incomingStats.average || base.stats.average,
    strikeRate: incomingStats.strikeRate || base.stats.strikeRate,
    wickets: incomingStats.wickets || base.stats.wickets,
    economy: incomingStats.economy || base.stats.economy,
    hundreds: incomingStats.hundreds || base.stats.hundreds,
    fifties: incomingStats.fifties || base.stats.fifties,
    dismissals: incomingStats.dismissals || base.stats.dismissals,
    bestFigures: incomingStats.bestFigures || base.stats.bestFigures,
  };

  return {
    ...base,
    ...incoming,
    id: base.id,
    team: incoming.team !== "IPL" ? incoming.team : base.team,
    nationality: incoming.nationality ?? base.nationality,
    image: incoming.image ?? base.image,
    teamColor: incoming.team !== "IPL" ? getTeamByAbbr(incoming.team)?.primaryColor ?? base.teamColor : base.teamColor,
    stats,
    highlights: incoming.highlights.length ? incoming.highlights : base.highlights,
    career: incoming.career.length ? incoming.career : base.career,
    fantasyTag: incoming.fantasyTag ?? base.fantasyTag,
  };
}

async function fetchLivePlayerProfile(base: CREXPlayer | null, fallbackName: string) {
  const candidate = await fetchLivePlayerCandidate(fallbackName);
  if (!candidate) return base;

  const liveSummary = normalizePlayerRecord(candidate);
  const rawPlayerId = candidate.id ?? candidate.playerId ?? candidate.idPlayer;
  const playerId =
    typeof rawPlayerId === "string" || typeof rawPlayerId === "number" ? rawPlayerId : null;
  if (!playerId) return mergePlayer(base, liveSummary);

  const detailPayload = await safeFetchCricAPI("/players_info", { id: playerId }, PLAYER_REVALIDATE);
  const detail = extractRecord(detailPayload);
  const liveDetail = detail ? normalizePlayerRecord(detail) : null;
  return mergePlayer(mergePlayer(base, liveSummary), liveDetail);
}

export async function getMatches(status?: MatchStatus, limit?: number) {
  const liveMatches = await fetchLiveMatchesPool();

  // Merge strategy: live API data takes priority, but we keep fallback
  // historical matches (completed) so the "Recent" tab is never empty.
  const liveIds = new Set(liveMatches.map((m) => m.id));
  const fallbackCompleted = FALLBACK_MATCHES
    .filter((m) => m.status === "completed" && !liveIds.has(m.id));
  const merged = uniqueById([...liveMatches, ...fallbackCompleted]);

  const pool = merged.length ? merged : FALLBACK_MATCHES;
  const source: "live" | "static" = liveMatches.length ? "live" : "static";

  const filtered = status ? pool.filter((m) => m.status === status) : pool;

  // If live API returned matches but none match the requested status,
  // and fallback has matches for that status, use those.
  if (filtered.length === 0 && status) {
    const fallbackForStatus = getFallbackMatches(status, limit);
    return { matches: fallbackForStatus, source: "static" as const };
  }

  const sorted = sortMatches(filtered, status);
  return {
    matches: limit ? sorted.slice(0, limit) : sorted,
    source,
  };
}

export async function getMatch(id: string) {
  const fallback = FALLBACK_MATCHES.find((match) => match.id === id) ?? null;
  const [matchInfoPayload, scorecardPayload] = await Promise.all([
    safeFetchCricAPI("/match_info", { id }, LIVE_REVALIDATE),
    safeFetchCricAPI("/match_scorecard", { id }, LIVE_REVALIDATE),
  ]);

  const matchInfo = extractRecord(matchInfoPayload);
  const scorecard = extractRecord(scorecardPayload);

  if (!matchInfo && !scorecard) {
    return fallback ?? FALLBACK_MATCHES[0];
  }

  const mergedRaw = {
    ...(matchInfo ?? {}),
    ...(scorecard ?? {}),
    score: (scorecard as { score?: unknown } | null)?.score ?? (matchInfo as { score?: unknown } | null)?.score,
    teamInfo: (matchInfo as { teamInfo?: unknown } | null)?.teamInfo ?? (scorecard as { teamInfo?: unknown } | null)?.teamInfo,
    teams: (matchInfo as { teams?: unknown } | null)?.teams ?? (scorecard as { teams?: unknown } | null)?.teams,
  } satisfies Record<string, unknown>;

  return mergeMatch({ ...transformMatch(mergedRaw), source: "live" }, fallback);
}

export async function getPlayers(filters: PlayerFilters = {}): Promise<PlayersResponse> {
  const fallback = fallbackPlayersResponse(filters);
  const query = filters.query?.trim();

  if (!query) return fallback;

  const liveCandidate = await fetchLivePlayerCandidate(query);
  if (!liveCandidate) return fallback;

  const livePlayer = normalizePlayerRecord(liveCandidate);
  const matchingStatic = FALLBACK_PLAYERS.find((player) => normalizeNameKey(player.name) === normalizeNameKey(livePlayer.name));
  const mergedPlayer = mergePlayer(matchingStatic ?? null, livePlayer);
  const sourcePlayers = mergedPlayer
    ? uniqueById([
        mergedPlayer,
        ...FALLBACK_PLAYERS.filter((player) => player.id !== mergedPlayer.id),
      ])
    : FALLBACK_PLAYERS;

  const filtered = filterPlayers(sourcePlayers, filters);
  const page = filters.page ?? 1;
  const limit = filters.limit ?? filtered.length;
  const offset = (page - 1) * limit;

  return {
    players: filtered.slice(offset, offset + limit),
    total: filtered.length,
    source: "live",
  };
}

export async function getPlayer(id: string) {
  const fallback = FALLBACK_PLAYERS.find((player) => player.id === id) ?? null;
  const searchName = fallback?.name ?? id.split("-").map((part) => `${part[0]?.toUpperCase() ?? ""}${part.slice(1)}`).join(" ");

  const player = await fetchLivePlayerProfile(fallback, searchName);
  return player ?? fallback;
}

export async function getWinProbability(matchId?: string): Promise<WinProbabilitySnapshot> {
  const liveMatchPool = await getMatches("live", 1);
  const upcomingPool = await getMatches("upcoming", 1);
  const match = matchId ? await getMatch(matchId) : liveMatchPool.matches[0] ?? upcomingPool.matches[0] ?? FALLBACK_MATCHES[0];
  const fallbackSnapshot = FALLBACK_ANALYTICS.winProbability.find((item) => item.matchId === match.id) ?? FALLBACK_ANALYTICS.winProbability[0];

  if (!match) return fallbackSnapshot;

  const computed =
    match.status === "live"
      ? deriveLiveProbability(match)
      : derivePreMatchProbability(match);

  return {
    matchId: match.id,
    team1: match.team1.abbr,
    team2: match.team2.abbr,
    updatedAt: new Date().toISOString(),
    ...computed,
  };
}

export async function getMomentum(matchId?: string): Promise<MomentumPayload> {
  const liveMatchPool = await getMatches("live", 1);
  const upcomingPool = await getMatches("upcoming", 1);
  const match = matchId ? await getMatch(matchId) : liveMatchPool.matches[0] ?? upcomingPool.matches[0] ?? FALLBACK_MATCHES[0];

  if (!match) {
    const fallbackRows = momentumJson as unknown as Array<Record<string, unknown>>;
    return normalizeMomentumPayload(fallbackRows[0]) ?? fallbackMomentumFromMatches();
  }

  return mapMomentumFallback(match);
}

export async function getFantasyPicks(matchId?: string): Promise<FantasyPick[]> {
  const liveMatchPool = await getMatches("live", 1);
  const upcomingPool = await getMatches("upcoming", 1);
  const match = matchId ? await getMatch(matchId) : liveMatchPool.matches[0] ?? upcomingPool.matches[0] ?? FALLBACK_MATCHES[0];

  if (!match) return FALLBACK_ANALYTICS.fantasyPicks;

  const pitchReport = getPitchReport(match.venue);
  const teamPlayers = FALLBACK_PLAYERS.filter((player) => player.team === match.team1.abbr || player.team === match.team2.abbr).filter((player) => player.active);

  if (!teamPlayers.length) return FALLBACK_ANALYTICS.fantasyPicks;

  return [...teamPlayers]
    .sort((left, right) => scoreFantasyPlayer(right, pitchReport) - scoreFantasyPlayer(left, pitchReport))
    .slice(0, 11)
    .map((player) => ({
      playerId: player.id,
      label: labelFantasyPick(player),
      reason: `${player.name} profiles well for ${match.venue} with recent form of ${player.recentForm.join(", ")}.`,
    }));
}

export async function getPitchReportForVenue(venue?: string) {
  return getPitchReport(venue);
}

function fallbackMomentumFromMatches(): MomentumPayload {
  const fallbackRows = momentumJson as unknown as Array<Record<string, unknown>>;
  return normalizeMomentumPayload(fallbackRows[0]) ?? {
    matchId: FALLBACK_MATCHES[0].id,
    teams: [FALLBACK_MATCHES[0].team1.abbr, FALLBACK_MATCHES[0].team2.abbr],
    venue: FALLBACK_MATCHES[0].venue,
    innings: [
      { team: FALLBACK_MATCHES[0].team1.abbr, overs: [], total: 0, wickets: 0 },
      { team: FALLBACK_MATCHES[0].team2.abbr, overs: [], total: 0, wickets: 0 },
    ],
  };
}
