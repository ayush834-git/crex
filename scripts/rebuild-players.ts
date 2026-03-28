/**
 * rebuild-players.ts  –  IPL 2026 edition
 *
 * Generates public/data/players.json from:
 *   1. Real Cricsheet ball-by-ball data (ipl_json/)
 *   2. Verified IPL 2026 squad lists (Dec 2025 mini-auction + retentions)
 *
 * Usage:
 *   npx ts-node --project tsconfig.scripts.json scripts/rebuild-players.ts ./ipl_json
 */

import * as fs from "fs";
import * as path from "path";

// ── Types ────────────────────────────────────────────────────
interface Delivery {
  batter: string; bowler: string; non_striker: string;
  runs: { batter: number; extras: number; total: number };
  extras?: { wides?: number; noballs?: number };
  wickets?: { player_out: string; kind: string }[];
}
interface Over { over: number; deliveries: Delivery[] }
interface Innings { team: string; overs: Over[] }
interface MatchInfo {
  season: string; dates: string[]; teams: string[];
  outcome?: { winner?: string };
  venue?: string;
}
interface MatchFile { info: MatchInfo; innings: Innings[] }

// ──────────────────────────────────────────────────────────────
// IPL 2026 OFFICIAL SQUADS  (post mini-auction, Dec 16 2025)
// Key: team abbr → list of cricsheet-style names
// ──────────────────────────────────────────────────────────────
const IPL2026: Record<string, string[]> = {
  CSK: [
    "RD Gaikwad","MS Dhoni","SV Samson","S Dube","Noor Ahmad",
    "Khaleel Ahmed","J Overton","N Ellis","D Brevis","Anshul Kamboj",
    "Mukesh Choudhary","S Gopal","Gurjapneet Singh","Ayush Mhatre",
    "Urvil Patel","R Ghosh","Spencer Johnson","Matt Henry",
  ],
  MI: [
    "HH Pandya","RG Sharma","SA Yadav","JJ Bumrah","Tilak Varma",
    "Q de Kock","T Boult","MJ Santner","W Jacks","Danish Malewar",
    "S Rutherford","Robin Minz","R Rickelton","Naman Dhir",
    "SN Thakur","C Bosch","RA Bawa","M Rawat","A Ankolekar",
    "DL Chahar","AM Ghazanfar","M Markande","Ashwani Kumar",
    "Raghu Sharma","Mohammad Izhar",
  ],
  RCB: [
    "V Kohli","Rajat Patidar","P Salt","Jitesh Sharma",
    "D Padikkal","KH Pandya","T David","R Shepherd",
    "B Kumar","JR Hazlewood","Rasikh Salam Dar","S Sharma",
    "N Thushara","Y Dayal","J Bethell","V Iyer",
    "S Deswal","M Yadav","VR Iyer","V Malhotra",
    "K Chouhan","S Singh","J Cox","J Duffy","A Singh",
  ],
  KKR: [
    "AM Rahane","Rinku Singh","SP Narine","C Green",
    "Varun Chakaravarthy","Ramandeep Singh","V Arora",
    "Matheesha Pathirana","U Malik","A Raghuvanshi",
    "MK Pandey","R Tripathi","R Powell","F Allen",
    "T Seifert","T Singh","Anukul Roy","K Tyagi",
    "Rachin Ravindra","S Ranjan","D Kamra","B Muzarabani",
    "P Solanki","Saurabh Dubey","N Saini","Harshit Rana",
  ],
  SRH: [
    "TM Head","HE Klaasen","Ishan Kishan","Abhishek Sharma",
    "NK Reddy","LS Livingstone","HV Patel","Kamindu Mendis",
    "PJ Cummins","JD Unadkat","B Carse","Shivam Mavi",
    "A Verma","S Ravichandran","S Kumar","H Dubey",
    "J Edwards","Amit Kumar","D Payne","Zeeshan Ansari",
    "E Malinga","S Hussain",
  ],
  DC: [
    "AR Patel","KL Rahul","P Nissanka","DA Miller",
    "PP Shaw","Karun Nair","A Porel","T Stubbs",
    "B Duckett","Nitish Rana","A Sharma","S Rizvi",
    "V Nigam","A Mandal","T Vijay","Auqib Nabi Dar",
    "MA Starc","Kuldeep Yadav","T Natarajan","Mukesh Kumar",
    "D Chameera","L Ngidi","KA Jamieson","M Tiwari",
    "S Parakh",
  ],
  PBKS: [
    "SS Iyer","Arshdeep Singh","YS Chahal","MP Stoinis",
    "M Jansen","Azmatullah Omarzai","H Brar","Musheer Khan",
    "S Shedge","V Vijaykumar","Y Thakur","X Bartlett",
    "L Ferguson","C Connolly","B Dwarshuis","P Dubey",
    "V Nishad","SS Singh","N Wadhera","H Pannu",
    "P Avinash","P Arya","P Singh","V Vinod",
    "M Owen",
  ],
  RR: [
    "R Parag","YBK Jaiswal","RA Jadeja","JC Archer",
    "Ravi Bishnoi","Dhruv Jurel","SO Hetmyer","D Shanaka",
    "S Sharma","T Deshpande","A Milne","N Burger",
    "K Maphaka","Kuldeep Sen","S Mishra","V Puthur",
    "Y Punja","B Sharma","S Dubey","D Ferreira",
    "R Singh","Y Charak","L Pretorius","A Perala",
  ],
  GT: [
    "Shubman Gill","JC Buttler","Rashid Khan","K Rabada",
    "Mohammed Siraj","Sai Sudharsan","GD Phillips",
    "Washington Sundar","R Tewatia","M Shahrukh Khan",
    "J Holder","P Krishna","J Yadav","Sai Kishore",
    "M Suthar","N Sindhu","Anuj Rawat","K Kushagra",
    "T Banton","G Brar","Ishant Sharma","A Sharma",
    "L Wood","K Khejroliya","P Yarra",
  ],
  LSG: [
    "RR Pant","N Pooran","AK Markram","MR Marsh",
    "Mohammed Shami","Avesh Khan","Mayank Yadav","Shahbaz Ahmed",
    "A Kulkarni","Wanindu Hasaranga","H Singh","A Raghuwanshi",
    "Abdul Samad","A Badoni","M Breetzke","M Choudhary",
    "J Inglis","A Nortje","M Siddharth","D Rathi",
    "Akash Singh","P Yadav","Arjun Tendulkar","N Tiwari",
  ],
};

