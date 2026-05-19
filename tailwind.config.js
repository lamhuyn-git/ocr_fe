import {
  colors,
  fontFamily,
  fontSize,
  boxShadow,
  borderRadius,
  backgroundImage,
} from "./src/assets/style/index.ts";

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors,
      fontFamily,
      fontSize,
      boxShadow,
      borderRadius,
      backgroundImage,
      keyframes: {
        "fade-in-up": {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "fade-in-up": "fade-in-up 0.65s ease-out both",
      },
    },
  },
  plugins: [],
};
