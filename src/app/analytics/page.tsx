import type { Metadata } from "next";
import { Suspense } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { AnalyticsPageClient } from "@/app/analytics/page-client";

export const metadata: Metadata = {
  title: "CREX Analytics — Predictive IPL Intelligence",
  description: "Win probability, momentum tracking, player comparison, fantasy picks, and pitch reports for the IPL.",
  openGraph: {
    title: "CREX Analytics — Predictive IPL Intelligence",
    description: "AI-powered win probability, momentum, and fantasy insights.",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "CREX Analytics" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "CREX Analytics",
    description: "AI-powered win probability, momentum, and fantasy insights.",
    images: ["/og-image.png"],
  },
};

export default function AnalyticsPage() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <Suspense>
        <AnalyticsPageClient />
      </Suspense>
      <Footer />
    </main>
  );
}
