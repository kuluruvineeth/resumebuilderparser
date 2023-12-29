const SANS_SERIF_FONT_FAMILIES = [
  "Roboto",
  "Lato",
  "OpenSans",
  "Montserrat",
  "Raleway",
];

const SERIF_FONT_FAMILIES = [
  "Lora",
  "RobotoSlab",
  "Merriweather",
  "Caladea",
  "PlayfairDisplay",
];

export const FONT_FAMILIES = [
  ...SANS_SERIF_FONT_FAMILIES,
  ...SERIF_FONT_FAMILIES,
];

export type FontFamily = (typeof FONT_FAMILIES)[number];

export const FONT_FAMILY_TO_STANDARD_SIZE_IN_PT: Record<FontFamily, number> = {
  Roboto: 11,
  Lato: 11,
  Montserrat: 10,
  OpenSans: 10,
  Raleway: 10,

  Caladea: 11,
  Lora: 11,
  RobotoSlab: 10,
  PlayfairDisplay: 10,
  Merriweather: 10,
};

export const FONT_FAMILY_TO_DISPLAY_NAME: Record<FontFamily, string> = {
  Roboto: "Roboto",
  Lato: "Lato",
  Montserrat: "Montserrat",
  OpenSans: "Open Sans",
  Raleway: "Raleway",

  Caladea: "Caladea",
  Lora: "Lora",
  RobotoSlab: "Roboto Slab",
  PlayfairDisplay: "Playfair Display",
  Merriweather: "Merriweather",
};

export const getAllFontFamiliesToLoad = () => {
  return [...FONT_FAMILIES];
};
