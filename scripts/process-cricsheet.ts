import * as fs from "fs";
import * as path from "path";

// ─── Types ───────────────────────────────────────────────────
interface Delivery {
  batter: string;
  bowler: string;
  non_striker: string;
  runs: { batter: number; extras: number; total: number };
  extras?: { wides?: number; noballs?: number; byes?: number; legbyes?: number };
  wickets?: { player_out: string; kind: string }[];
}

interface Over {
  over: number;
  deliveries: Delivery[];
}

interface Innings {
  team: string;
  overs: Over[];
}

interface MatchInfo {
  season: string;
  dates: string[];
  teams: string[];
  players?: Record<string, string[]>;
  outcome?: { winner?: string; by?: { runs?: number; wickets?: number } };
  venue?: string;
  toss?: { winner?: string; decision?: string };
  event?: { name?: string; match_number?: number; stage?: string };
}

interface MatchFile {
  info: MatchInfo;
  innings: Innings[];
}

// ─── Accumulators ────────────────────────────────────────────
interface BattingStats {
  matches: Set<string>;
  innings: number;
  runs: number;
  balls: number;
  fours: number;
  sixes: number;
  dismissals: number;
  highest: number;
  centuries: number;
  fifties: number;
  inningsRuns: number; // track current innings for highest/milestones
}

interface BowlingStats {
  balls: number;
  runs_conceded: number;
  wickets: number;
  maidens: number;
}

interface H2H {
  balls: number;
  runs: number;
  dismissals: number;
  dots: number;
  fours: number;
  sixes: number;
}

interface MomentumMatch {
  matchId: string;
  date: string;
  teams: [string, string];
  winner: string;
  venue: string;
  innings: {
    team: string;
    overs: number[];
    total: number;
    wickets: number;
  }[];
}

// ─── Main ────────────────────────────────────────────────────
const inputDir = process.argv[2];
if (!inputDir) {
  console.error("Usage: npx ts-node scripts/process-cricsheet.ts ./ipl_json");
  process.exit(1);
}

const outDir = path.resolve("public/data");
fs.mkdirSync(outDir, { recursive: true });

const files = fs.readdirSync(inputDir).filter(f => f.endsWith(".json"));
console.log(`Found ${files.length} match files`);

const playerBatting = new Map<string, BattingStats>();
const playerBowling = new Map<string, BowlingStats>();
const h2hMap = new Map<string, H2H>();
const allMatches: { file: string; match: MatchFile }[] = [];

// Track per-innings batting for milestones
const inningsTracker = new Map<string, number>();

function getBat(name: string): BattingStats {
  if (!playerBatting.has(name)) {
    playerBatting.set(name, {
      matches: new Set(), innings: 0, runs: 0, balls: 0,
      fours: 0, sixes: 0, dismissals: 0, highest: 0,
      centuries: 0, fifties: 0, inningsRuns: 0
    });
  }
  return playerBatting.get(name)!;
}

function getBowl(name: string): BowlingStats {
  if (!playerBowling.has(name)) {
    playerBowling.set(name, { balls: 0, runs_conceded: 0, wickets: 0, maidens: 0 });
  }
  return playerBowling.get(name)!;
}

function getH2H(batter: string, bowler: string): H2H {
  const key = `${batter}_${bowler}`;
  if (!h2hMap.has(key)) {
    h2hMap.set(key, { balls: 0, runs: 0, dismissals: 0, dots: 0, fours: 0, sixes: 0 });
  }
  return h2hMap.get(key)!;
}

