import type { Metadata } from "next";
import { Suspense } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { MatchesPageClient } from "@/app/matches/page-client";

export const metadata: Metadata = {
  title: "Match Center — CREX",
  description: "Live, recent, and upcoming IPL matches with real-time scores, run rates, and match context.",
  openGraph: {
    title: "Match Center — CREX",
    description: "Live IPL scores, commentary, and match state context.",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "CREX Match Center" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Match Center — CREX",
    description: "Live IPL scores, commentary, and match state context.",
    images: ["/og-image.png"],
  },
};

export default function MatchesPage() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <Suspense>
        <MatchesPageClient />
      </Suspense>
      <Footer />
    </main>
  );
}
