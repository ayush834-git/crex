import { NextRequest, NextResponse } from "next/server";
import { getWinProbability } from "@/lib/server/crex-data";

export async function GET(request: NextRequest) {
  const matchId = request.nextUrl.searchParams.get("matchId") ?? undefined;
  return NextResponse.json(await getWinProbability(matchId), {
    headers: { "Cache-Control": "public, s-maxage=30, stale-while-revalidate=90" },
  });
}
