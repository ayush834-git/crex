import { NextRequest, NextResponse } from "next/server";
import { getPlayers } from "@/lib/server/crex-data";

export async function GET(req: NextRequest) {
  const name = req.nextUrl.searchParams.get("name") ?? "";
  const data = await getPlayers({ query: name, limit: 10 });
  return NextResponse.json(
    { data: data.players, source: data.source },
    { headers: { "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=172800" } }
  );
}
