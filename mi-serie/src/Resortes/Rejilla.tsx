import type React from "react";
import {
  AbsoluteFill,
  Interactive,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { FONDO, paletaSchema, type PaletaProps } from "./paleta";

const COLUMNAS = 3;
const FILAS = 5;
const LADO = 200;
const HUECO = 48;

// Escena 2: una rejilla que se abre desde el centro, gira y vuelve a cerrarse.
const RejillaInner: React.FC<PaletaProps> = ({ color, acento }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const celdas = Array.from({ length: COLUMNAS * FILAS }, (_, i) => {
    const col = i % COLUMNAS;
    const fila = Math.floor(i / COLUMNAS);
    const dx = col - (COLUMNAS - 1) / 2;
    const dy = fila - (FILAS - 1) / 2;
    return { i, dx, dy, distancia: Math.round(Math.hypot(dx, dy) * 2) };
  });
  const centro = Math.floor((COLUMNAS * FILAS) / 2);

  return (
    <AbsoluteFill
      style={{ backgroundColor: FONDO, justifyContent: "center", alignItems: "center" }}
    >
      {celdas.map((c) => {
        const entrada = spring({
          frame,
          fps,
          delay: c.distancia * 3,
          config: { damping: 10, stiffness: 160 },
        });
        const giro = spring({
          frame,
          fps,
          delay: Math.round(1.8 * fps) + c.distancia * 2,
          config: { damping: 12 },
        });
        const salida = spring({
          frame,
          fps,
          delay: Math.round(4.1 * fps) + (8 - c.distancia) * 2,
          config: { damping: 200 },
        });
        const esAcento = c.i === centro;
        const pulso = esAcento
          ? spring({ frame, fps, delay: 3 * fps, config: { damping: 6 } }) * 0.45
          : 0;
        return (
          <div
            key={c.i}
            style={{
              position: "absolute",
              width: LADO,
              height: LADO,
              borderRadius: 28,
              backgroundColor: esAcento ? acento : color,
              translate: `${c.dx * (LADO + HUECO)}px ${c.dy * (LADO + HUECO)}px`,
              scale: `${(entrada + pulso) * (1 - salida)}`,
              rotate: `${giro * 90}deg`,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};

export const Rejilla = Interactive.withSchema({
  Component: RejillaInner,
  componentName: "Rejilla",
  schema: paletaSchema,
  wrapInSequence: true,
  layout: "absolute-fill",
});
