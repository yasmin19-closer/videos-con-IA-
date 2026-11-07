// Carruseles de Instagram (1080×1350). Cada fotograma es una diapositiva: render con `remotion still --frame=N`.
import React from "react";
import { AbsoluteFill, Composition, useCurrentFrame } from "remotion";
import { BRAND, C, FONT, FONT_FACES } from "../../remotion/src/theme";
import { DIA2 } from "./dia2";
import { Lujo, LUJO_COUNT } from "./lujo";
import { Pasos, PASOS_COUNT } from "./pasos";
import { PortadaCloser } from "./portada";

export const CW = 1080;
export const CH = 1350;

export type Slide = React.FC;

const Frame: React.FC<{ n: number; total: number; children: React.ReactNode }> = ({ n, total, children }) => (
  <AbsoluteFill style={{ background: C.bg, fontFamily: FONT, color: C.white }}>
    <style>{FONT_FACES}</style>
    <AbsoluteFill
      style={{
        background: `radial-gradient(circle at 20% 10%, ${C.violet}55, transparent 45%),
          radial-gradient(circle at 85% 95%, ${C.lime}26, transparent 40%)`,
      }}
    />
    <AbsoluteFill
      style={{
        backgroundImage: `linear-gradient(${C.border} 1px, transparent 1px), linear-gradient(90deg, ${C.border} 1px, transparent 1px)`,
        backgroundSize: "90px 90px",
        opacity: 0.35,
      }}
    />
    <div
      style={{
        position: "absolute",
        top: 50,
        left: 70,
        right: 70,
        display: "flex",
        justifyContent: "space-between",
        fontSize: 28,
        fontWeight: 700,
        color: C.muted,
      }}
    >
      <span>#ClosersDesdeCero</span>
      <span>
        {n + 1}/{total}
      </span>
    </div>
    <AbsoluteFill style={{ padding: "140px 80px 150px", display: "flex", flexDirection: "column", justifyContent: "center", gap: 40 }}>
      {children}
    </AbsoluteFill>
    <div
      style={{
        position: "absolute",
        bottom: 55,
        left: 70,
        right: 70,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        fontSize: 30,
        fontWeight: 700,
      }}
    >
      <span style={{ padding: "10px 24px", borderRadius: 999, background: "rgba(255,255,255,0.08)" }}>{BRAND}</span>
      {n < total - 1 ? <span style={{ color: C.lime }}>Desliza →</span> : null}
    </div>
  </AbsoluteFill>
);

const Deck: React.FC<{ slides: Slide[] }> = ({ slides }) => {
  const f = useCurrentFrame();
  const S = slides[Math.min(f, slides.length - 1)];
  return (
    <Frame n={f} total={slides.length}>
      <S />
    </Frame>
  );
};

export const Root: React.FC = () => (
  <>
    <Composition id="dia2" component={() => <Deck slides={DIA2} />} durationInFrames={DIA2.length} fps={1} width={CW} height={CH} />
    <Composition id="lujo" component={Lujo} durationInFrames={LUJO_COUNT} fps={1} width={540} height={960} />
    <Composition id="pasos" component={Pasos} durationInFrames={PASOS_COUNT} fps={1} width={540} height={960} />
    <Composition id="portada-closer" component={PortadaCloser} durationInFrames={1} fps={1} width={1080} height={1920} />
  </>
);
