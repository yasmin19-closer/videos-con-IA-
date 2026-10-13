import type React from "react";
import { AbsoluteFill, useVideoConfig } from "remotion";
import { Barras } from "./Barras";
import { Cierre } from "./Cierre";
import { Golpe } from "./Golpe";
import { FONDO, type PaletaProps } from "./paleta";
import { Rejilla } from "./Rejilla";

// 20 s, 9:16: cuatro escenas de 5 s animadas solo con resortes.
export const Resortes: React.FC<PaletaProps> = ({ color, acento }) => {
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill style={{ backgroundColor: FONDO }}>
      <Golpe
        name="Golpe"
        from={0}
        durationInFrames={5 * fps}
        premountFor={fps}
        color={color}
        acento={acento}
      />
      <Rejilla
        name="Rejilla"
        from={5 * fps}
        durationInFrames={5 * fps}
        premountFor={fps}
        color={color}
        acento={acento}
      />
      <Barras
        name="Barras"
        from={10 * fps}
        durationInFrames={5 * fps}
        premountFor={fps}
        color={color}
        acento={acento}
      />
      <Cierre
        name="Cierre"
        from={15 * fps}
        durationInFrames={5 * fps}
        premountFor={fps}
        color={color}
        acento={acento}
      />
    </AbsoluteFill>
  );
};
