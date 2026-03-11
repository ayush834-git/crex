import playerStatsData from "../../public/data/player-stats.json"

// Team color map — covers all 10 IPL teams
export const TEAM_COLORS: Record<string, string> = {
  "Mumbai Indians": "#004EA2",
  "MI": "#004EA2",
  "Chennai Super Kings": "#F5A623",
  "CSK": "#F5A623",
  "Royal Challengers Bengaluru": "#E63946",
  "Royal Challengers Bangalore": "#E63946",
  "RCB": "#E63946",
  "Kolkata Knight Riders": "#3A1F6E",
  "KKR": "#3A1F6E",
  "Delhi Capitals": "#0078FF",
  "DC": "#0078FF",
  "Sunrisers Hyderabad": "#FF6B2B",
  "SRH": "#FF6B2B",
  "Gujarat Titans": "#1B4F8C",
  "GT": "#1B4F8C",
  "Lucknow Super Giants": "#00B4D8",
  "LSG": "#00B4D8",
  "Punjab Kings": "#D4173A",
  "PBKS": "#D4173A",
  "Rajasthan Royals": "#E91E8C",
  "RR": "#E91E8C",
}

// ESPN ID map for known players — auto-matched by name
const ESPN_IDS: Record<string, number> = {
  "Virat Kohli": 253802,
  "Rohit Sharma": 34102,
  "MS Dhoni": 28081,
  "Jasprit Bumrah": 625371,
  "KL Rahul": 422108,
  "Suryakumar Yadav": 446507,
  "Hardik Pandya": 625383,
  "Ravindra Jadeja": 234675,
  "AB de Villiers": 44828,
  "Chris Gayle": 51880,
  "David Warner": 219889,
  "Jos Buttler": 308967,
  "Rishabh Pant": 931581,
  "Shubman Gill": 1174663,
  "Yashasvi Jaiswal": 1224267,
  "Yuzvendra Chahal": 554691,
  "Rashid Khan": 793463,
  "Suresh Raina": 59781,
  "Lasith Malinga": 49428,
  "Gautam Gambhir": 30176,
  "Ruturaj Gaikwad": 1175432,
  "Ishan Kishan": 1078680,
  "Sanju Samson": 642519,
  "Faf du Plessis": 44828,
  "Quinton de Kock": 657195,
  "Kane Williamson": 277906,
  "Pat Cummins": 492438,
  "Mitchell Starc": 390243,
  "Mohammed Shami": 604527,
  "Mohammed Siraj": 1021720,
  "Arshdeep Singh": 1151251,
  "Axar Patel": 604560,
  "Washington Sundar": 1078680,
  "Shreyas Iyer": 931581,
  "Devdutt Padikkal": 1151263,
  "Prithvi Shaw": 1151237,
  "Tilak Varma": 1224347,
  "Rinku Singh": 1070173,
  "Shahrukh Khan": 1151284,
}

// Cricsheet name mapping — handles initials format
const CRICSHEET_NAMES: Record<string, string> = {
  "Virat Kohli": "V Kohli",
  "Rohit Sharma": "RG Sharma",
  "MS Dhoni": "MS Dhoni",
  "Jasprit Bumrah": "JJ Bumrah",
  "KL Rahul": "KL Rahul",
  "Suryakumar Yadav": "SA Yadav",
  "Hardik Pandya": "HH Pandya",
  "Ravindra Jadeja": "RA Jadeja",
  "Yuzvendra Chahal": "YS Chahal",
  "Rashid Khan": "Rashid Khan",
  "David Warner": "DA Warner",
  "Chris Gayle": "CH Gayle",
  "Shubman Gill": "SH Gill",
  "Yashasvi Jaiswal": "YBK Jaiswal",
  "Jos Buttler": "JC Buttler",
  "Rishabh Pant": "RR Pant",
  "Suresh Raina": "SK Raina",
  "Lasith Malinga": "SL Malinga",
  "Gautam Gambhir": "G Gambhir",
}

export function stitchPlayer(apiPlayer: any) {
  const name: string = apiPlayer.name
  const teamColor = TEAM_COLORS[apiPlayer.team] ?? TEAM_COLORS[apiPlayer.teamShort] ?? "#9B5DE5"
  const espnId = ESPN_IDS[name] ?? null
  const cricsheetName = CRICSHEET_NAMES[name] ?? name
  const cricsheetStats = (playerStatsData as any)[cricsheetName] ?? null

  return {
    id: name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, ""),
    name,
    cricsheetName,
    espnId,
    team: apiPlayer.teamShort,
    teamFull: apiPlayer.team,
    teamColor,
    role: apiPlayer.role,
    country: apiPlayer.country ?? "India",
    battingStyle: apiPlayer.battingStyle ?? null,
    bowlingStyle: apiPlayer.bowlingStyle ?? null,
    stats: cricsheetStats, // real Cricsheet stats if available, null if not
    highlights: [], // populated for known players from static data
  }
}
