import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        lime: { DEFAULT: "#c8ff00", dim: "rgba(200,255,0,0.12)", glow: "rgba(200,255,0,0.3)" },
        surface: { DEFAULT: "#111111", 2: "#1a1a1a" },
        bg: "#0a0a0a",
        border: "#222222",
      },
      fontFamily: {
        barlow: ["'Barlow Condensed'", "sans-serif"],
        dm: ["'DM Sans'", "sans-serif"],
      },
      animation: {
        "fade-in": "fadeIn 0.3s ease",
        "msg-in": "msgIn 0.25s ease",
        dot1: "dot 1.2s infinite",
        dot2: "dot 1.2s 0.2s infinite",
        dot3: "dot 1.2s 0.4s infinite",
      },
      keyframes: {
        fadeIn: { from: { opacity: "0", transform: "translateY(8px)" }, to: { opacity: "1", transform: "translateY(0)" } },
        msgIn: { from: { opacity: "0", transform: "translateY(6px)" }, to: { opacity: "1", transform: "translateY(0)" } },
        dot: { "0%,60%,100%": { opacity: "0.3", transform: "scale(0.8)" }, "30%": { opacity: "1", transform: "scale(1)" } },
      },
    },
  },
  plugins: [],
};
export default config;
