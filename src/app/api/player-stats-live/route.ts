import { NextRequest, NextResponse } from "next/server"
import { cricketAPI } from "@/lib/cricket-api"

export async function GET(req: NextRequest) {
  const name = req.nextUrl.searchParams.get("name") ?? ""
  const data = await cricketAPI.playerSearch(name)
  return NextResponse.json(
    { data: data ?? [] },
    { headers: { "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=172800" } }
  )
}
