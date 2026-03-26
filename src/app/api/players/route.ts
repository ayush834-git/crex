import { NextRequest, NextResponse } from "next/server";
import { getPlayers } from "@/lib/server/crex-data";

export async function GET(request: NextRequest) {
  const search = request.nextUrl.searchParams.get("search") ?? "";
  const team = request.nextUrl.searchParams.get("team")?.split(",").filter(Boolean) ?? [];
  const role = request.nextUrl.searchParams.get("role")?.split(",").filter(Boolean) ?? [];
  const nationality = request.nextUrl.searchParams.get("nationality")?.split(",").filter(Boolean) ?? [];
  const page = Number(request.nextUrl.searchParams.get("page") ?? "1");
  const limit = Number(request.nextUrl.searchParams.get("limit") ?? "20");
  const payload = await getPlayers({ query: search, team, role, nationality, page, limit });
  return NextResponse.json(payload, {
    headers: { "Cache-Control": "public, s-maxage=300, stale-while-revalidate=900" },
  });
}
