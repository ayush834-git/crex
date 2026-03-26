import { NextRequest, NextResponse } from "next/server";
import type { MatchStatus } from "@/lib/types";
import { getMatches } from "@/lib/server/crex-data";

export async function GET(request: NextRequest) {
  const statusParam = request.nextUrl.searchParams.get("status");
  const limit = Number(request.nextUrl.searchParams.get("limit") ?? "0");
  const normalizedStatus =
    statusParam === "recent" ? "completed" : (statusParam as MatchStatus | null);

  const payload = await getMatches(normalizedStatus ?? undefined, limit || undefined);

  return NextResponse.json(payload, {
    headers: { "Cache-Control": "public, s-maxage=30, stale-while-revalidate=90" },
  });
}
