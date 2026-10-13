import type React from "react";
import {
  AbsoluteFill,
  Interactive,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { FONDO, paletaSchema, type PaletaProps } from "./paleta";

// Escena 1: un círculo cae con rebote y suelta tres puntos.
const GolpeInner: React.FC<PaletaProps> = ({ color, acento }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const caida = spring({ frame, fps, config: { damping: 9, stiffness: 120 } });
  const salida = spring({ frame, fps, delay: 4 * fps, config: { damping: 200 } });

  const puntos = [
    { x: -300, y: 420, c: color, d: 0 },
    { x: 0, y: 520, c: acento, d: 4 },
    { x: 300, y: 420, c: color, d: 8 },
  ];

  return (
    <AbsoluteFill
      style={{ backgroundColor: FONDO, justifyContent: "center", alignItems: "center" }}
    >
      <div
        style={{
          position: "absolute",
          width: 380,
          height: 380,
          borderRadius: "50%",
          backgroundColor: color,
          translate: `0px ${(1 - caida) * -1300}px`,
          scale: `${1 - salida}`,
        }}
      />
      {puntos.map((p) => {
        const s = spring({
          frame,
          fps,
          delay: Math.round(1.3 * fps) + p.d,
          config: { damping: 11, stiffness: 140 },
        });
        return (
          <div
            key={p.d}
            style={{
              position: "absolute",
              width: 90,
              height: 90,
              borderRadius: "50%",
              backgroundColor: p.c,
              translate: `${p.x * s}px ${p.y * s}px`,
              scale: `${s * (1 - salida)}`,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};

export const Golpe = Interactive.withSchema({
  Component: GolpeInner,
  componentName: "Golpe",
  schema: paletaSchema,
  wrapInSequence: true,
  layout: "absolute-fill",
});