// ── Readable display names ───────────────────────────────────
const NAMES: Record<string,string> = {
  "RD Gaikwad":"Ruturaj Gaikwad","MS Dhoni":"MS Dhoni",
  "SV Samson":"Sanju Samson","S Dube":"Shivam Dube",
  "HH Pandya":"Hardik Pandya","RG Sharma":"Rohit Sharma",
  "SA Yadav":"Suryakumar Yadav","JJ Bumrah":"Jasprit Bumrah",
  "Tilak Varma":"Tilak Varma","Q de Kock":"Quinton de Kock",
  "TA Boult":"Trent Boult","T Boult":"Trent Boult",
  "MJ Santner":"Mitchell Santner",
  "W Jacks":"Will Jacks","SN Thakur":"Shardul Thakur",
  "DL Chahar":"Deepak Chahar","V Kohli":"Virat Kohli",
  "Rajat Patidar":"Rajat Patidar","P Salt":"Phil Salt",
  "D Padikkal":"Devdutt Padikkal","KH Pandya":"Krunal Pandya",
  "T David":"Tim David","R Shepherd":"Romario Shepherd",
  "B Kumar":"Bhuvneshwar Kumar","JR Hazlewood":"Josh Hazlewood",
  "V Iyer":"Venkatesh Iyer","VR Iyer":"Venkatesh Iyer",
  "Y Dayal":"Yash Dayal",
  "J Bethell":"Jacob Bethell","N Thushara":"Nuwan Thushara",
  "AM Rahane":"Ajinkya Rahane","Rinku Singh":"Rinku Singh",
  "SP Narine":"Sunil Narine","S Narine":"Sunil Narine",
  "C Green":"Cameron Green",
  "Varun Chakaravarthy":"Varun Chakaravarthy",
  "Matheesha Pathirana":"Matheesha Pathirana",
  "U Malik":"Umran Malik","MK Pandey":"Manish Pandey",
  "R Tripathi":"Rahul Tripathi","R Powell":"Rovman Powell",
  "F Allen":"Finn Allen","Rachin Ravindra":"Rachin Ravindra",
  "Harshit Rana":"Harshit Rana","N Saini":"Navdeep Saini",
  "TM Head":"Travis Head","T Head":"Travis Head",
  "HE Klaasen":"Heinrich Klaasen",
  "Ishan Kishan":"Ishan Kishan","Abhishek Sharma":"Abhishek Sharma",
  "NK Reddy":"Nitish Kumar Reddy","LS Livingstone":"Liam Livingstone",
  "HV Patel":"Harshal Patel","HP Patel":"Harshal Patel",
  "PJ Cummins":"Pat Cummins",
  "JD Unadkat":"Jaydev Unadkat","B Carse":"Brydon Carse",
  "AR Patel":"Axar Patel","Axar Patel":"Axar Patel",
  "KL Rahul":"KL Rahul",
  "DA Miller":"David Miller","PP Shaw":"Prithvi Shaw",
  "Karun Nair":"Karun Nair","KK Nair":"Karun Nair",
  "T Stubbs":"Tristan Stubbs",
  "B Duckett":"Ben Duckett","Nitish Rana":"Nitish Rana",
  "MA Starc":"Mitchell Starc","M Starc":"Mitchell Starc",
  "Kuldeep Yadav":"Kuldeep Yadav",
  "T Natarajan":"T Natarajan","L Ngidi":"Lungi Ngidi",
  "KA Jamieson":"Kyle Jamieson",
  "SS Iyer":"Shreyas Iyer","S Iyer":"Shreyas Iyer",
  "Arshdeep Singh":"Arshdeep Singh","YS Chahal":"Yuzvendra Chahal",
  "MP Stoinis":"Marcus Stoinis","M Stoinis":"Marcus Stoinis",
  "MO Jansen":"Marco Jansen","M Jansen":"Marco Jansen",
  "Azmatullah Omarzai":"Azmatullah Omarzai","H Brar":"Harpreet Brar",
  "Musheer Khan":"Musheer Khan","L Ferguson":"Lockie Ferguson",
  "X Bartlett":"Xavier Bartlett","R Parag":"Riyan Parag",
  "YBK Jaiswal":"Yashasvi Jaiswal","RA Jadeja":"Ravindra Jadeja",
  "JC Archer":"Jofra Archer","Ravi Bishnoi":"Ravi Bishnoi",
  "Dhruv Jurel":"Dhruv Jurel","SO Hetmyer":"Shimron Hetmyer",
  "T Deshpande":"Tushar Deshpande","N Burger":"Nandre Burger",
  "Shubman Gill":"Shubman Gill","SH Gill":"Shubman Gill",
  "JC Buttler":"Jos Buttler",
  "Rashid Khan":"Rashid Khan","K Rabada":"Kagiso Rabada",
  "Mohammed Siraj":"Mohammed Siraj","Sai Sudharsan":"Sai Sudharsan",
  "GD Phillips":"Glenn Phillips","Washington Sundar":"Washington Sundar",
  "R Tewatia":"Rahul Tewatia","J Holder":"Jason Holder",
  "JO Holder":"Jason Holder",
  "P Krishna":"Prasidh Krishna","Ishant Sharma":"Ishant Sharma",
  "RR Pant":"Rishabh Pant","N Pooran":"Nicholas Pooran",
  "AK Markram":"Aiden Markram","A Markram":"Aiden Markram",
  "MR Marsh":"Mitchell Marsh","M Marsh":"Mitchell Marsh",
  "Mohammed Shami":"Mohammed Shami","M Shami":"Mohammed Shami",
  "Avesh Khan":"Avesh Khan",
  "Mayank Yadav":"Mayank Yadav","Shahbaz Ahmed":"Shahbaz Ahmed",
  "A Kulkarni":"Arshin Kulkarni","Wanindu Hasaranga":"Wanindu Hasaranga",
  "A Badoni":"Ayush Badoni","J Inglis":"Josh Inglis",
  "A Nortje":"Anrich Nortje","Abdul Samad":"Abdul Samad",
  "S Rutherford":"Sherfane Rutherford","C Bosch":"Corbin Bosch",
  "D Brevis":"Dewald Brevis","Spencer Johnson":"Spencer Johnson",
  "J Overton":"Jamie Overton","M Shahrukh Khan":"Shahrukh Khan",
  "Kamindu Mendis":"Kamindu Mendis","Rasikh Salam Dar":"Rasikh Salam",
  "A Porel":"Abishek Porel","D Shanaka":"Dasun Shanaka",
  "K Maphaka":"Kwena Maphaka","R Rickelton":"Ryan Rickelton",
  "Matt Henry":"Matt Henry","Anuj Rawat":"Anuj Rawat",
  "S Gopal":"Shreyas Gopal","Mukesh Choudhary":"Mukesh Choudhary",
  "V Vijaykumar":"Vyshak Vijaykumar","Shivam Mavi":"Shivam Mavi",
  "Mukesh Kumar":"Mukesh Kumar","N Wadhera":"Nehal Wadhera",
  "P Nissanka":"Pathum Nissanka","M Suthar":"Manav Suthar",
  "S Rizvi":"Sameer Rizvi","Y Thakur":"Yash Thakur",
  "S Mishra":"Sushant Mishra",
  "SK Raina":"Suresh Raina","CH Gayle":"Chris Gayle",
  "AB de Villiers":"AB de Villiers","SL Malinga":"Lasith Malinga",
  "G Gambhir":"Gautam Gambhir","DA Warner":"David Warner",
  "KA Pollard":"Kieron Pollard","DJ Bravo":"Dwayne Bravo",
  "AD Russell":"Andre Russell","SR Watson":"Shane Watson",
};

