import { NextResponse } from "next/server";
import { getMatch } from "@/lib/server/crex-data";

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const match = await getMatch(id);
  return NextResponse.json(match);
}
