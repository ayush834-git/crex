/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"
import { useEffect, useState } from "react"

export default function MatchesPage() {
  const [matches, setMatches] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/matches")
      .then(r => r.json())
      .then(d => setMatches(d.data ?? []))
      .finally(() => setLoading(false))
  }, [])

  const live = matches.filter(m => m.status?.toLowerCase().includes("live"))
  const recent = matches.filter(m => !m.status?.toLowerCase().includes("live"))

  if (loading) return (
    <div style={{ background: "#080C18", minHeight: "100vh" }}
      className="flex items-center justify-center">
      <span style={{ fontFamily: "Barlow Condensed", fontSize: 48, color: "#F5C518", fontWeight: 900 }}>
        LOADING...
      </span>
    </div>
  )

  return (
    <main style={{ background: "#080C18", minHeight: "100vh" }} className="px-6 md:px-12 py-24">
      <h1 style={{ fontFamily: "Barlow Condensed", fontSize: "clamp(60px,10vw,120px)",
        fontWeight: 900, color: "#fff", lineHeight: 0.85 }} className="mb-12 uppercase">
        MATCHES<span style={{ color: "#E63946" }}>.</span>
      </h1>

      {live.length > 0 && (
        <section className="mb-16">
          <h2 style={{ fontFamily: "Barlow Condensed", fontSize: 32, fontWeight: 900,
            color: "#E63946", letterSpacing: "0.1em" }} className="mb-6 uppercase">
            🔴 Live Now
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {live.map(m => <MatchCard key={m.id} match={m} isLive />)}
          </div>
        </section>
      )}

      <section>
        <h2 style={{ fontFamily: "Barlow Condensed", fontSize: 32, fontWeight: 900,
          color: "#F5C518", letterSpacing: "0.1em" }} className="mb-6 uppercase">
          Recent & Upcoming
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recent.map(m => <MatchCard key={m.id} match={m} isLive={false} />)}
        </div>
      </section>

      {matches.length === 0 && (
        <p style={{ color: "#F5C518", fontFamily: "JetBrains Mono", fontSize: 18 }}>
          No matches available — API key may be missing or rate limited.
        </p>
      )}
    </main>
  )
}

function MatchCard({ match: m, isLive }: { match: any, isLive: boolean }) {
  const team1 = m.teamInfo?.[0]
  const team2 = m.teamInfo?.[1]
  const s = m.score ?? []

  return (
    <div style={{ background: "#0D1225", border: `3px solid ${isLive ? "#E63946" : "#F5C51840"}`,
      borderRadius: 4, padding: 24, position: "relative" }}>
      {isLive && (
        <span style={{ position: "absolute", top: 16, right: 16, background: "#E63946",
          color: "#fff", fontFamily: "Barlow Condensed", fontWeight: 900,
          fontSize: 14, padding: "2px 10px", letterSpacing: "0.15em" }}>
          LIVE
        </span>
      )}
      <p style={{ color: "rgba(255,255,255,0.5)", fontFamily: "Inter", fontSize: 12,
        marginBottom: 12, textTransform: "uppercase", letterSpacing: "0.1em" }}>
        {m.venue ?? "Venue TBC"} · {m.date}
      </p>
      <div className="flex flex-col gap-3">
        {[team1, team2].map((t, i) => (
          <div key={i} className="flex items-center justify-between">
            <span style={{ fontFamily: "Barlow Condensed", fontWeight: 900,
              fontSize: 28, color: "#fff" }}>
              {t?.shortname ?? m.teams?.[i] ?? "TBC"}
            </span>
            {s[i] && (
              <span style={{ fontFamily: "JetBrains Mono", fontSize: 20,
                color: "#F5C518", fontWeight: 700 }}>
                {s[i].r}/{s[i].w} <span style={{ fontSize: 14, color: "rgba(255,255,255,0.5)" }}>({s[i].o})</span>
              </span>
            )}
          </div>
        ))}
      </div>
      <p style={{ marginTop: 16, fontFamily: "Inter", fontSize: 13,
        color: isLive ? "#00C9A7" : "rgba(255,255,255,0.5)" }}>
        {m.status}
      </p>
    </div>
  )
}