// ── ESPN IDs for known players ───────────────────────────────
const ESPN: Record<string,number> = {
  "V Kohli":253802,"RG Sharma":34102,"MS Dhoni":28081,
  "JJ Bumrah":625371,"KL Rahul":422108,"SA Yadav":446507,
  "HH Pandya":625383,"RA Jadeja":234675,"JC Buttler":308967,
  "RR Pant":931581,"Shubman Gill":1174663,"YBK Jaiswal":1224267,
  "YS Chahal":554691,"Rashid Khan":793463,"SV Samson":604302,
  "SP Narine":230558,"Rinku Singh":1210393,"PJ Cummins":489889,
  "TM Head":530011,"HE Klaasen":657621,"Ishan Kishan":720471,
  "Tilak Varma":1252928,"RD Gaikwad":723105,"Mohammed Siraj":940973,
  "K Rabada":550215,"R Parag":1070171,"SS Iyer":642519,
  "Arshdeep Singh":1070168,"MA Starc":311592,"B Kumar":432934,
  "Q de Kock":379143,"DA Miller":321777,"AR Patel":554691,
  "JR Hazlewood":489889,"T Boult":277912,"Ravi Bishnoi":1175441,
  "NK Reddy":1292538,"Abhishek Sharma":1070183,"SO Hetmyer":777503,
  "Rajat Patidar":553553,"D Padikkal":1159847,"VR Iyer":962425,
  "MP Stoinis":325012,"M Jansen":1159741,"N Pooran":527048,
  "AM Rahane":277916,"DL Chahar":447261,"T Natarajan":502714,
  "Dhruv Jurel":1278697,"Sai Sudharsan":1278697,"A Badoni":1278697,
  "PP Shaw":1070168,"Kuldeep Yadav":559235,"HV Patel":625435,
  "SN Thakur":481896,"MK Pandey":290716,"R Tripathi":604302,
  "Nitish Rana":625457,"Washington Sundar":724649,"R Tewatia":604374,
  "JD Unadkat":481903,"N Saini":779431,"Harshit Rana":1292538,
  "Varun Chakaravarthy":1070175,"JC Archer":669855,"Mohammed Shami":481896,
  "Avesh Khan":779459,"L Ferguson":425261,"S Dube":779465,
  "P Salt":649125,"T David":663671,"AK Markram":600498,
  "MR Marsh":272450,"LS Livingstone":661341,"KK Nair":398800,
  "Shahbaz Ahmed":779449,"Abdul Samad":1070181,
};

