import { NextResponse } from "next/server";
import { getMatches } from "@/lib/server/crex-data";

export async function GET() {
  const data = await getMatches("live");
  return NextResponse.json(
    { data: data.matches, source: data.source },
    { headers: { "Cache-Control": "public, s-maxage=120, stale-while-revalidate=300" } }
  );
}
