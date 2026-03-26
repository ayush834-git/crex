import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        crex: {
          bg: "var(--crex-bg)",
          surface: "var(--crex-surface)",
          border: "var(--crex-border)",
          text: "var(--crex-text)",
          muted: "var(--crex-muted)",
          accent: "var(--crex-accent)",
          live: "var(--crex-live)",
        },
        team: {
          mi: "var(--team-mi-primary)",
          csk: "var(--team-csk-primary)",
          rcb: "var(--team-rcb-primary)",
          kkr: "var(--team-kkr-primary)",
          srh: "var(--team-srh-primary)",
          dc: "var(--team-dc-primary)",
          pbks: "var(--team-pbks-primary)",
          rr: "var(--team-rr-primary)",
          lsg: "var(--team-lsg-primary)",
          gt: "var(--team-gt-primary)",
        },
      },
      fontFamily: {
        sans: ["var(--font-body)", "sans-serif"],
        display: ["var(--font-display)", "sans-serif"],
        body: ["var(--font-body)", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      borderRadius: {
        "2xl": "16px",
        "3xl": "24px",
      },
      animation: {
        "crex-marquee": "crex-marquee 28s linear infinite",
        "live-pulse": "crex-live-pulse 1.8s ease-in-out infinite",
      },
      maxWidth: {
        container: "1280px",
      },
    },
  },
  plugins: [],
};

export default config;