const TEAM_COLORS: Record<string,string> = {
  CSK:"#F5A623", MI:"#004BA0", RCB:"#D9251D", KKR:"#3A225D",
  SRH:"#F26522", DC:"#0078BC", PBKS:"#ED1B24", RR:"#254AA5",
  LSG:"#00A0E3", GT:"#1C4587",
};

const KEEPERS = new Set([
  "MS Dhoni","SV Samson","Q de Kock","Ishan Kishan","RR Pant",
  "JC Buttler","Dhruv Jurel","N Pooran","HE Klaasen","A Porel",
  "Jitesh Sharma","P Salt","P Singh","RD Gaikwad","F Allen",
  "T Seifert","J Inglis","Anuj Rawat","K Kushagra","V Vinod",
  "Robin Minz","R Rickelton","B Duckett","T Stubbs","D Ferreira",
]);

const OVERSEAS = new Set([
  "Q de Kock","T Boult","TA Boult","MJ Santner","W Jacks","T David",
  "P Salt","JR Hazlewood","R Shepherd","J Bethell","N Thushara",
  "J Duffy","J Cox","SP Narine","S Narine","C Green","Rachin Ravindra",
  "Matheesha Pathirana","R Powell","F Allen","T Seifert",
  "B Muzarabani","TM Head","T Head","HE Klaasen","LS Livingstone",
  "PJ Cummins","B Carse","Kamindu Mendis","D Payne","J Edwards",
  "DA Miller","P Nissanka","B Duckett","T Stubbs","MA Starc","M Starc",
  "L Ngidi","KA Jamieson","D Chameera","MP Stoinis","M Stoinis",
  "M Jansen",
  "Azmatullah Omarzai","X Bartlett","L Ferguson","C Connolly",
  "B Dwarshuis","M Owen","JC Archer","SO Hetmyer","D Shanaka",
  "N Burger","K Maphaka","A Milne","L Pretorius","D Ferreira",
  "JC Buttler","Rashid Khan","K Rabada","GD Phillips","J Holder","JO Holder",
  "L Wood","T Banton","N Pooran","AK Markram","A Markram",
  "MR Marsh","M Marsh",
  "Wanindu Hasaranga","A Nortje","J Inglis","M Breetzke",
  "D Brevis","Spencer Johnson","J Overton","N Ellis","Matt Henry",
  "Noor Ahmad","R Rickelton","C Bosch","S Rutherford",
  "AM Ghazanfar","E Malinga","Musheer Khan",
]);

