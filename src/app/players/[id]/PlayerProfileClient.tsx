"use client";

import { PlayerImage } from "@/components/player/PlayerImage";

interface Props {
  espnId: number;
  name: string;
  teamColor: string;
}

export function PlayerProfileClient({ espnId, name, teamColor }: Props) {
  return <PlayerImage espnId={espnId} name={name} teamColor={teamColor} />;
}
