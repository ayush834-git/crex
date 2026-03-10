"use client";

import { useState } from "react";
import { Loader } from "@/components/Loader";
import { Navigation } from "@/components/Navigation";
import { Hero } from "@/components/Hero";
import { TeamMarquee } from "@/components/TeamMarquee";
import { Features } from "@/components/Features";
import { Trivia } from "@/components/Trivia";
import { PlayerStatsPreview } from "@/components/PlayerStatsPreview";
import { SeasonTimeline } from "@/components/SeasonTimeline";
import { Footer } from "@/components/Footer";

export default function Home() {
  const [loadComplete, setLoadComplete] = useState(false);

  return (
    <main className="min-h-screen bg-void w-full overflow-hidden">
      {!loadComplete && <Loader onComplete={() => setLoadComplete(true)} />}

      <Navigation />
      
      {/* Hide content visually until loader is done but keep it mounted for GSAP to measure */}
      <div style={{ opacity: loadComplete ? 1 : 0, transition: "opacity 0.4s ease-in" }}>
        <Hero />
        <TeamMarquee />
        <Features />
        <Trivia />
        <PlayerStatsPreview />
        <SeasonTimeline />
        <Footer />
      </div>
    </main>
  );
}
