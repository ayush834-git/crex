const BASE = "https://api.cricketdata.org"
const KEY = process.env.CRICKET_API_KEY

async function apiFetch(endpoint: string, revalidate: number) {
  if (!KEY) {
    console.warn("[CREX] CRICKET_API_KEY not set — skipping live data")
    return null
  }
  try {
    const url = `${BASE}${endpoint}&apikey=${KEY}`
    const res = await fetch(url, { next: { revalidate } })
    if (!res.ok) return null
    const json = await res.json()
    return json.status === "success" ? json.data : null
  } catch {
    return null
  }
}

export const cricketAPI = {
  liveScores: () => apiFetch("/cricket-scorecard-lite?offset=0", 120),
  matches: () => apiFetch("/matches?offset=0", 3600),
  playerSearch: (name: string) => apiFetch(`/players?offset=0&name=${encodeURIComponent(name)}`, 86400),
  seriesList: () => apiFetch("/series?offset=0", 86400),
}
