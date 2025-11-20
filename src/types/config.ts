const FontSizeListArray = [
  "xs",
  "sm",
  "md",
  "lg",
  "xl",
  "xxl",
  "xxxl",
] as const;

type FontSizeItem = (typeof FontSizeListArray)[number];

export type { FontSizeItem };
