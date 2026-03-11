/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useEffect, useState } from "react"

export function LiveStatsPanel({ playerName }: { playerName: string }) {
  const [data, setData] = useState<any>(null)

  useEffect(() => {
    fetch(`/api/player-stats-live?name=${encodeURIComponent(playerName)}`)
      .then(r => r.json())
      .then(d => {
        const match = (d.data ?? []).find((p: any) =>
          p.name?.toLowerCase().includes(playerName.split(" ")[1]?.toLowerCase() ?? "")
        )
        setData(match ?? null)
      })
      .catch(() => {})
  }, [playerName])

  if (!data) return null // silently hide if no data

  return (
    <section style={{ marginTop: 48 }}>
      <h3 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 900, fontSize: 36,
        color: "#1A1AE6", letterSpacing: "0.05em" }} className="mb-6 uppercase">
        Current Season
      </h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {data.battingStats && Object.entries(data.battingStats).slice(0, 4).map(([k, v]) => (
          <div key={k} style={{ background: "#F5C518", padding: 20, border: "3px solid #1A1AE6", boxShadow: "4px 4px 0 #1A1AE6" }}>
            <span style={{ display: "block", fontFamily: "Inter", fontSize: 11, fontWeight: "bold",
              color: "#1A1AE6", textTransform: "uppercase",
              letterSpacing: "0.15em", marginBottom: 8 }}>{k}</span>
            <span style={{ fontFamily: "JetBrains Mono", fontSize: 28,
              fontWeight: 900, color: "#080C18" }}>{String(v)}</span>
          </div>
        ))}
      </div>
    </section>
  )
}
