import type { InteractivitySchema } from "remotion";

// Un color y un acento sobre un fondo de tinta.
export const FONDO = "#0D0E12";
export const COLOR = "#F4F1EA";
export const ACENTO = "#FF5B2E";

export type PaletaProps = {
  readonly color: string;
  readonly acento: string;
};

export const paletaSchema = {
  color: { type: "color", default: COLOR, description: "Color" },
  acento: { type: "color", default: ACENTO, description: "Acento" },
} as const satisfies InteractivitySchema;
