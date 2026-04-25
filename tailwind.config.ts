import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: "var(--color-bg)",
        "bg-light": "var(--color-bg-light)",
        surface: "var(--color-surface)",
        elevated: "var(--color-surface-elevated)",
        accent: "var(--color-accent)",
        "accent-hover": "var(--color-accent-hover)",
        "text-primary": "var(--color-text-primary)",
        "text-secondary": "var(--color-text-secondary)",
        "text-muted": "var(--color-text-muted)",
        "text-dark": "var(--color-text-dark)",
        border: "var(--color-border)",
        "border-light": "var(--color-border-light)",
      },
      fontFamily: {
        display: ["var(--font-display)", "system-ui", "sans-serif"],
        body: ["var(--font-body)", "system-ui", "sans-serif"],
      },
      spacing: {
        section: "var(--spacing-section)",
        "section-mobile": "var(--spacing-section-mobile)",
      },
      maxWidth: {
        content: "var(--max-content-width)",
      },
      borderRadius: {
        card: "var(--border-radius-card)",
      },
      transitionDuration: {
        base: "var(--transition-duration)",
      },
      transitionTimingFunction: {
        base: "var(--transition-ease)",
      },
      fontSize: {
        hero: ["clamp(3rem,8vw,5.5rem)", { lineHeight: "1.02", letterSpacing: "-0.03em" }],
        "hero-sub": ["clamp(1.05rem,2vw,1.35rem)", { lineHeight: "1.45" }],
      },
      keyframes: {
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        "scroll-hint": {
          "0%,100%": { transform: "translateY(0)", opacity: "0.5" },
          "50%": { transform: "translateY(6px)", opacity: "1" },
        },
      },
      animation: {
        marquee: "marquee 60s linear infinite",
        "scroll-hint": "scroll-hint 2.2s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
export default config;
