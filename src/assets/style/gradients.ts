export const GreenLinear = {
  // Figma: "GreenLinear" — brand green gradient, logo backgrounds, hero sections
  "green-linear":
    "linear-gradient(120deg, #064600 0%, #29780d 25%, #b0e16c 50%, #29780d 75%, #064600 100%)",
} as const;

export type GradientToken = keyof typeof GreenLinear;