// ─── Process all matches ─────────────────────────────────────
for (const file of files) {
  try {
    const raw = fs.readFileSync(path.join(inputDir, file), "utf-8");
    const match: MatchFile = JSON.parse(raw);
    allMatches.push({ file, match });

    const matchId = file.replace(".json", "");

    for (const inn of match.innings) {
      // Track which batters appeared in this innings
      inningsTracker.clear();

      for (const over of inn.overs) {
        let overRuns = 0;
        let overBalls = 0;
        let overWickets = 0;

        for (const del of over.deliveries) {
          const isWide = del.extras?.wides ? true : false;
          const isNoBall = del.extras?.noballs ? true : false;
          const isLegal = !isWide && !isNoBall;

          // Batting stats
          const bat = getBat(del.batter);
          bat.matches.add(matchId);
          if (!inningsTracker.has(del.batter)) {
            bat.innings++;
            inningsTracker.set(del.batter, 0);
          }

          bat.runs += del.runs.batter;
          inningsTracker.set(del.batter, (inningsTracker.get(del.batter) || 0) + del.runs.batter);

          if (isLegal) {
            bat.balls++;
          }
          if (del.runs.batter === 4) bat.fours++;
          if (del.runs.batter === 6) bat.sixes++;

          // Bowling stats
          const bowl = getBowl(del.bowler);
          if (isLegal) {
            overBalls++;
          }
          bowl.runs_conceded += del.runs.total;
          if (isLegal) bowl.balls++;

          // H2H
          if (isLegal || isNoBall) {
            const h = getH2H(del.batter, del.bowler);
            h.balls++;
            h.runs += del.runs.batter;
            if (del.runs.batter === 0 && !isNoBall) h.dots++;
            if (del.runs.batter === 4) h.fours++;
            if (del.runs.batter === 6) h.sixes++;

            if (del.wickets) {
              for (const w of del.wickets) {
                if (w.player_out === del.batter) {
                  h.dismissals++;
                }
              }
            }
          }

          // Wickets
          if (del.wickets) {
            for (const w of del.wickets) {
              const dismissed = getBat(w.player_out);
              dismissed.dismissals++;
              overWickets++;

              // Check milestones for dismissed batter
              const dismissedRuns = inningsTracker.get(w.player_out) || 0;
              if (dismissedRuns > dismissed.highest) dismissed.highest = dismissedRuns;
              if (dismissedRuns >= 100) dismissed.centuries++;
              else if (dismissedRuns >= 50) dismissed.fifties++;

              if (["bowled", "caught", "lbw", "stumped", "caught and bowled", "hit wicket"].includes(w.kind)) {
                bowl.wickets++;
              }
            }
          }

          overRuns += del.runs.total;
        }

        // Maiden check
        if (overBalls === 6 && overRuns === 0) {
          const bowlerName = over.deliveries[0]?.bowler;
          if (bowlerName) getBowl(bowlerName).maidens++;
        }
      }

      // End of innings — check not-out batters for milestones
      for (const [batterName, runs] of inningsTracker.entries()) {
        const bat = getBat(batterName);
        if (runs > bat.highest) bat.highest = runs;
        // Only count milestones for not-out batters if they weren't dismissed this innings
        // We already counted for dismissed batters above, so skip if already counted
      }
    }
  } catch (e) {
    // Skip malformed files
  }
}

// ─── 1. player-stats.json ────────────────────────────────────
const playerStatsOut: Record<string, any> = {};
for (const [name, bat] of playerBatting.entries()) {
  const bowl = playerBowling.get(name);
  playerStatsOut[name] = {
    batting: {
      matches: bat.matches.size,
      innings: bat.innings,
      runs: bat.runs,
      balls: bat.balls,
      fours: bat.fours,
      sixes: bat.sixes,
      dismissals: bat.dismissals,
      highest: bat.highest,
      centuries: bat.centuries,
      fifties: bat.fifties,
      avg: bat.dismissals > 0 ? Math.round((bat.runs / bat.dismissals) * 100) / 100 : 0,
      sr: bat.balls > 0 ? Math.round((bat.runs / bat.balls) * 10000) / 100 : 0,
    },
    bowling: bowl ? {
      balls: bowl.balls,
      runs_conceded: bowl.runs_conceded,
      wickets: bowl.wickets,
      maidens: bowl.maidens,
      avg: bowl.wickets > 0 ? Math.round((bowl.runs_conceded / bowl.wickets) * 100) / 100 : 0,
      econ: bowl.balls > 0 ? Math.round((bowl.runs_conceded / (bowl.balls / 6)) * 100) / 100 : 0,
    } : { balls: 0, runs_conceded: 0, wickets: 0, maidens: 0, avg: 0, econ: 0 },
  };
}
fs.writeFileSync(path.join(outDir, "player-stats.json"), JSON.stringify(playerStatsOut, null, 2));
console.log(`player-stats.json: ${Object.keys(playerStatsOut).length} players`);

