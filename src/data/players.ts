export interface Player {
  id: string;
  name: string;
  cricsheetName: string;
  espnId: number;
  team: string;
  teamColor: string;
  role: "BATTER" | "BOWLER" | "ALLROUNDER" | "WICKETKEEPER";
  highlights: string[];
  active?: boolean;
}

export const PLAYERS: Player[] = [
  { id: "virat-kohli", name: "Virat Kohli", cricsheetName: "V Kohli", espnId: 253802, team: "RCB", teamColor: "#E63946", role: "BATTER", highlights: ["IPL all-time leading run-scorer", "Only player with 8 IPL centuries", "873 runs in IPL 2016 — season record"] },
  { id: "rohit-sharma", name: "Rohit Sharma", cricsheetName: "RG Sharma", espnId: 34102, team: "MI", teamColor: "#004EA2", role: "BATTER", highlights: ["5× IPL champion", "Second highest run-scorer in IPL history", "Scored 5 IPL centuries"] },
  { id: "ms-dhoni", name: "MS Dhoni", cricsheetName: "MS Dhoni", espnId: 28081, team: "CSK", teamColor: "#F5A623", role: "WICKETKEEPER", highlights: ["5× IPL champion with CSK", "200+ dismissals behind the stumps", "Highest SR among 4000+ run batters"] },
  { id: "jasprit-bumrah", name: "Jasprit Bumrah", cricsheetName: "JJ Bumrah", espnId: 625371, team: "MI", teamColor: "#004EA2", role: "BOWLER", highlights: ["MI all-time leading wicket-taker", "Best death-overs bowler in IPL", "Economy under 7.4 across 120 matches"] },
  { id: "kl-rahul", name: "KL Rahul", cricsheetName: "KL Rahul", espnId: 422108, team: "LSG", teamColor: "#00B4D8", role: "WICKETKEEPER", highlights: ["Orange Cap IPL 2020", "Highest avg among keeper-batters", "Captain of Lucknow Super Giants"] },
  { id: "suryakumar-yadav", name: "Suryakumar Yadav", cricsheetName: "SA Yadav", espnId: 446507, team: "MI", teamColor: "#004EA2", role: "BATTER", highlights: ["360-degree batting pioneer", "MI most explosive middle-order bat", "Highest T20I rating in world"] },
  { id: "hardik-pandya", name: "Hardik Pandya", cricsheetName: "HH Pandya", espnId: 625383, team: "MI", teamColor: "#004EA2", role: "ALLROUNDER", highlights: ["Led GT to IPL title as debut captain", "Only allrounder with 2500+ runs and 60+ wickets", "Fastest fifty for MI in playoffs"] },
  { id: "ravindra-jadeja", name: "Ravindra Jadeja", cricsheetName: "RA Jadeja", espnId: 234675, team: "CSK", teamColor: "#F5A623", role: "ALLROUNDER", highlights: ["Most appearances in IPL history", "Consistent spinner across 15 seasons", "Match-winner in CSK 2023 title run"] },
  { id: "ab-de-villiers", name: "AB de Villiers", cricsheetName: "AB de Villiers", espnId: 44828, team: "RCB", teamColor: "#E63946", role: "BATTER", active: false, highlights: ["151.7 SR across 184 matches", "RCB greatest overseas player", "Fastest IPL fifty in 12 balls"] },
  { id: "chris-gayle", name: "Chris Gayle", cricsheetName: "CH Gayle", espnId: 51880, team: "PBKS", teamColor: "#D4173A", role: "BATTER", active: false, highlights: ["175* — highest IPL score ever", "First IPL century", "30 sixes in IPL 2012 season"] },
  { id: "david-warner", name: "David Warner", cricsheetName: "DA Warner", espnId: 219889, team: "DC", teamColor: "#0078FF", role: "BATTER", highlights: ["3× Orange Cap winner", "SRH most successful captain", "6398 IPL runs at 41.5 avg"] },
  { id: "jos-buttler", name: "Jos Buttler", cricsheetName: "JC Buttler", espnId: 308967, team: "RR", teamColor: "#E91E8C", role: "WICKETKEEPER", highlights: ["863 runs IPL 2022 — single season record", "4 centuries in one IPL season", "Orange Cap 2022"] },
  { id: "rishabh-pant", name: "Rishabh Pant", cricsheetName: "RR Pant", espnId: 931581, team: "DC", teamColor: "#0078FF", role: "WICKETKEEPER", highlights: ["Led DC to first IPL final 2020", "Explosive left-hand power hitter", "IPL comeback after near-fatal accident"] },
  { id: "shubman-gill", name: "Shubman Gill", cricsheetName: "SH Gill", espnId: 1174663, team: "GT", teamColor: "#1B4F8C", role: "BATTER", highlights: ["GT leading run-scorer across 2 title seasons", "Orange Cap 2023", "Most consistent young opener in IPL"] },
  { id: "yashasvi-jaiswal", name: "Yashasvi Jaiswal", cricsheetName: "YBK Jaiswal", espnId: 1224267, team: "RR", teamColor: "#E91E8C", role: "BATTER", highlights: ["Youngest player to score IPL century", "161.8 SR highest among top-order batters", "RR most exciting batting prospect"] },
  { id: "yuzvendra-chahal", name: "Yuzvendra Chahal", cricsheetName: "YS Chahal", espnId: 554691, team: "RR", teamColor: "#E91E8C", role: "BOWLER", highlights: ["IPL all-time leading wicket-taker 205 wickets", "Purple Cap 2022", "Most leg-spin wickets in T20 history"] },
  { id: "rashid-khan", name: "Rashid Khan", cricsheetName: "Rashid Khan", espnId: 793463, team: "GT", teamColor: "#1B4F8C", role: "BOWLER", highlights: ["6.77 economy best among 100+ wicket bowlers", "GT match-winner in both title seasons", "Best T20 spinner in world at peak"] },
  { id: "suresh-raina", name: "Suresh Raina", cricsheetName: "SK Raina", espnId: 59781, team: "CSK", teamColor: "#F5A623", role: "BATTER", active: false, highlights: ["Mr. IPL — played every season", "5528 runs across 205 CSK matches", "First to century for two franchises"] },
  { id: "lasith-malinga", name: "Lasith Malinga", cricsheetName: "SL Malinga", espnId: 49428, team: "MI", teamColor: "#004EA2", role: "BOWLER", active: false, highlights: ["MI all-time leading wicket-taker before Bumrah", "Master of the yorker — 170 IPL wickets", "Most match-winning final overs in MI history"] },
  { id: "gautam-gambhir", name: "Gautam Gambhir", cricsheetName: "G Gambhir", espnId: 30176, team: "KKR", teamColor: "#3A1F6E", role: "BATTER", active: false, highlights: ["Led KKR to back-to-back titles 2012 and 2014", "One of IPL greatest captains by win pct", "Now head coach of India national team"] },
];