// ── Team full-name lookup for Cricsheet ──────────────────────
const TEAM_ABBR: Record<string,string> = {
  "Chennai Super Kings":"CSK","Mumbai Indians":"MI",
  "Royal Challengers Bangalore":"RCB","Royal Challengers Bengaluru":"RCB",
  "Kolkata Knight Riders":"KKR","Sunrisers Hyderabad":"SRH",
  "Delhi Capitals":"DC","Delhi Daredevils":"DC",
  "Punjab Kings":"PBKS","Kings XI Punjab":"PBKS",
  "Rajasthan Royals":"RR","Lucknow Super Giants":"LSG",
  "Gujarat Titans":"GT","Rising Pune Supergiant":"RPS",
  "Rising Pune Supergiants":"RPS","Gujarat Lions":"GL",
  "Deccan Chargers":"DCH","Kochi Tuskers Kerala":"KTK",
  "Pune Warriors":"PW",
};

// ── Accumulators ─────────────────────────────────────────────
interface Bat { matches: Set<string>; innings: number; runs: number; balls: number; dismissals: number; centuries: number; fifties: number; highest: number }
interface Bowl { balls: number; runs: number; wickets: number; bestW: number; bestR: number }
interface SeasonRow { season: string; batRuns: number; bowlWkts: number }

