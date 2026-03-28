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
          ink: "var(--crex-ink)",
          white: "var(--crex-white)",
          bg: "var(--crex-bg)",
          surface: "var(--crex-surface)",
          panel: "var(--crex-panel)",
          "panel-soft": "var(--crex-panel-soft)",
          border: "var(--crex-border)",
          text: "var(--crex-text)",
          muted: "var(--crex-muted)",
          inverse: "var(--crex-text-inverse)",
          "inverse-muted": "var(--crex-inverse-muted)",
          accent: "var(--crex-accent)",
          "accent-soft": "var(--crex-accent-soft)",
          hot: "var(--crex-hot)",
          warning: "var(--crex-warning)",
          live: "var(--crex-live)",
          stage: {
            red: "var(--crex-stage-red)",
            orange: "var(--crex-stage-orange)",
            yellow: "var(--crex-stage-yellow)",
            blue: "var(--crex-stage-blue)",
            purple: "var(--crex-stage-purple)",
            pink: "var(--crex-stage-pink)",
          },
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
        xl: "12px",
        "2xl": "16px",
        "3xl": "20px",
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
