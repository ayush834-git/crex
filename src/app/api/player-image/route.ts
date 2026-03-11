import { NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest) {
  const espnId = req.nextUrl.searchParams.get("espnId")
  const name = req.nextUrl.searchParams.get("name") ?? ""

  // Source 1: ESPN direct CDN (works for known IDs)
  if (espnId) {
    const espnUrl = `https://img1.hscicdn.com/image/upload/f_auto,t_ds_w_320,q_80/lsci/db/PICTURES/CMS/${Math.floor(Number(espnId)/1000)*1000}/${espnId}.png`
    try {
      const check = await fetch(espnUrl, { method: "HEAD" })
      if (check.ok) {
        return NextResponse.json({ url: espnUrl }, {
          headers: { "Cache-Control": "public, s-maxage=86400" }
        })
      }
    } catch {}
  }

  // Source 2: Wikipedia API fallback
  try {
    const wikiName = name.replace(/\s+/g, "_")
    const wikiRes = await fetch(
      `https://en.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(wikiName)}&prop=pageimages&format=json&pithumbsize=400&origin=*`,
      { next: { revalidate: 86400 } }
    )
    const wikiData = await wikiRes.json()
    const pages = wikiData.query?.pages ?? {}
    const page = Object.values(pages)[0] as any
    const url = page?.thumbnail?.source ?? null
    return NextResponse.json({ url }, {
      headers: { "Cache-Control": "public, s-maxage=86400" }
    })
  } catch {
    return NextResponse.json({ url: null })
  }
}
