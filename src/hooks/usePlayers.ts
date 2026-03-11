"use client"
import { useState, useEffect } from "react"
import { stitchPlayer } from "@/lib/player-registry"
import { PLAYERS as STATIC_PLAYERS } from "@/data/players" // keep as fallback

let cache: any[] | null = null

export function usePlayers() {
  const [players, setPlayers] = useState<any[]>(cache ?? STATIC_PLAYERS)
  const [loading, setLoading] = useState(!cache)
  const [total, setTotal] = useState(cache?.length ?? STATIC_PLAYERS.length)

  useEffect(() => {
    if (cache) return

    fetch("/api/ipl-players")
      .then(r => r.json())
      .then(d => {
        const raw = d.data ?? []
        if (raw.length === 0) {
          // API returned nothing — stay with static fallback
          setPlayers(STATIC_PLAYERS)
          setTotal(STATIC_PLAYERS.length)
          return
        }
        const stitched = raw.map(stitchPlayer)
        cache = stitched
        setPlayers(stitched)
        setTotal(stitched.length)
      })
      .catch(() => {
        setPlayers(STATIC_PLAYERS)
        setTotal(STATIC_PLAYERS.length)
      })
      .finally(() => setLoading(false))
  }, [])

  return { players, loading, total }
}
