const main = {
  light: "#e7ebe9",
  "light-hover": "#dce1de",
  "light-active": "#b6c0bb",
  DEFAULT: "#133524",
  hover: "#113020",
  active: "#0f2a1d",
  dark: "#0e281b",
  "dark-hover": "#0b2016",
  "dark-active": "#091810",
  darker: "#07130d",
} as const;

const secondary = {
  light: "#ecf2ea",
  "light-hover": "#e2ebdf",
  "light-active": "#c3d6bc",
  DEFAULT: "#3f7b28",
  hover: "#396f24",
  active: "#326220",
  dark: "#2f5c1e",
  "dark-hover": "#264a18",
  "dark-active": "#1c3712",
  darker: "#162b0e",
} as const;

const beige = {
  light: "#fdfcf9",
  "light-hover": "#fcfbf6",
  "light-active": "#faf6ec",
  DEFAULT: "#eee3c1",
  hover: "#d6ccae",
  active: "#beb69a",
  dark: "#b3aa91",
  "dark-hover": "#8f8874",
  "dark-active": "#6b6657",
  darker: "#534f44",
} as const;

const black = {
  light: "#e9e9e9",
  "light-hover": "#dedede",
  "light-active": "#bbbbbb",
  DEFAULT: "#242424",
  hover: "#202020",
  active: "#1d1d1d",
  dark: "#1b1b1b",
  "dark-hover": "#161616",
  "dark-active": "#101010",
  darker: "#0d0d0d",
} as const;

const grey = {
  light: "#feffff",
  "light-hover": "#fefefe",
  "light-active": "#fdfdfe",
  DEFAULT: "#f9fafb",
  hover: "#e0e1e2",
  active: "#c7c8c9",
  dark: "#bbbcbc",
  "dark-hover": "#959697",
  "dark-active": "#707071",
  darker: "#575858",
} as const;

const red = {
  light: "#fce6e6",
  "light-hover": "#fad9d9",
  "light-active": "#f4b0b0",
  DEFAULT: "#dc0000",
  hover: "#c60000",
  active: "#b00000",
  dark: "#a50000",
  "dark-hover": "#840000",
  "dark-active": "#630000",
  darker: "#4d0000",
} as const;

const yellow = {
  light: "#fcf6e6",
  "light-hover": "#fbf1da",
  "light-active": "#f6e2b2",
  DEFAULT: "#e2a108",
  hover: "#cb9107",
  active: "#b58106",
  dark: "#aa7906",
  "dark-hover": "#886105",
  "dark-active": "#664804",
  darker: "#4f3803",
} as const;

const blue = {
  light: "#ecf1fc",
  "light-hover": "#e3eafa",
  "light-active": "#c4d4f5",
  DEFAULT: "#4274df",
  hover: "#3b68c9",
  active: "#355db2",
  dark: "#3257a7",
  "dark-hover": "#284686",
  "dark-active": "#1e3464",
  darker: "#17294e",
} as const;

export const colors = {
  main,
  secondary,
  beige,
  black,
  grey,
  red,
  yellow,
  blue,

  primary: secondary.DEFAULT,
  "primary-light": main.light,
  "primary-hover": secondary.active,
  "primary-focus": secondary["light-hover"],
  "primary-focus-ring": secondary["light-active"],

  // Text
  "text-main": black.DEFAULT,
  "text-secondary": grey.darker,
  "text-placeholder": grey["dark-active"],
  "text-disabled": grey["dark-hover"],

  // Border
  "input-border": grey.hover,
  divider: black["light-active"],
} as const;

export const GreenLinear = {
  "green-linear":
    "linear-gradient(120deg, #064600 0%, #29780d 25%, #b0e16c 50%, #29780d 75%, #064600 100%)",
} as const;

export type GradientToken = keyof typeof GreenLinear;

export type ColorToken = keyof typeof colors;
