"use client";


const ROW1_TEAMS = [
  { name: "MI", bg: "#004EA2", text: "#ACDCF8", border: "#7EC8FF" },
  { name: "CSK", bg: "#F5A623", text: "#1C2B6B", border: "#FFD166" },
  { name: "RCB", bg: "#E63946", text: "#FFFFFF", border: "#FF6B77" },
  { name: "KKR", bg: "#3A1F6E", text: "#F5C518", border: "#7B5DD6" },
  { name: "DC", bg: "#0078FF", text: "#FFFFFF", border: "#44A3FF" },
  { name: "SRH", bg: "#FF6B2B", text: "#FFFFFF", border: "#FFB088" },
  { name: "GT", bg: "#1B4F8C", text: "#C8A84B", border: "#4477B8" },
  { name: "LSG", bg: "#00B4D8", text: "#0A0E1F", border: "#48CAE4" },
  { name: "PBKS", bg: "#D4173A", text: "#DCAA34", border: "#FF4D6D" },
  { name: "RR", bg: "#E91E8C", text: "#FFFFFF", border: "#FF6EC7" },
];

const ROW2_STATS = [
  { player: "VIRAT KOHLI", metric: "8,661 RUNS", teamCode: "RCB", teamColor: "#E63946" },
  { player: "ROHIT SHARMA", metric: "7,046 RUNS", teamCode: "MI", teamColor: "#004EA2" },
  { player: "MS DHONI", metric: "5,082 RUNS", teamCode: "CSK", teamColor: "#F5A623" },
  { player: "SURESH RAINA", metric: "5,528 RUNS", teamCode: "CSK", teamColor: "#F5A623" },
  { player: "DAVID WARNER", metric: "6,398 RUNS", teamCode: "SRH", teamColor: "#FF6B2B" },
  { player: "AB DE VILLIERS", metric: "5,162 RUNS", teamCode: "RCB", teamColor: "#E63946" },
  { player: "JASPRIT BUMRAH", metric: "175 WKTS", teamCode: "MI", teamColor: "#004EA2" },
  { player: "DJ BRAVO", metric: "183 WKTS", teamCode: "CSK", teamColor: "#F5A623" },
  { player: "YUZVENDRA CHAHAL", metric: "205 WKTS", teamCode: "RR", teamColor: "#E91E8C" },
  { player: "LASITH MALINGA", metric: "170 WKTS", teamCode: "MI", teamColor: "#004EA2" },
];

export function TeamMarquee() {
  const dupTeams = [...ROW1_TEAMS, ...ROW1_TEAMS, ...ROW1_TEAMS, ...ROW1_TEAMS];
  const dupStats = [...ROW2_STATS, ...ROW2_STATS, ...ROW2_STATS, ...ROW2_STATS];

  return (
    <section className="relative w-full overflow-hidden py-[24px] group" style={{ background: "#1A1AE6", borderTop: "4px solid #F5C518", borderBottom: "4px solid #F5C518" }}>
      
      {/* Edge Fading gradients */}
      <div 
        className="absolute left-0 top-0 bottom-0 w-[80px] z-10 pointer-events-none"
        style={{ background: "linear-gradient(to right, #1A1AE6, transparent)" }}
      />
      <div 
        className="absolute right-0 top-0 bottom-0 w-[80px] z-10 pointer-events-none"
        style={{ background: "linear-gradient(to left, #1A1AE6, transparent)" }}
      />

      {/* Row 1 - Team name horizontal pills, scroll LEFT, 28s */}
      <div className="flex whitespace-nowrap mb-[16px]">
        <div 
          className="flex gap-[20px] items-center flex-nowrap shrink-0 px-[20px] animate-[marquee-left_28s_linear_infinite] group-hover:[animation-play-state:paused] hover:![animation-play-state:paused] transition-all"
        >
          {dupTeams.map((team, idx) => (
            <div
              key={`${team.name}-${idx}`}
              className="flex items-center justify-center shrink-0"
              style={{
                borderRadius: "100px",
                background: team.bg,
                color: team.text,
                border: `2px solid ${team.border}`,
                padding: "8px 20px",
                fontFamily: "'Barlow Condensed', sans-serif",
                fontWeight: 700,
                fontSize: "16px",
                textTransform: "uppercase",
                boxShadow: "inset 0 1px 0 rgba(255,255,255,0.2), 0 2px 8px rgba(0,0,0,0.3)"
              }}
            >
              {team.name}
            </div>
          ))}
        </div>
      </div>

      {/* Row 2 - Player stats ticker, scroll RIGHT, 22s */}
      <div className="flex whitespace-nowrap bg-transparent">
        <div 
          className="flex gap-[24px] items-center flex-nowrap shrink-0 px-[20px]"
        >
          <div className="flex gap-[24px] items-center animate-[marquee-right_22s_linear_infinite] group-hover:[animation-play-state:paused] hover:![animation-play-state:paused]">
            
            {dupStats.map((stat, idx) => (
              <div key={`${stat.player}-${idx}`} className="flex items-center gap-[24px] shrink-0">
                <div className="flex items-center">
                  <span className="text-[#F5C518]" style={{ fontFamily: "'Inter', sans-serif", fontWeight: 700, fontSize: "14px", textTransform: "uppercase" }}>{stat.player}</span>
                  <span className="mx-3" style={{ color: "rgba(255,255,255,0.5)" }}>·</span>
                  <span style={{ color: "white", fontFamily: "'JetBrains Mono', monospace", fontWeight: 700, fontSize: "14px" }}>{stat.metric}</span>
                  <span className="mx-3" style={{ color: "rgba(255,255,255,0.5)" }}>·</span>
                  <span style={{ color: stat.teamColor, fontFamily: "'Inter', sans-serif", fontWeight: 900, fontSize: "14px" }}>{stat.teamCode}</span>
                </div>
                
                {/* Vertical Separator */}
                <div className="w-[2px] h-[24px]" style={{ background: "rgba(255,255,255,0.2)" }} />
              </div>
            ))}
          </div>
        </div>
      </div>

    </section>
  );
}
