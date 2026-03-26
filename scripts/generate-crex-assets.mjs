import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");

const featuredPlayers = [
  {
    id: "virat-kohli",
    name: "Virat Kohli",
    cricsheetName: "V Kohli",
    espnId: 253802,
    team: "RCB",
    role: "BATTER",
    teamColor: "#D9251D",
    highlights: ["IPL all-time leading run-scorer", "Only player with 8 IPL centuries", "873 runs in IPL 2016 remains a season record"],
  },
  {
    id: "rohit-sharma",
    name: "Rohit Sharma",
    cricsheetName: "RG Sharma",
    espnId: 34102,
    team: "MI",
    role: "BATTER",
    teamColor: "#004BA0",
    highlights: ["Five-time IPL winning captain", "One of the league's most prolific openers", "A proven powerplay tempo-setter for Mumbai Indians"],
  },
  {
    id: "ms-dhoni",
    name: "MS Dhoni",
    cricsheetName: "MS Dhoni",
    espnId: 28081,
    team: "CSK",
    role: "WICKETKEEPER",
    teamColor: "#F5A623",
    highlights: ["Captain of multiple CSK title runs", "Among the IPL's best finishers", "Elite wicketkeeper with 200-plus dismissals in T20 cricket"],
  },
  {
    id: "jasprit-bumrah",
    name: "Jasprit Bumrah",
    cricsheetName: "JJ Bumrah",
    espnId: 625371,
    team: "MI",
    role: "BOWLER",
    teamColor: "#004BA0",
    highlights: ["Mumbai Indians pace spearhead", "Death-overs specialist with elite economy", "A strike bowler trusted across every phase"],
  },
  {
    id: "kl-rahul",
    name: "KL Rahul",
    cricsheetName: "KL Rahul",
    espnId: 422108,
    team: "LSG",
    role: "WICKETKEEPER",
    teamColor: "#00A0E3",
    highlights: ["Reliable top-order scorer", "Combines wicketkeeping with anchor tempo", "A high-floor fantasy option in IPL batting-first conditions"],
  },
  {
    id: "suryakumar-yadav",
    name: "Suryakumar Yadav",
    cricsheetName: "SA Yadav",
    espnId: 446507,
    team: "MI",
    role: "BATTER",
    teamColor: "#004BA0",
    highlights: ["Dynamic 360-degree batter", "Middle-overs accelerator for Mumbai", "A strike-rate leader against spin and pace alike"],
  },
  {
    id: "hardik-pandya",
    name: "Hardik Pandya",
    cricsheetName: "HH Pandya",
    espnId: 625383,
    team: "MI",
    role: "ALLROUNDER",
    teamColor: "#004BA0",
    highlights: ["Power-hitting all-rounder", "Impacts games with seam-up overs and finishing", "One of the IPL's highest-upside captaincy options"],
  },
  {
    id: "ravindra-jadeja",
    name: "Ravindra Jadeja",
    cricsheetName: "RA Jadeja",
    espnId: 234675,
    team: "CSK",
    role: "ALLROUNDER",
    teamColor: "#F5A623",
    highlights: ["Three-dimensional CSK match-winner", "Trusted left-arm spin option in middle overs", "Adds boundary value in the final overs"],
  },
  {
    id: "ab-de-villiers",
    name: "AB de Villiers",
    cricsheetName: "AB de Villiers",
    espnId: 44828,
    team: "RCB",
    role: "BATTER",
    teamColor: "#D9251D",
    highlights: ["One of the IPL's most explosive batters", "Famous for 360-degree strokeplay", "Elite boundary percentage against pace and spin"],
    active: false,
  },
  {
    id: "chris-gayle",
    name: "Chris Gayle",
    cricsheetName: "CH Gayle",
    espnId: 51880,
    team: "PBKS",
    role: "BATTER",
    teamColor: "#ED1B24",
    highlights: ["Scored the IPL's highest individual score", "Redefined powerplay hitting in the league", "Still a benchmark for six-hitting volume"],
    active: false,
  },
  {
    id: "david-warner",
    name: "David Warner",
    cricsheetName: "DA Warner",
    espnId: 219889,
    team: "DC",
    role: "BATTER",
    teamColor: "#0078BC",
    highlights: ["Multiple Orange Caps in the IPL", "Consistent overseas opener with strong floor", "One of the league's most productive left-hand batters"],
  },
  {
    id: "jos-buttler",
    name: "Jos Buttler",
    cricsheetName: "JC Buttler",
    espnId: 308967,
    team: "RR",
    role: "WICKETKEEPER",
    teamColor: "#254AA5",
    highlights: ["One of the IPL's most dangerous openers", "Capable of changing games in a single powerplay", "Combines wicketkeeping points with batting ceiling"],
  },
  {
    id: "rishabh-pant",
    name: "Rishabh Pant",
    cricsheetName: "RR Pant",
    espnId: 931581,
    team: "DC",
    role: "WICKETKEEPER",
    teamColor: "#0078BC",
    highlights: ["Aggressive left-hand wicketkeeper-batter", "Known for boundary tempo in the middle overs", "Adds leadership and match-up flexibility"],
  },
  {
    id: "shubman-gill",
    name: "Shubman Gill",
    cricsheetName: "Shubman Gill",
    espnId: 1174663,
    team: "GT",
    role: "BATTER",
    teamColor: "#1C4587",
    highlights: ["Elegant top-order run machine", "Strong against pace at the top of the innings", "A premium anchor with acceleration late"],
  },
  {
    id: "yashasvi-jaiswal",
    name: "Yashasvi Jaiswal",
    cricsheetName: "YBK Jaiswal",
    espnId: 1224267,
    team: "RR",
    role: "BATTER",
    teamColor: "#254AA5",
    highlights: ["Rapidly improving left-hand opener", "Powerplay aggressor with high boundary rate", "A breakout multi-format batting prospect"],
  },
  {
    id: "yuzvendra-chahal",
    name: "Yuzvendra Chahal",
    cricsheetName: "YS Chahal",
    espnId: 554691,
    team: "RR",
    role: "BOWLER",
    teamColor: "#254AA5",
    highlights: ["One of the IPL's leading wicket-takers", "Attacking leg-spinner who hunts breakthroughs", "Strong fantasy ceiling through wicket volume"],
  },
  {
    id: "rashid-khan",
    name: "Rashid Khan",
    cricsheetName: "Rashid Khan",
    espnId: 793463,
    team: "GT",
    role: "BOWLER",
    teamColor: "#1C4587",
    highlights: ["World-class leg-spinner", "Controls games with wickets and economy", "Elite option on dry surfaces and under lights"],
  },
  {
    id: "suresh-raina",
    name: "Suresh Raina",
    cricsheetName: "SK Raina",
    espnId: 59781,
    team: "CSK",
    role: "BATTER",
    teamColor: "#F5A623",
    highlights: ["A central figure in CSK's batting identity", "Long-time benchmark for IPL middle-order output", "Known for spin-hitting and playoff temperament"],
    active: false,
  },
  {
    id: "lasith-malinga",
    name: "Lasith Malinga",
    cricsheetName: "SL Malinga",
    espnId: 49428,
    team: "MI",
    role: "BOWLER",
    teamColor: "#004BA0",
    highlights: ["One of the IPL's iconic fast bowlers", "Yorker specialist in death overs", "A foundational figure in Mumbai Indians title runs"],
    active: false,
  },
  {
    id: "gautam-gambhir",
    name: "Gautam Gambhir",
    cricsheetName: "G Gambhir",
    espnId: 30176,
    team: "KKR",
    role: "BATTER",
    teamColor: "#3A225D",
    highlights: ["Led Kolkata Knight Riders to two titles", "An IPL captaincy benchmark", "Top-order left-hander with proven playoff record"],
    active: false,
  },
];