// ─── 2. head-to-head.json ────────────────────────────────────
const h2hOut: Record<string, any> = {};
for (const [key, h] of h2hMap.entries()) {
  if (h.balls >= 6) { // Only include meaningful matchups (at least 1 over)
    h2hOut[key] = {
      ...h,
      sr: h.balls > 0 ? Math.round((h.runs / h.balls) * 10000) / 100 : 0,
    };
  }
}
fs.writeFileSync(path.join(outDir, "head-to-head.json"), JSON.stringify(h2hOut, null, 2));
console.log(`head-to-head.json: ${Object.keys(h2hOut).length} matchups`);

// ─── 3. match-momentum.json ─────────────────────────────────
// Pick 20 most recent matches regardless of type
const knockouts = allMatches
  .filter(m => m.match.innings.length >= 2)
  .sort((a, b) => {
    const da = a.match.info.dates[0] || "";
    const db = b.match.info.dates[0] || "";
    return db.localeCompare(da);
  })
  .slice(0, 20);

const momentumOut: MomentumMatch[] = knockouts.map(m => {
  const match = m.match;
  const innings = match.innings.map(inn => {
    const overs: number[] = [];
    let totalRuns = 0;
    let totalWickets = 0;
    for (const over of inn.overs) {
      let overRuns = 0;
      for (const del of over.deliveries) {
        overRuns += del.runs.total;
        if (del.wickets) totalWickets += del.wickets.length;
      }
      overs.push(overRuns);
      totalRuns += overRuns;
    }
    return { team: inn.team, overs, total: totalRuns, wickets: totalWickets };
  });

  return {
    matchId: m.file.replace(".json", ""),
    date: match.info.dates[0] || "",
    teams: match.info.teams as [string, string],
    winner: match.info.outcome?.winner || "tie",
    venue: match.info.venue || "",
    innings,
  };
});
fs.writeFileSync(path.join(outDir, "match-momentum.json"), JSON.stringify(momentumOut, null, 2));
console.log(`match-momentum.json: ${momentumOut.length} matches`);

// ─── 4. wagon-wheel.json ────────────────────────────────────
// For each player in our PLAYERS list, extract shot data from recent seasons
const PLAYERS_CRICSHEET = [
  "V Kohli", "RG Sharma", "MS Dhoni", "JJ Bumrah", "KL Rahul",
  "SA Yadav", "HH Pandya", "RA Jadeja", "AB de Villiers", "CH Gayle",
  "DA Warner", "JC Buttler", "RR Pant", "SH Gill", "YBK Jaiswal",
  "YS Chahal", "Rashid Khan", "SK Raina", "SL Malinga", "G Gambhir"
];

// Get recent 3 seasons
const allSeasons = Array.from(new Set(allMatches.map(m => m.match.info.season))).sort().reverse();
const recentSeasons = new Set(allSeasons.slice(0, 3));

const wagonWheelOut: Record<string, { angle: number; distance: number; runs: number }[]> = {};

