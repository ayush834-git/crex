import type { Metadata } from "next";
import { Suspense } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { PlayersPageClient } from "@/app/players/page-client";

export const metadata: Metadata = {
  title: "Player Directory — CREX",
  description: "Searchable IPL player directory with role, team, and nationality filters. Full squad rosters for all 10 teams.",
  openGraph: {
    title: "Player Directory — CREX",
    description: "Browse every IPL player. Filter by team, role, and nationality.",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "CREX Player Directory" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Player Directory — CREX",
    description: "Browse every IPL player. Filter by team, role, and nationality.",
    images: ["/og-image.png"],
  },
};

export default function PlayersPage() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <Suspense>
        <PlayersPageClient />
      </Suspense>
      <Footer />
    </main>
  );
}
