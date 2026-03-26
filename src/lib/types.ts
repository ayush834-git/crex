export type MatchStatus = "live" | "upcoming" | "completed";

export interface TeamIdentity {
  id: string;
  name: string;
  abbr: string;
  primaryColor: string;
  accentColor: string;
  logo: string;
  homeGround: string;
}

export interface MatchSide {
  name: string;
  abbr: string;
  logo?: string;
  score?: string;
  shortScore?: string;
}

export interface CREXMatch {
  id: string;
  title?: string;
  status: MatchStatus;
  team1: MatchSide;
  team2: MatchSide;
  venue: string;
  startTime: string;
  updatedAt: string;
  currentInnings?: number;
  oversBowled?: string;
  result?: string;
  runRate?: string;
  note?: string;
  series?: string;
  source?: "live" | "static";
}

export interface PlayerStats {
  runs: number;
  average: number;
  strikeRate: number;
  wickets: number;
  economy: number;
  hundreds: number;
  fifties: number;
  dismissals: number;
  bestFigures?: string;
}

export interface CareerSeasonPoint {
  season: number;
  runs: number;
  wickets: number;
}

export interface CREXPlayer {
  id: string;
  name: string;
  cricsheetName: string;
  espnId: number;
  team: string;
  role: "Batsman" | "Bowler" | "All-rounder" | "Wicket-keeper";
  nationality: "Indian" | "Overseas";
  image?: string;
  teamColor: string;
  stats: PlayerStats;
  recentForm: number[];
  highlights: string[];
  active: boolean;
  countryFlag?: string;
  career: CareerSeasonPoint[];
  fantasyTag?: "Form Pick" | "Value Play" | "Captain Core";
}

export interface WinProbabilitySnapshot {
  matchId: string;
  team1: string;
  team2: string;
  team1WinPct: number;
  team2WinPct: number;
  updatedAt: string;
  reason: string;
}

export interface MomentumSeries {
  team: string;
  overs: number[];
  total: number;
  wickets: number;
}

export interface MomentumPayload {
  matchId: string;
  teams: [string, string];
  venue: string;
  innings: MomentumSeries[];
}

export interface FantasyPick {
  playerId: string;
  label: "Form Pick" | "Value Play" | "Captain Core" | "Differential";
  reason: string;
}

export interface PitchReport {
  venue: string;
  averageFirstInnings: number;
  chaseWinRate: number;
  conditions: string;
}

export interface AnalyticsPayload {
  winProbability: WinProbabilitySnapshot[];
  fantasyPicks: FantasyPick[];
  pitchReports: PitchReport[];
}

export interface PlayersResponse {
  players: CREXPlayer[];
  total: number;
  source: "live" | "static";
}
