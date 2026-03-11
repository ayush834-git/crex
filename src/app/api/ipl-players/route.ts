import { NextResponse } from "next/server"

// cricketdata.org series ID for IPL — fetch this once to get it
const IPL_SERIES_ID = "d5a498c8-7596-4b93-8ab0-e0efc3345312" // IPL 2024

export async function GET() {
  const KEY = process.env.CRICKET_API_KEY

  try {
    // Step 1: get all squads for the IPL series
    const squadRes = await fetch(
      `https://api.cricketdata.org/series_squad?apikey=${KEY}&id=${IPL_SERIES_ID}`,
      { next: { revalidate: 86400 } }
    )
    const squadData = await squadRes.json()

    // Step 2: flatten all players across all teams
    const players: any[] = []
    for (const team of (squadData.data ?? [])) {
      for (const player of (team.players ?? [])) {
        players.push({
          id: player.id,
          name: player.name,
          team: team.teamname,
          teamShort: team.teamshortname ?? team.teamname.slice(0, 3).toUpperCase(),
          role: normalizeRole(player.role),
          country: player.country,
          battingStyle: player.battingStyle,
          bowlingStyle: player.bowlingStyle,
        })
      }
    }

    return NextResponse.json(
      { data: players },
      { headers: { "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=172800" } }
    )
  } catch {
    return NextResponse.json({ data: [] })
  }
}

function normalizeRole(role: string): string {
  const r = role?.toLowerCase() ?? ""
  if (r.includes("allrounder") || r.includes("all-rounder")) return "ALLROUNDER"
  if (r.includes("bowl")) return "BOWLER"
  if (r.includes("keep") || r.includes("wk")) return "WICKETKEEPER"
  return "BATTER"
}
