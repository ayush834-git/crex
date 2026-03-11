"use client"
import { useState, useEffect } from "react"

const cache = new Map<string, string | null>()

export function usePlayerImage(espnId: number, name: string) {
  const key = String(espnId)
  const [url, setUrl] = useState<string | null>(cache.get(key) ?? null)
  const [loading, setLoading] = useState(!cache.has(key))

  useEffect(() => {
    if (cache.has(key)) return
    setLoading(true)
    fetch(`/api/player-image?espnId=${espnId}&name=${encodeURIComponent(name)}`)
      .then(r => r.json())
      .then(data => {
        cache.set(key, data.url)
        setUrl(data.url)
      })
      .catch(() => {
        cache.set(key, null)
        setUrl(null)
      })
      .finally(() => setLoading(false))
  }, [espnId, name, key])

  return { url, loading }
}
