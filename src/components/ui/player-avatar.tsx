"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { usePlayerImage } from "@/hooks/usePlayerImage";
import { cn } from "@/utils/cn";

interface PlayerAvatarProps {
  src?: string;
  name: string;
  espnId?: number;
  queryName?: string;
  color?: string;
  className?: string;
  priority?: boolean;
}

export function PlayerAvatar({
  src,
  name,
  espnId,
  queryName,
  color = "var(--crex-accent)",
  className,
  priority = false,
}: PlayerAvatarProps) {
  const [hasError, setHasError] = useState(false);
  const shouldResolve = !src || src.startsWith("/images/players/");
  const lookupName = queryName ?? name;
  const { url: resolvedUrl, loading } = usePlayerImage(espnId, lookupName, shouldResolve);
  const usableSrc = useMemo(() => {
    if (hasError) return undefined;
    if (!shouldResolve && src) return src;
    return resolvedUrl ?? undefined;
  }, [hasError, resolvedUrl, shouldResolve, src]);

  const initials = name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-full border border-white/50 bg-white shadow-[0_8px_24px_rgba(10,15,30,0.12)]",
        className
      )}
      style={{ background: `linear-gradient(135deg, ${color}, rgba(255,255,255,0.75))` }}
    >
      {usableSrc ? (
        <Image
          src={usableSrc}
          alt={name}
          fill
          priority={priority}
          sizes="(max-width: 768px) 64px, 96px"
          className="object-cover"
          onError={() => setHasError(true)}
        />
      ) : loading ? (
        <span className="absolute inset-0 animate-pulse bg-white/30" />
      ) : (
        <span className="absolute inset-0 flex items-center justify-center font-display text-xl text-white">
          {initials}
        </span>
      )}
    </div>
  );
}
