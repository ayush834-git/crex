"use client"
import Image from "next/image"
import { usePlayerImage } from "@/hooks/usePlayerImage"

interface Props {
  espnId: number
  name: string
  teamColor: string
  className?: string
}

export function PlayerImage({ espnId, name, teamColor, className = "" }: Props) {
  const { url, loading } = usePlayerImage(espnId, name)
  const initials = name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase()

  if (loading) {
    return (
      <div className={`${className} animate-pulse relative`}
        style={{ background: `linear-gradient(135deg, ${teamColor}44, ${teamColor}11)` }} />
    )
  }

  if (!url) {
    return (
      <div className={`${className} flex items-center justify-center relative`}
        style={{ background: `linear-gradient(135deg, ${teamColor}66, ${teamColor}22)` }}>
        <span style={{
          fontFamily: "'Barlow Condensed', sans-serif",
          fontSize: "clamp(40px, 8vw, 80px)",
          fontWeight: 900,
          color: teamColor,
          opacity: 0.8
        }}>{initials}</span>
      </div>
    )
  }

  if (url) {
    return (
      <img
        src={url}
        alt={name}
        className={className}
        style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top center" }}
      />
    )
  }

  return null
}
