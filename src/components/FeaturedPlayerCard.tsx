/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { motion } from "framer-motion";
import { PlayerImage } from "./player/PlayerImage";
import { usePlayers } from "@/hooks/usePlayers";
import { useState, useEffect } from "react";

export function FeaturedPlayerCard() {
  const { players } = usePlayers();
  const [featured, setFeatured] = useState<any | null>(null);

  useEffect(() => {
    if (players && players.length > 0) {
      // Pick a known superstar, or a random player
      const superstars = ["V Kohli", "MS Dhoni", "RG Sharma", "JJ Bumrah", "AB de Villiers"];
      let player = players.find(p => superstars.includes(p.cricsheetName));
      if (!player) player = players[0];
      setFeatured(player);
    }
  }, [players]);

  if (!featured) return null;

  return (
    <motion.div
      initial={{ x: 100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 100, damping: 20, delay: 0.5 }}
      whileHover={{ scale: 1.05, rotateY: -10, rotateX: 5 }}
      style={{ perspective: 1000 }}
      className="relative w-full max-w-sm mx-auto cursor-pointer"
    >
      <div
        className="rounded-xl overflow-hidden shadow-2xl backdrop-blur-md"
        style={{
          background: "linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.02) 100%)",
          border: "1px solid rgba(255,255,255,0.1)",
          boxShadow: `0 20px 40px rgba(0,0,0,0.5), inset 0 0 0 1px ${featured.teamColor}55`,
        }}
      >
        <div className="relative w-full aspect-[4/5] overflow-hidden">
          {/* We use 0 for espnId so PlayerImage gracefully degrades to Wikipedia search! */}
          <PlayerImage espnId={featured.espnId || 0} name={featured.cricsheetName} teamColor={featured.teamColor} />
          <div className="absolute inset-0 bg-gradient-to-t from-[#080C18] via-transparent to-transparent" />
          
          <div className="absolute top-4 right-4">
            <span
              className="px-3 py-1 text-xs font-black uppercase tracking-widest rounded shadow-lg"
              style={{ background: featured.teamColor, color: "white" }}
            >
              {featured.team}
            </span>
          </div>

          <div className="absolute bottom-0 left-0 w-full p-6 text-left">
            <span
              className="text-[#F5C518] text-xs font-bold uppercase tracking-widest pb-1 border-b-2 border-white/20 block w-fit mb-2"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              Featured Player
            </span>
            <h3
              className="text-4xl font-black uppercase leading-none text-white drop-shadow-lg"
              style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
            >
              {featured.cricsheetName}
            </h3>
            <p className="text-gray-300 font-mono text-sm mt-2 font-bold tracking-tight">
              {featured.role}
            </p>
          </div>
        </div>

      </div>
    </motion.div>
  );
}
