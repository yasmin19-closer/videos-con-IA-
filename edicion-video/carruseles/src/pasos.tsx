// Tarjetas de los 5 pasos de una llamada de venta (540×960), paleta Claude, para el efecto fan-build.
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { FONT, FONT_FACES } from "../../remotion/src/theme";

const K = { bg: "#F0EEE6", ink: "#141413", orange: "#D97757", line: "#E3DACC" };
const PASOS = [
  { n: "1", t: "Conexión", d: "Te hace sentir cómodo", i: "👋" },
  { n: "2", t: "Diagnóstico", d: "Dónde estás hoy", i: "🔍" },
  { n: "3", t: "Meta", d: "Dónde quieres estar", i: "🎯" },
  { n: "4", t: "Obstáculo", d: "Qué te frena", i: "🧱" },
  { n: "5", t: "Propuesta", d: "Solo si encaja", i: "🤝" },
];
export const PASOS_COUNT = PASOS.length;

export const Pasos: React.FC = () => {
  const p = PASOS[Math.min(useCurrentFrame(), PASOS.length - 1)];
  const dark = Number(p.n) % 2 === 0;
  return (
    <AbsoluteFill
      style={{
        background: dark ? K.ink : K.bg,
        color: dark ? K.bg : K.ink,
        fontFamily: FONT,
        padding: 48,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      <style>{FONT_FACES}</style>
      <div style={{ fontSize: 240, fontWeight: 900, lineHeight: 0.9, color: K.orange }}>{p.n}</div>
      <div style={{ fontSize: 150, lineHeight: 1 }}>{p.i}</div>
      <div>
        <div style={{ fontSize: 76, fontWeight: 900, lineHeight: 1 }}>{p.t}</div>
        <div style={{ marginTop: 14, fontSize: 38, fontWeight: 700, opacity: 0.75 }}>{p.d}</div>
      </div>
    </AbsoluteFill>
  );
};
