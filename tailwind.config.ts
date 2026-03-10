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
        sun: "var(--crex-sun)",
        royal: "var(--crex-royal)",
        crimson: "var(--crex-crimson)",
        violet: "var(--crex-violet)",
        sky: "var(--crex-sky)",
        lime: "var(--crex-lime)",
        white: "var(--crex-white)",
        ink: "var(--crex-ink)",
      },
      fontFamily: {
        sans: ["'DM Sans'", "sans-serif"],
        display: ["'Barlow Condensed'", "sans-serif"],
        subhead: ["'Bebas Neue'", "sans-serif"],
        mono: ["'JetBrains Mono'", "monospace"],
      },
      borderWidth: {
        '6': '6px',
        '8': '8px',
        '12': '12px',
      },
      animation: {
        "confetti-fall": "confetti-fall 3s linear infinite",
        "slam-down": "slam-down 0.6s cubic-bezier(0.25, 1, 0.5, 1) forwards",
        "wipe-left": "wipe-left 1s cubic-bezier(0.77, 0, 0.175, 1) forwards",
        "wiggle": "wiggle 0.5s cubic-bezier(0.36, 0, 0.66, -0.56) infinite",
        "count-up": "count-up 2s ease-out forwards",
        "marquee-left": "marquee-left 30s linear infinite",
        "marquee-right": "marquee-right 30s linear infinite",
      },
      keyframes: {
        "confetti-fall": {
          "0%": { transform: "translateY(-100%) rotate(0deg)" },
          "100%": { transform: "translateY(100vh) rotate(360deg)" },
        },
        "slam-down": {
          "0%": { transform: "translateY(-200px)", opacity: "0" },
          "60%": { transform: "translateY(20px)", opacity: "1" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        "wipe-left": {
          "0%": { clipPath: "polygon(100% 0, 100% 0, 100% 100%, 100% 100%)" },
          "100%": { clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)" },
        },
        "wiggle": {
          "0%, 100%": { transform: "rotate(0deg)" },
          "25%": { transform: "rotate(-3deg)" },
          "75%": { transform: "rotate(3deg)" },
        },
        "count-up": {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "marquee-left": {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        "marquee-right": {
          "0%": { transform: "translateX(-50%)" },
          "100%": { transform: "translateX(0)" },
        },
      },
    },
  },
  plugins: [
    // Add custom diagonal clip-path utilities
    function ({ addUtilities }: any) {
      addUtilities({
        '.clip-diagonal': {
          'clip-path': 'polygon(0 0, 100% 0, 100% 85%, 0 100%)',
        },
        '.clip-diagonal-reverse': {
          'clip-path': 'polygon(0 0, 100% 0, 100% 100%, 0 85%)',
        },
      });
    },
  ],
};

export default config;
