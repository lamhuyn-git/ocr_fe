export const boxShadow = {
  card: "0 0 4px rgba(182, 192, 187, 0.25)",
  "card-white": "0 0 4px rgba(112, 112, 113, 0.30)",
  "card-blue": "0 0 4px rgba(20, 121, 135, 0.15)",
  option: "0 0 2px rgba(0, 0, 0, 0.15)",
} as const;

export const borderRadius = {
  card: "1rem",
  input: "0.5rem",
} as const;

export type BoxShadowToken = keyof typeof boxShadow;
export type BorderRadiusToken = keyof typeof borderRadius;
