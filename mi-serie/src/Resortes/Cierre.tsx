import type React from "react";
import {
  AbsoluteFill,
  Interactive,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { FONDO, paletaSchema, type PaletaProps } from "./paleta";

const PUNTOS = 12;
const RADIO = 340;

// Escena 4: un anillo de puntos se abre, gira y se recoge en un solo punto de acento.
const CierreInner: React.FC<PaletaProps> = ({ color, acento }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const giro = spring({ frame, fps, delay: 10, config: { damping: 18, mass: 3 } });
  const recoge = spring({ frame, fps, delay: Math.round(2.3 * fps), config: { damping: 14 } });
  const nucleo = spring({ frame, fps, delay: Math.round(2.9 * fps), config: { damping: 7 } });
  const asienta = spring({ frame, fps, delay: Math.round(4 * fps), config: { damping: 200 } });

  return (
    <AbsoluteFill
      style={{ backgroundColor: FONDO, justifyContent: "center", alignItems: "center" }}
    >
      {Array.from({ length: PUNTOS }, (_, i) => {
        const abre = spring({
          frame,
          fps,
          delay: i * 2,
          config: { damping: 10, stiffness: 130 },
        });
        const angulo = (i / PUNTOS) * Math.PI * 2 + giro * Math.PI;
        const r = RADIO * abre * (1 - recoge);
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              width: 64,
              height: 64,
              borderRadius: "50%",
              backgroundColor: color,
              translate: `${Math.cos(angulo) * r}px ${Math.sin(angulo) * r}px`,
              scale: `${abre * (1 - recoge * 0.6)}`,
              opacity: 1 - nucleo,
            }}
          />
        );
      })}
      <div
        style={{
          position: "absolute",
          width: 260,
          height: 260,
          borderRadius: "50%",
          backgroundColor: acento,
          scale: `${nucleo * (1 - asienta * 0.65)}`,
        }}
      />
    </AbsoluteFill>
  );
};

export const Cierre = Interactive.withSchema({
  Component: CierreInner,
  componentName: "Cierre",
  schema: paletaSchema,
  wrapInSequence: true,
  layout: "absolute-fill",
});
