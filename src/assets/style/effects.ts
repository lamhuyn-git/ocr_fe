/**
 * Effect tokens (shadows, border radius) — sourced from Figma Design System (full export)
 */

/**
 * Box shadow tokens.
 * Figma: DROP_SHADOW, offset (0,0), blur 4, spread 0
 */
export const boxShadow = {
  // Figma: "Shadow" — green-tinted shadow, cards, dropdowns, profile container
  card:         "0 0 4px rgba(182, 192, 187, 0.25)",   // #b6c0bb40
  // Figma: "Shadow_white" — grey shadow, modals, popovers on white surfaces
  "card-white": "0 0 4px rgba(112, 112, 113, 0.30)",   // #7070714d
  // Figma: "Shadow_blue" — blue-tinted shadow, info panels, selected states
  "card-blue":  "0 0 4px rgba(20, 121, 135, 0.15)",    // #14798726
  // Hover state shadow — method cards, option buttons (not a Figma style, derived from usage)
  option:       "0 0 2px rgba(0, 0, 0, 0.15)",
} as const;

/**
 * Border radius tokens.
 */
export const borderRadius = {
  // Figma: login card, document items, panels
  card:  "16px",
  // Figma: buttons, inputs, sidebar items, dropdowns, badges
  input: "8px",
} as const;

export type BoxShadowToken = keyof typeof boxShadow;
export type BorderRadiusToken = keyof typeof borderRadius;