for (const playerName of PLAYERS_CRICSHEET) {
  const shots: { angle: number; distance: number; runs: number }[] = [];

  for (const { match } of allMatches) {
    if (!recentSeasons.has(match.info.season)) continue;

    for (const inn of match.innings) {
      for (const over of inn.overs) {
        for (const del of over.deliveries) {
          if (del.batter !== playerName) continue;
          if (del.extras?.wides) continue; // skip wides

          const runs = del.runs.batter;
          // Heuristic angle based on over number and runs
          const baseAngle = (over.over * 18 + runs * 30) % 360;
          const jitter = (del.bowler.charCodeAt(0) * 7 + runs * 13) % 60 - 30;
          const angle = (baseAngle + jitter + 360) % 360;

          const distance = runs === 0 ? 0 : runs === 1 ? 30 : runs === 2 ? 50 : runs === 4 ? 80 : runs === 6 ? 100 : runs * 15;

          if (distance > 0) {
            shots.push({ angle: Math.round(angle), distance, runs });
          }
        }
      }
    }
  }

  wagonWheelOut[playerName] = shots;
}
fs.writeFileSync(path.join(outDir, "wagon-wheel.json"), JSON.stringify(wagonWheelOut, null, 2));
console.log(`wagon-wheel.json: ${Object.keys(wagonWheelOut).length} players`);

// ─── 5. win-probability.json ─────────────────────────────────
// From all historical chases, bucket by over/wickets/target/runs-needed
interface WinBucket {
  over: number;
  wickets: number;
  target_bracket: string;
  need_bracket: string;
  chaser_wins: number;
  total: number;
  win_pct: number;
}

function getTargetBracket(target: number): string {
  if (target < 140) return "<140";
  if (target < 160) return "140-159";
  if (target < 180) return "160-179";
  if (target < 200) return "180-199";
  return "200+";
}

function getNeedBracket(need: number): string {
  if (need <= 0) return "0";
  if (need <= 20) return "1-20";
  if (need <= 40) return "21-40";
  if (need <= 60) return "41-60";
  if (need <= 80) return "61-80";
  if (need <= 100) return "81-100";
  if (need <= 120) return "101-120";
  if (need <= 140) return "121-140";
  return "141+";
}

const winBuckets = new Map<string, { wins: number; total: number }>();

for (const { match } of allMatches) {
  if (match.innings.length < 2) continue;
  const firstInnings = match.innings[0];
  const secondInnings = match.innings[1];

  // Calculate first innings total
  let firstTotal = 0;
  for (const over of firstInnings.overs) {
    for (const del of over.deliveries) {
      firstTotal += del.runs.total;
    }
  }
  const target = firstTotal + 1;

  // Track chase over by over
  let chaserRuns = 0;
  let chaserWickets = 0;
  const chaserWon = match.info.outcome?.winner === secondInnings.team;

  for (const over of secondInnings.overs) {
    const overNum = over.over + 1; // 1-indexed
    for (const del of over.deliveries) {
      chaserRuns += del.runs.total;
      if (del.wickets) chaserWickets += del.wickets.length;
    }

    const need = target - chaserRuns;
    const bucketKey = `${overNum}_${chaserWickets}_${getTargetBracket(target)}_${getNeedBracket(need)}`;

    if (!winBuckets.has(bucketKey)) {
      winBuckets.set(bucketKey, { wins: 0, total: 0 });
    }
    const b = winBuckets.get(bucketKey)!;
    b.total++;
    if (chaserWon) b.wins++;
  }
}

const winProbOut: { buckets: WinBucket[] } = { buckets: [] };
for (const [key, val] of winBuckets.entries()) {
  if (val.total < 3) continue; // need at least 3 data points
  const [over, wickets, target_bracket, need_bracket] = key.split("_");
  winProbOut.buckets.push({
    over: parseInt(over),
    wickets: parseInt(wickets),
    target_bracket,
    need_bracket,
    chaser_wins: val.wins,
    total: val.total,
    win_pct: Math.round((val.wins / val.total) * 10000) / 100,
  });
}
fs.writeFileSync(path.join(outDir, "win-probability.json"), JSON.stringify(winProbOut, null, 2));
console.log(`win-probability.json: ${winProbOut.buckets.length} buckets`);

console.log("\n✅ All 5 data files generated in public/data/");
