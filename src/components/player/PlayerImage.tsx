"use client"
import Image from "next/image"
import { useState } from "react"
import { usePlayerImage } from "@/hooks/usePlayerImage"

interface Props {
  espnId: number
  name: string
  teamColor: string
  className?: string
}

export function PlayerImage({ espnId, name, teamColor, className = "" }: Props) {
  const { url, loading } = usePlayerImage(espnId, name)
  const [imgError, setImgError] = useState(false)
  const initials = name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase()

  if (loading) {
    return (
      <div className={`${className} w-full h-full animate-pulse relative`}
        style={{ background: `linear-gradient(135deg, ${teamColor}44, ${teamColor}11)` }} />
    )
  }

  if (!url || imgError) {
    return (
      <div className={`${className} w-full h-full flex items-center justify-center relative`}
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

  return (
    <Image
      src={url}
      alt={name}
      fill
      sizes="(max-width: 768px) 240px, 320px"
      onError={() => setImgError(true)}
      className={className}
      style={{ objectFit: "cover", objectPosition: "top center" }}
      unoptimized
    />
  )
}
