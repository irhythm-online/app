/**
 * IRhythm color tokens — exact hex values from BRAND.md.
 * Keep this file in sync with BRAND.md's "Color tokens" section.
 */
export const colors = {
  navy950: "#050B18", // app background (darkest)
  navy900: "#0A1628", // primary background
  navy800: "#0F2547", // surface / cards
  navy700: "#16305C", // elevated surface / hover
  navy600: "#22407A", // borders, dividers
  cyan400: "#22D3EE", // primary accent (buttons, active states, progress bar)
  cyan300: "#67E8F9", // accent hover/highlight
  gold400: "#F5B942", // secondary accent (premium/badges, used sparingly)
  white: "#F5F7FA", // primary text on dark
  gray300: "#A9B4C6", // secondary text
  gray500: "#6B7A93", // muted text / placeholders
  success: "#34D399",
  error: "#F87171",
} as const;

/** Hero/splash/player background wash: linear-gradient(160deg, #0A1628 0%, #0F2547 55%, #16305C 100%) */
export const heroGradient = {
  colors: [colors.navy900, colors.navy800, colors.navy700] as const,
  locations: [0, 0.55, 1] as const,
  // Approximates a 160deg gradient direction (top-left-ish to bottom-right-ish).
  start: { x: 0.1, y: 0 },
  end: { x: 0.85, y: 1 },
};

export type ColorToken = keyof typeof colors;
