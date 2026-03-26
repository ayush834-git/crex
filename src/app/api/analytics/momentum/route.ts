import { NextRequest, NextResponse } from "next/server";
import { getMomentum } from "@/lib/server/crex-data";

export async function GET(request: NextRequest) {
  const matchId = request.nextUrl.searchParams.get("matchId") ?? undefined;
  return NextResponse.json(await getMomentum(matchId), {
    headers: { "Cache-Control": "public, s-maxage=60, stale-while-revalidate=180" },
  });
}