const bat = new Map<string,Bat>();
const bowl = new Map<string,Bowl>();
const seasonStats = new Map<string,Map<string,SeasonRow>>();
const lastTeam = new Map<string,string>();
const recentScores = new Map<string,number[]>();
const innTrk = new Map<string,number>();
const mBowl = new Map<string,{w:number;r:number}>();

function gb(n:string):Bat{if(!bat.has(n))bat.set(n,{matches:new Set(),innings:0,runs:0,balls:0,dismissals:0,centuries:0,fifties:0,highest:0});return bat.get(n)!}
function gw(n:string):Bowl{if(!bowl.has(n))bowl.set(n,{balls:0,runs:0,wickets:0,bestW:0,bestR:9999});return bowl.get(n)!}
function gs(n:string,s:string):SeasonRow{if(!seasonStats.has(n))seasonStats.set(n,new Map());const m=seasonStats.get(n)!;if(!m.has(s))m.set(s,{season:s,batRuns:0,bowlWkts:0});return m.get(s)!}

// ── Process matches ──────────────────────────────────────────
const inDir = process.argv[2];
if(!inDir){console.error("Usage: npx ts-node --project tsconfig.scripts.json scripts/rebuild-players.ts ./ipl_json");process.exit(1)}
const outDir=path.resolve("public/data");fs.mkdirSync(outDir,{recursive:true});
const files=fs.readdirSync(inDir).filter(f=>f.endsWith(".json")&&!f.includes("README"));
console.log(`Found ${files.length} match files`);

interface PM{file:string;match:MatchFile}
const all:PM[]=[];
for(const f of files){try{all.push({file:f,match:JSON.parse(fs.readFileSync(path.join(inDir,f),"utf-8"))})}catch{}}
all.sort((a,b)=>(a.match.info.dates[0]||"").localeCompare(b.match.info.dates[0]||""));
console.log(`Parsed ${all.length} matches`);

for(const{file,match}of all){
  const mid=file.replace(".json",""),ssn=match.info.season;
  mBowl.clear();
  for(const inn of match.innings){
    const bt=inn.team, bwt=match.info.teams?.find(t=>t!==bt)||"";
    innTrk.clear();
    for(const ov of inn.overs){for(const d of ov.deliveries){
      const w=!!d.extras?.wides,nb=!!d.extras?.noballs,leg=!w&&!nb;
      const b=gb(d.batter);b.matches.add(mid);
      if(!innTrk.has(d.batter)){b.innings++;innTrk.set(d.batter,0)}
      b.runs+=d.runs.batter;innTrk.set(d.batter,(innTrk.get(d.batter)||0)+d.runs.batter);
      if(leg)b.balls++;
      gs(d.batter,ssn).batRuns+=d.runs.batter;
      lastTeam.set(d.batter,bt);lastTeam.set(d.non_striker,bt);if(bwt)lastTeam.set(d.bowler,bwt);
      const bw=gw(d.bowler);if(leg)bw.balls++;bw.runs+=d.runs.total;
      if(!mBowl.has(d.bowler))mBowl.set(d.bowler,{w:0,r:0});const mb=mBowl.get(d.bowler)!;mb.r+=d.runs.total;
      if(d.wickets)for(const wk of d.wickets){
        const dis=gb(wk.player_out);dis.dismissals++;
        const dr=innTrk.get(wk.player_out)||0;if(dr>dis.highest)dis.highest=dr;
        if(dr>=100)dis.centuries++;else if(dr>=50)dis.fifties++;
        if(["bowled","caught","lbw","stumped","caught and bowled","hit wicket"].includes(wk.kind)){
          bw.wickets++;mb.w++;gs(d.bowler,ssn).bowlWkts++;
        }
      }
    }}
    for(const[n,r]of Array.from(innTrk.entries())){
      const b=gb(n);if(r>b.highest)b.highest=r;
      if(!recentScores.has(n))recentScores.set(n,[]);
      const a=recentScores.get(n)!;a.push(r);if(a.length>10)a.splice(0,a.length-10);
    }
  }
  for(const[n,mb]of Array.from(mBowl.entries())){
    const bw=gw(n);if(mb.w>bw.bestW||(mb.w===bw.bestW&&mb.r<bw.bestR)){bw.bestW=mb.w;bw.bestR=mb.r}
  }
}

