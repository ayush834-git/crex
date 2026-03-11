import { NextResponse } from "next/server"
import { cricketAPI } from "@/lib/cricket-api"

export async function GET() {
  const data = await cricketAPI.liveScores()
  return NextResponse.json(
    { data: data ?? [] },
    { headers: { "Cache-Control": "public, s-maxage=120, stale-while-revalidate=300" } }
  )
}
