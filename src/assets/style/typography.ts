export const fontFamily = {
  "be-vietnam": ['"Be Vietnam Pro"', "sans-serif"],
} as const;

/**
 * Typography tokens generated from Figma typography styles
 */
export const fontSize = {
  // ===== Heading =====
  h1: [
    "1.485rem",
    { lineHeight: "normal", letterSpacing: "0", fontWeight: "700" },
  ],
  h2: [
    "1.125rem",
    { lineHeight: "normal", letterSpacing: "2%", fontWeight: "700" },
  ],
  h3: ["0.72rem", { lineHeight: "1", letterSpacing: "0", fontWeight: "700" }],
  h4: [
    "0.72rem",
    { lineHeight: "normal", letterSpacing: "2%", fontWeight: "600" },
  ],

  // ===== Paragraph S (12px) =====
  "para-s-bold": [
    "12px",
    { lineHeight: "1.45", letterSpacing: "2%", fontWeight: "700" },
  ],
  "para-s-semibold": [
    "12px",
    { lineHeight: "1.45", letterSpacing: "2%", fontWeight: "600" },
  ],
  "para-s-medium": [
    "12px",
    { lineHeight: "1.45", letterSpacing: "2%", fontWeight: "500" },
  ],
  "para-s-regular": [
    "12px",
    { lineHeight: "1.45", letterSpacing: "0", fontWeight: "400" },
  ],

  // ===== Paragraph M (14px) =====
  "para-m-bold": [
    "0.72rem",
    { lineHeight: "1.45", letterSpacing: "0", fontWeight: "700" },
  ],
  "para-m-semibold": [
    "0.72rem",
    { lineHeight: "1.45", letterSpacing: "2%", fontWeight: "600" },
  ],
  "para-m-medium": [
    "0.72rem",
    { lineHeight: "1.45", letterSpacing: "0", fontWeight: "500" },
  ],
  "para-m-regular": [
    "0.72rem",
    { lineHeight: "1.45", letterSpacing: "0", fontWeight: "400" },
  ],
  "para-m-light": [
    "0.72rem",
    { lineHeight: "1.45", letterSpacing: "0", fontWeight: "300" },
  ],
} as const;

/**
 * Font weights matching Be Vietnam Pro named styles in Figma.
 */
export const fontWeight = {
  light: "300",
  regular: "400",
  medium: "500",
  semibold: "600",
  bold: "700",
  extrabold: "800",
} as const;

export type FontSizeToken = keyof typeof fontSize;
export type FontWeightToken = keyof typeof fontWeight;
