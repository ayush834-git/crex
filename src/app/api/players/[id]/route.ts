import { NextResponse } from "next/server";
import { getPlayer } from "@/lib/server/crex-data";

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return NextResponse.json(await getPlayer(id));
}
