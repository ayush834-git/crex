import { NextRequest, NextResponse } from "next/server";

function buildEspnImageUrl(espnId: string) {
  const numericId = Number(espnId);
  if (!Number.isFinite(numericId) || numericId <= 0) return null;
  return `https://img1.hscicdn.com/image/upload/f_auto,t_ds_w_320,q_80/lsci/db/PICTURES/CMS/${Math.floor(numericId / 1000) * 1000}/${numericId}.png`;
}

export async function GET(request: NextRequest) {
  const espnId = request.nextUrl.searchParams.get("espnId");
  const name = request.nextUrl.searchParams.get("name")?.trim() ?? "";

  const espnUrl = espnId ? buildEspnImageUrl(espnId) : null;
  if (espnUrl) {
    try {
      const check = await fetch(espnUrl, { method: "HEAD", next: { revalidate: 604800 } });
      if (check.ok) {
        return NextResponse.json(
          { url: espnUrl },
          { headers: { "Cache-Control": "public, s-maxage=604800, stale-while-revalidate=1209600" } }
        );
      }
    } catch {
      // Fall through to the secondary source.
    }
  }

  if (!name) {
    return NextResponse.json({ url: null }, { headers: { "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400" } });
  }

  try {
    const searchResponse = await fetch(
      `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(`${name} cricketer`)}&format=json`,
      {
        headers: { "User-Agent": "CREX/1.0" },
        next: { revalidate: 604800 },
      }
    );
    const searchData = (await searchResponse.json()) as {
      query?: { search?: Array<{ title?: string }> };
    };
    const wikiTitle = searchData.query?.search?.[0]?.title ?? name;

    const imageResponse = await fetch(
      `https://en.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(wikiTitle)}&prop=pageimages&format=json&pithumbsize=400`,
      {
        headers: { "User-Agent": "CREX/1.0" },
        next: { revalidate: 604800 },
      }
    );
    const imageData = (await imageResponse.json()) as {
      query?: { pages?: Record<string, { thumbnail?: { source?: string } }> };
    };
    const page = Object.values(imageData.query?.pages ?? {})[0];
    const url = page?.thumbnail?.source ?? null;

    return NextResponse.json(
      { url },
      { headers: { "Cache-Control": "public, s-maxage=604800, stale-while-revalidate=1209600" } }
    );
  } catch {
    return NextResponse.json({ url: null }, { headers: { "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400" } });
  }
}
