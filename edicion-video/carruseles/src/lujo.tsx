// Tarjetas "vida de lujo de gurú" (540×960) para el efecto orbit: parodia de las promesas de dinero fácil.
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { C, FONT, FONT_FACES } from "../../remotion/src/theme";

const POSTS = [
  { icon: "🏎️", text: "Mi Lambo a los 22", likes: "1.2M", from: "#ff7a18", to: "#af002d" },
  { icon: "🛥️", text: "Vida en yate 24/7", likes: "890K", from: "#00c6ff", to: "#0050a0" },
  { icon: "💸", text: "$10K en 7 días", likes: "2.4M", from: "#3ddc84", to: "#0b6b3a" },
  { icon: "🏝️", text: "Trabajo desde Bali", likes: "640K", from: "#2af5d0", to: "#06607a" },
  { icon: "⌚", text: "Rolex = éxito", likes: "1.1M", from: "#ffd36e", to: "#8a5a00" },
  { icon: "🛩️", text: "Jet privado, sin jefe", likes: "3.0M", from: "#b07cff", to: "#3b0a8f" },
];

export const LUJO_COUNT = POSTS.length;

export const Lujo: React.FC = () => {
  const p = POSTS[Math.min(useCurrentFrame(), POSTS.length - 1)];
  return (
    <AbsoluteFill style={{ background: `linear-gradient(160deg, ${p.from}, ${p.to})`, fontFamily: FONT, color: C.white }}>
      <style>{FONT_FACES}</style>
      <div style={{ position: "absolute", top: 34, left: 34, display: "flex", alignItems: "center", gap: 16, fontSize: 30, fontWeight: 700 }}>
        <div style={{ width: 62, height: 62, borderRadius: 31, background: "rgba(255,255,255,0.3)", border: "3px solid #fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 34 }}>
          😎
        </div>
        gurú_millonario
      </div>
      <AbsoluteFill style={{ display: "flex", alignItems: "center", justifyContent: "center", fontSize: 300, filter: "drop-shadow(0 30px 40px rgba(0,0,0,0.35))" }}>
        {p.icon}
      </AbsoluteFill>
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          padding: "120px 34px 40px",
          background: "linear-gradient(transparent, rgba(0,0,0,0.75))",
        }}
      >
        <div style={{ fontSize: 58, fontWeight: 900, lineHeight: 1.05 }}>{p.text}</div>
        <div style={{ marginTop: 16, fontSize: 32, fontWeight: 700 }}>❤️ {p.likes}</div>
      </div>
    </AbsoluteFill>
  );
};
