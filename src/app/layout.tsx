import type { Metadata } from "next";
import { Barlow_Condensed, Bebas_Neue, JetBrains_Mono } from "next/font/google";
import ScrollSmoother from "@/components/ScrollSmoother";
import "./globals.css";

const display = Bebas_Neue({
  variable: "--font-display",
  subsets: ["latin"],
  weight: "400",
});

const body = Barlow_Condensed({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

const mono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  display: "swap",
});

const poster = Barlow_Condensed({
  variable: "--font-poster",
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://crex.live"),
  title: "CREX - IPL Cricket Intelligence",
  description: "Live scores, analytics, and fantasy insights for the Indian Premier League.",
  openGraph: {
    title: "CREX - IPL Cricket Intelligence",
    description: "Feel every IPL moment with live scores, analytics, and fantasy insight.",
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "CREX - IPL Cricket Intelligence" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "CREX - IPL Cricket Intelligence",
    description: "Feel every IPL moment with live scores, analytics, and fantasy insight.",
    images: ["/opengraph-image"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${display.variable} ${body.variable} ${mono.variable} ${poster.variable} bg-crex-bg font-body text-crex-text antialiased`}>
        <ScrollSmoother>{children}</ScrollSmoother>
      </body>
    </html>
  );
}
