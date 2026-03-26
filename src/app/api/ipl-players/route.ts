import { NextResponse } from "next/server";
import { getPlayers } from "@/lib/server/crex-data";

export async function GET() {
  const payload = await getPlayers({ limit: 120 });
  return NextResponse.json(
    { data: payload.players, source: payload.source },
    { headers: { "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=7200" } }
  );
}
