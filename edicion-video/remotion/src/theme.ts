// Colores, tipografía y marca. Cambia aquí tu estilo; afecta a todos los videos.
import { staticFile } from "remotion";

export const W = 1080;
export const H = 1920;
export const FPS = 30;

export const C = {
  bg: "#0b0b12",
  card: "rgba(20, 20, 30, 0.86)",
  border: "rgba(255, 255, 255, 0.10)",
  white: "#ffffff",
  muted: "rgba(255, 255, 255, 0.62)",
  lime: "#c6ff3d",
  violet: "#8b5cf6",
  red: "#ff5a5f",
};

// Texto fijo que aparece arriba en todo el video (tu nombre o tu @)
export const BRAND = "@yasminalvarez_closer";

export const FONT = "Inter Display";

export const FONT_FACES = [
  ["InterDisplay-Medium.otf", 500],
  ["InterDisplay-Bold.otf", 700],
  ["InterDisplay-Black.otf", 900],
]
  .map(
    ([f, w]) =>
      `@font-face{font-family:"${FONT}";src:url("${staticFile(`fonts/${f}`)}") format("opentype");font-weight:${w};}`,
  )
  .join("\n");