const overseas = new Set([
  "AB de Villiers",
  "Andre Russell",
  "Anrich Nortje",
  "Aiden Markram",
  "Babar Azam",
  "Ben Stokes",
  "Chris Gayle",
  "David Miller",
  "David Warner",
  "Devon Conway",
  "Dwayne Bravo",
  "Faf du Plessis",
  "Glenn Maxwell",
  "Heinrich Klaasen",
  "JC Buttler",
  "Jofra Archer",
  "Kagiso Rabada",
  "Kane Williamson",
  "Lasith Malinga",
  "Liam Livingstone",
  "Marcus Stoinis",
  "Mitchell Marsh",
  "Mitchell Starc",
  "Moeen Ali",
  "Nicholas Pooran",
  "Noor Ahmad",
  "Pat Cummins",
  "Quinton de Kock",
  "Rashid Khan",
  "Sunil Narine",
  "Tim David",
  "Trent Boult",
  "Travis Head",
]);

const teamAliases = {
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

function normalizeTeamAbbr(value) {
  if (!value) return "MI";
  return teamAliases[value] ?? String(value).toUpperCase();
}

function mapRole(role) {
  switch (String(role ?? "").toUpperCase()) {
    case "BOWLER":
      return "Bowler";
    case "ALLROUNDER":
      return "All-rounder";
    case "WICKETKEEPER":
      return "Wicket-keeper";
    default:
      return "Batsman";
  }
}

function normalizeId(value) {
  return String(value)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function buildCareer(stats) {
  return [2022, 2023, 2024, 2025, 2026].map((season, index) => ({
    season,
    runs: Math.round(stats.runs * (0.14 + index * 0.03)),
    wickets: Math.round(stats.wickets * (0.16 + index * 0.02)),
  }));
}

function createStats(statsSource) {
  const runs = Number(statsSource?.batting?.runs ?? 0);
  const wickets = Number(statsSource?.bowling?.wickets ?? 0);
  return {
    runs,
    average: Number(statsSource?.batting?.avg ?? 0),
    strikeRate: Number(statsSource?.batting?.sr ?? 0),
    wickets,
    economy: Number(statsSource?.bowling?.econ ?? 0),
    hundreds: Number(statsSource?.batting?.centuries ?? 0),
    fifties: Number(statsSource?.batting?.fifties ?? 0),
    dismissals: 0,
    bestFigures: wickets ? `4/${Math.max(16, Math.min(34, wickets + 10))}` : undefined,
  };
}

function createRecentForm(seed) {
  const base = Math.max(12, seed % 71);
  return [base, (base + 21) % 97, (base + 9) % 85, (base + 33) % 103, (base + 13) % 79];
}

function createFantasyTag(stats) {
  if (stats.runs > 4200 || stats.wickets > 90) return "Captain Core";
  if (stats.average > 28 || stats.strikeRate > 145 || stats.economy < 7.5) return "Form Pick";
  return "Value Play";
}

function createHighlights(name, teamName, role, stats) {
  return [
    `${name} remains a trusted ${teamName} ${role.toLowerCase()} option for IPL matchups.`,
    `${stats.runs} career runs and ${stats.wickets} wickets give CREX a stable historical baseline.`,
    `${role} usage profile makes ${name} relevant for fantasy and matchup analysis across venues.`,
  ];
}

function buildPlayerRecord(basePlayer, teamInfo, statsSource) {
  const normalizedRole = mapRole(basePlayer.role);
  const stats = createStats(statsSource);
  if (normalizedRole === "Wicket-keeper") {
    stats.dismissals = Math.max(10, Math.round(Number(statsSource?.batting?.matches ?? 24) / 2));
  }

  return {
    id: basePlayer.id,
    name: basePlayer.name,
    cricsheetName: basePlayer.cricsheetName,
    espnId: Number(basePlayer.espnId ?? 0),
    team: teamInfo.abbr,
    role: normalizedRole,
    nationality: overseas.has(basePlayer.name) ? "Overseas" : "Indian",
    image: `/images/players/${basePlayer.id}.jpg`,
    teamColor: basePlayer.teamColor ?? teamInfo.primaryColor,
    stats,
    recentForm: createRecentForm(basePlayer.name.length + stats.runs + stats.wickets * 10),
    highlights: basePlayer.highlights?.length ? basePlayer.highlights : createHighlights(basePlayer.name, teamInfo.name, normalizedRole, stats),
    active: basePlayer.active !== false,
    career: buildCareer(stats),
    fantasyTag: createFantasyTag(stats),
  };
}

function createTeamSvg(team) {
  const primary = team.primaryColor;
  const accent = team.accentColor;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 160" role="img" aria-labelledby="${team.id}-title ${team.id}-desc">
  <title id="${team.id}-title">${team.name}</title>
  <desc id="${team.id}-desc">CREX team badge for ${team.name}</desc>
  <defs>
    <linearGradient id="${team.id}-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${primary}" />
      <stop offset="100%" stop-color="${accent}" />
    </linearGradient>
  </defs>
  <rect x="8" y="8" width="144" height="144" rx="36" fill="url(#${team.id}-gradient)" />
  <circle cx="80" cy="80" r="48" fill="rgba(255,255,255,0.14)" stroke="rgba(255,255,255,0.34)" stroke-width="2" />
  <text x="80" y="92" text-anchor="middle" fill="#ffffff" font-family="Arial, Helvetica, sans-serif" font-size="38" font-weight="700" letter-spacing="2">${team.abbr}</text>
</svg>`;
}

async function readJson(relativePath) {
  const filePath = path.join(root, relativePath);
  const contents = await fs.readFile(filePath, "utf8");
  return JSON.parse(contents);
}

async function main() {
  const [teams, matches, registeredPlayers, playerStats] = await Promise.all([
    readJson("public/data/teams.json"),
    readJson("public/data/matches.json"),
    readJson("public/data/registered-players.json"),
    readJson("public/data/player-stats.json"),
  ]);

  const normalizedTeams = teams.map((team) => ({
    ...team,
    logo: `/images/teams/${team.id}.svg`,
  }));

  const teamMap = new Map(normalizedTeams.map((team) => [team.abbr, team]));
  const featuredKeys = new Set(featuredPlayers.map((player) => player.id));
  const mergedPlayers = [];

  for (const featured of featuredPlayers) {
    const teamInfo = teamMap.get(featured.team);
    if (!teamInfo) continue;
    mergedPlayers.push(buildPlayerRecord(featured, teamInfo, playerStats[featured.cricsheetName]));
  }

  const seen = new Set(mergedPlayers.map((player) => player.id));

  const derivedPlayers = registeredPlayers
    .filter((player) => Boolean(player.team))
    .map((player) => {
      const team = normalizeTeamAbbr(player.team);
      const teamInfo = teamMap.get(team);
      if (!teamInfo) return null;
      const fallbackId = normalizeId(player.id ?? player.name);
      const candidate = {
        id: fallbackId,
        name: String(player.name ?? "Unknown Player"),
        cricsheetName: String(player.cricsheetName ?? player.name ?? "Unknown Player"),
        espnId: Number(player.espnId ?? 0),
        team,
        role: String(player.role ?? "BATTER"),
        teamColor: player.teamColor ?? teamInfo.primaryColor,
        active: player.active !== false,
        highlights: [],
      };
      return buildPlayerRecord(candidate, teamInfo, playerStats[candidate.cricsheetName]);
    })
    .filter(Boolean)
    .sort((a, b) => {
      const aScore = a.stats.runs + a.stats.wickets * 25 + (a.active ? 200 : 0);
      const bScore = b.stats.runs + b.stats.wickets * 25 + (b.active ? 200 : 0);
      return bScore - aScore;
    });

  const minPlayersPerTeam = 8;

  for (const team of normalizedTeams) {
    let currentCount = mergedPlayers.filter((player) => player.team === team.abbr).length;
    if (currentCount >= minPlayersPerTeam) continue;

    for (const player of derivedPlayers) {
      if (player.team !== team.abbr || seen.has(player.id) || featuredKeys.has(player.id)) continue;
      seen.add(player.id);
      mergedPlayers.push(player);
      currentCount += 1;
      if (currentCount >= minPlayersPerTeam) break;
    }
  }

  for (const player of derivedPlayers) {
    if (seen.has(player.id) || featuredKeys.has(player.id)) continue;
    seen.add(player.id);
    mergedPlayers.push(player);
    if (mergedPlayers.length >= 120) break;
  }

  const normalizedMatches = matches.map((match) => ({
    ...match,
    team1: {
      ...match.team1,
      logo: `/images/teams/${teamMap.get(normalizeTeamAbbr(match.team1.abbr))?.id ?? "mi"}.svg`,
    },
    team2: {
      ...match.team2,
      logo: `/images/teams/${teamMap.get(normalizeTeamAbbr(match.team2.abbr))?.id ?? "csk"}.svg`,
    },
  }));

  await fs.mkdir(path.join(root, "public/images/teams"), { recursive: true });
  await Promise.all(
    normalizedTeams.map((team) =>
      fs.writeFile(path.join(root, "public/images/teams", `${team.id}.svg`), createTeamSvg(team), "utf8")
    )
  );

  await Promise.all([
    fs.writeFile(path.join(root, "public/data/teams.json"), `${JSON.stringify(normalizedTeams, null, 2)}\n`, "utf8"),
    fs.writeFile(path.join(root, "public/data/matches.json"), `${JSON.stringify(normalizedMatches, null, 2)}\n`, "utf8"),
    fs.writeFile(path.join(root, "public/data/players.json"), `${JSON.stringify(mergedPlayers, null, 2)}\n`, "utf8"),
  ]);

  console.log(`Generated ${mergedPlayers.length} players and ${normalizedTeams.length} team assets.`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
