import { NextRequest, NextResponse } from "next/server";
import { getFantasyPicks } from "@/lib/server/crex-data";

export async function GET(request: NextRequest) {
  const matchId = request.nextUrl.searchParams.get("matchId") ?? undefined;
  return NextResponse.json(await getFantasyPicks(matchId), {
    headers: { "Cache-Control": "public, s-maxage=300, stale-while-revalidate=900" },
  });
}
