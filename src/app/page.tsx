import type { Metadata } from "next";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { AlertBanner } from "@/components/ui/alert-banner";
import { ScoreTicker } from "@/components/ui/score-ticker";
import { LogoCloud } from "@/components/ui/logo-cloud";
import { HeroSection } from "@/components/sections/hero";
import { FeaturedMatches } from "@/components/sections/featured-matches";
import { FeatureSection } from "@/components/sections/features";
import { AnalyticsTeaser } from "@/components/sections/analytics-teaser";
import { PlayerSpotlight } from "@/components/sections/player-spotlight";
import { FALLBACK_MATCHES } from "@/lib/fallback-data";
import { getMatches } from "@/lib/server/crex-data";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "CREX - Feel Every IPL Moment",
  description: "Live match tracking, predictive analytics, and fantasy intelligence for the IPL.",
};

export default async function Home() {
  const livePayload = await getMatches("live", 8);
  const liveMatches = livePayload.matches.length ? livePayload.matches : FALLBACK_MATCHES.filter((match) => match.status === "live");
  const topMatch = liveMatches[0];

  return (
    <main className="min-h-screen">
      {topMatch ? (
        <AlertBanner
          message={`LIVE: ${topMatch.team1.abbr} vs ${topMatch.team2.abbr} - ${topMatch.note ?? "Scores updating now"}`}
          cta={{ text: "Open Match Center", href: "/matches?tab=live" }}
        />
      ) : null}
      <Navbar />
      <HeroSection />
      <ScoreTicker matches={liveMatches} />
      <FeaturedMatches />
      <FeatureSection />
      <LogoCloud />
      <AnalyticsTeaser />
      <PlayerSpotlight />
      <Footer />
    </main>
  );
}