// ── Build squad lookup: cricsheet name → IPL 2026 team ───────
const squad2026=new Map<string,string>();
for(const[team,players]of Object.entries(IPL2026)){
  for(const p of players) squad2026.set(p,team);
}

function resolve(cname:string):string{
  if(squad2026.has(cname))return squad2026.get(cname)!;
  const lt=lastTeam.get(cname)||"";
  return TEAM_ABBR[lt]||"IPL";
}

// ── Active = in any IPL 2026 squad ───────────────────────────
const activeSet=new Set<string>();
for(const players of Object.values(IPL2026))for(const p of players)activeSet.add(p);

// ── Role inference ───────────────────────────────────────────
function role(n:string):"Batsman"|"Bowler"|"All-rounder"|"Wicket-keeper"{
  if(KEEPERS.has(n)||KEEPERS.has(NAMES[n]||""))return"Wicket-keeper";
  const b=bat.get(n),w=bowl.get(n);
  const wk=w?.wickets||0, r=b?.runs||0;
  if(wk>20&&r>500)return"All-rounder";
  if(wk>10&&r<300)return"Bowler";
  if(wk>0&&r<100&&(w?.balls||0)>100)return"Bowler";
  return"Batsman";
}

// ── Build output ─────────────────────────────────────────────
interface Out{
  id:string;name:string;cricsheetName:string;espnId:number;
  team:string;role:string;nationality:string;image:string;teamColor:string;
  stats:{runs:number;average:number;strikeRate:number;wickets:number;economy:number;hundreds:number;fifties:number;dismissals:number;bestFigures?:string};
  recentForm:number[];highlights:string[];active:boolean;
  career:{season:number;runs:number;wickets:number}[];
  fantasyTag:string;
}

// Collect IPL 2026 squad players WHO HAVE CRICSHEET DATA + top legacy players
const include=new Set<string>();
// Only add squad members who actually appeared in at least 1 Cricsheet match
for(const p of activeSet){
  if(bat.has(p) && bat.get(p)!.matches.size>=1) include.add(p);
}
console.log(`Squad players with Cricsheet data: ${include.size}/${activeSet.size}`);
// Also add top historical icons (non-squad) who have 10+ matches
const histPlayers=Array.from(bat.keys())
  .filter(n=>!activeSet.has(n))
  .map(n=>({n,imp:(bat.get(n)!.runs/100)+((bowl.get(n)?.wickets||0)*3)}))
  .sort((a,b)=>b.imp-a.imp);
for(const hp of histPlayers){if(include.size>=160)break;if(bat.get(hp.n)!.matches.size>=10)include.add(hp.n)}

