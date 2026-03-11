import { NextResponse } from "next/server"
import { cricketAPI } from "@/lib/cricket-api"

export async function GET() {
  const data = await cricketAPI.matches()
  return NextResponse.json(
    { data: data ?? [] },
    { headers: { "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=7200" } }
  )
}
