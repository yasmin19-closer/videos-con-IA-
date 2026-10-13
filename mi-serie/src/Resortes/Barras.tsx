import type React from "react";
import {
  AbsoluteFill,
  Interactive,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { FONDO, paletaSchema, type PaletaProps } from "./paleta";

// Escena 3: cinco barras con el mismo empujón y distinta amortiguación.
// La de acento es la más elástica.
const BARRAS = [
  { damping: 4, altura: 1100, acento: true },
  { damping: 8, altura: 900, acento: false },
  { damping: 14, altura: 1000, acento: false },
  { damping: 30, altura: 800, acento: false },
  { damping: 200, altura: 950, acento: false },
];
const ANCHO = 120;
const HUECO = 44;

const BarrasInner: React.FC<PaletaProps> = ({ color, acento }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const total = BARRAS.length * ANCHO + (BARRAS.length - 1) * HUECO;

  return (
    <AbsoluteFill style={{ backgroundColor: FONDO }}>
      {BARRAS.map((b, i) => {
        const sube = spring({
          frame,
          fps,
          delay: 4,
          config: { damping: b.damping, stiffness: 90 },
          durationRestThreshold: 0.001,
        });
        const baja = spring({
          frame,
          fps,
          delay: Math.round(3.9 * fps) + i * 3,
          config: { damping: 200 },
        });
        return (
          <div
            key={b.damping}
            style={{
              position: "absolute",
              left: (1080 - total) / 2 + i * (ANCHO + HUECO),
              bottom: 380,
              width: ANCHO,
              height: b.altura * sube * (1 - baja),
              borderRadius: ANCHO / 2,
              backgroundColor: b.acento ? acento : color,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};

export const Barras = Interactive.withSchema({
  Component: BarrasInner,
  componentName: "Barras",
  schema: paletaSchema,
  wrapInSequence: true,
  layout: "absolute-fill",
});