const output:Out[]=[];
for(const cname of include){
  const b=bat.get(cname);
  const w=bowl.get(cname)||{balls:0,runs:0,wickets:0,bestW:0,bestR:9999};
  const team=resolve(cname);
  const isActive=activeSet.has(cname);
  const r=role(cname);
  const dname=NAMES[cname]||cname;
  const avg=b&&b.dismissals>0?Math.round(b.runs/b.dismissals*100)/100:0;
  const sr=b&&b.balls>0?Math.round(b.runs/b.balls*10000)/100:0;
  const eco=w.balls>0?Math.round(w.runs/(w.balls/6)*100)/100:0;
  const bf=w.bestW>0&&w.bestR<9000?`${w.bestW}/${w.bestR}`:undefined;
  const scores=recentScores.get(cname)||[];
  const rf=scores.slice(-5);while(rf.length<5)rf.unshift(0);
  const sm=seasonStats.get(cname);
  const career:(typeof output[0]["career"][0])[]=[];
  if(sm){
    const sorted=Array.from(sm.values()).map(s=>({season:parseInt(s.season)||0,runs:s.batRuns,wickets:s.bowlWkts})).filter(s=>s.season>=2020).sort((a,b)=>a.season-b.season);
    career.push(...sorted.slice(-5));
  }
  const id=dname.toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"");
  const hl:string[]=[];
  if(b){
    if(b.centuries>0)hl.push(`${b.centuries} IPL ${b.centuries===1?"century":"centuries"} (highest: ${b.highest})`);
    if(b.fifties>5)hl.push(`${b.fifties} IPL half-centuries`);
    if(b.runs>5000)hl.push(`${b.runs.toLocaleString()} career IPL runs`);
    else if(b.runs>3000)hl.push(`${b.runs.toLocaleString()} career IPL runs`);
    if(w.wickets>100)hl.push(`${w.wickets} career IPL wickets`);
    else if(w.wickets>50)hl.push(`${w.wickets} career IPL wickets`);
    if(b.matches.size>100)hl.push(`Veteran of ${b.matches.size} IPL matches`);
  }
  while(hl.length<3)hl.push(`Key player for ${team} in IPL 2026`);

  const totalImpact=(b?.runs||0)/200+w.wickets*2;
  const ftag=!isActive?"Value Play":totalImpact>40?"Captain Core":totalImpact>20?"Form Pick":"Value Play";
  const nat:string=OVERSEAS.has(cname)?"Overseas":"Indian";

  output.push({
    id, name:dname, cricsheetName:cname, espnId:ESPN[cname]||0,
    team, role:r, nationality:nat, image:`/images/players/${id}.jpg`,
    teamColor:TEAM_COLORS[team]||"#080C18",
    stats:{runs:b?.runs||0,average:avg,strikeRate:sr,wickets:w.wickets,economy:eco,hundreds:b?.centuries||0,fifties:b?.fifties||0,dismissals:b?.dismissals||0,bestFigures:bf},
    recentForm:rf, highlights:hl.slice(0,3), active:isActive,
    career, fantasyTag:ftag,
  });
}

output.sort((a,b)=>{if(a.active!==b.active)return a.active?-1:1;return b.stats.runs-a.stats.runs});
fs.writeFileSync(path.join(outDir,"players.json"),JSON.stringify(output,null,2));
console.log(`\n✅ players.json: ${output.length} players (${output.filter(p=>p.active).length} active)`);

// Team distribution
const td=new Map<string,number>();
for(const p of output.filter(p=>p.active))td.set(p.team,(td.get(p.team)||0)+1);
console.log("\n--- IPL 2026 team distribution ---");
for(const[t,c]of Array.from(td.entries()).sort((a,b)=>b[1]-a[1]))console.log(`  ${t}: ${c}`);

// Top 10 by runs
console.log("\n--- Top 10 by runs ---");
[...output].sort((a,b)=>b.stats.runs-a.stats.runs).slice(0,10).forEach(p=>
  console.log(`  ${p.name} (${p.team}): ${p.stats.runs} runs | active=${p.active}`)
);
