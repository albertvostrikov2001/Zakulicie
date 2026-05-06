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
        bg:             "var(--color-bg)",
        "bg-light":     "var(--color-bg-light)",
        surface:        "var(--color-surface)",
        elevated:       "var(--color-surface-elevated)",
        accent:         "var(--color-accent)",
        "accent-hover": "var(--color-accent-hover)",
        "text-primary":   "var(--color-text-primary)",
        "text-secondary": "var(--color-text-secondary)",
        "text-muted":     "var(--color-text-muted)",
        "text-dark":      "var(--color-text-dark)",
        border:           "var(--color-border)",
        "border-light":   "var(--color-border-light, rgba(0,0,0,0.1))",
        overlay:          "var(--color-overlay)",
      },
      fontFamily: {
        display: ["var(--font-display)", "system-ui", "sans-serif"],
        body:    ["var(--font-body)", "system-ui", "sans-serif"],
      },
      fontSize: {
        xs:   ["var(--text-xs)",   { lineHeight: "1.5", letterSpacing: "0.05em" }],
        sm:   ["var(--text-sm)",   { lineHeight: "1.55" }],
        base: ["var(--text-base)", { lineHeight: "1.65" }],
        md:   ["var(--text-md)",   { lineHeight: "1.6" }],
        lg:   ["var(--text-lg)",   { lineHeight: "1.45" }],
        xl:   ["var(--text-xl)",   { lineHeight: "1.3" }],
        "2xl": ["var(--text-2xl)", { lineHeight: "1.2" }],
        "3xl": ["var(--text-3xl)", { lineHeight: "1.1" }],
        hero: [
          "clamp(72px, 10vw, 140px)",
          { lineHeight: "0.95", letterSpacing: "-0.03em" },
        ],
        "hero-sub": [
          "clamp(1.05rem, 2vw, 1.35rem)",
          { lineHeight: "1.45" },
        ],
      },
      fontWeight: {
        regular:  "400",
        medium:   "500",
        semibold: "600",
        bold:     "700",
      },
      lineHeight: {
        tight:   "1.1",
        snug:    "1.25",
        normal:  "1.5",
        relaxed: "1.65",
      },
      letterSpacing: {
        tight:   "-0.02em",
        normal:  "0",
        wide:    "0.05em",
        wider:   "0.1em",
        widest:  "0.15em",
      },
      spacing: {
        section:        "var(--spacing-section)",
        "section-tablet": "var(--spacing-section-tablet, 72px)",
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
      keyframes: {
        marquee: {
          "0%":   { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        "marquee-rtl": {
          "0%":   { transform: "translateX(-50%)" },
          "100%": { transform: "translateX(0)" },
        },
        "scroll-hint": {
          "0%,100%": { transform: "translateY(0)", opacity: "0.5" },
          "50%":     { transform: "translateY(6px)", opacity: "1" },
        },
        "shimmer-pulse": {
          "0%,100%": { opacity: "0.4" },
          "50%":     { opacity: "0.9" },
        },
        "dot-pulse": {
          "0%,100%": { transform: "scale(1)", opacity: "0.6" },
          "50%":     { transform: "scale(1.6)", opacity: "1" },
        },
        "fade-in": {
          from: { opacity: "0" },
          to:   { opacity: "1" },
        },
      },
      animation: {
        marquee:       "marquee 42s linear infinite",
        "marquee-rtl": "marquee-rtl 38s linear infinite",
        "scroll-hint": "scroll-hint 2.2s ease-in-out infinite",
        "shimmer-pulse": "shimmer-pulse 3s ease-in-out infinite",
        "dot-pulse":   "dot-pulse 2.5s ease-in-out infinite",
        "fade-in":     "fade-in 0.4s ease forwards",
      },
    },
  },
  plugins: [],
};

export default config;
