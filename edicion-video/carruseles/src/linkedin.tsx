// Portada de LinkedIn (1584×396). La foto de perfil tapa la esquina inferior izquierda: el texto va a la derecha.
import React from "react";
import { AbsoluteFill } from "remotion";
import { FONT, FONT_FACES } from "../../remotion/src/theme";

const K = { dark: "#1C1B19", dot: "#2c2a27", orange: "#F08A3C", paper: "#FFFDF8", cream: "#F3EEE4" };

export const LinkedinBanner: React.FC = () => (
  <AbsoluteFill style={{ background: K.dark, fontFamily: FONT, color: K.paper }}>
    <style>{FONT_FACES}</style>
    <AbsoluteFill style={{ backgroundImage: `radial-gradient(${K.dot} 2px, transparent 2px)`, backgroundSize: "30px 30px" }} />
    <AbsoluteFill style={{ background: `radial-gradient(circle at 78% 50%, ${K.orange}33, transparent 45%)` }} />
    {/* "$" decorativo a la izquierda, detrás de donde va la foto */}
    <div style={{ position: "absolute", left: 120, top: -60, fontSize: 420, fontWeight: 900, color: K.orange, opacity: 0.12 }}>$</div>

    <div style={{ position: "absolute", right: 80, top: 78, width: 1100, textAlign: "right" }}>
      <div style={{ fontSize: 30, fontWeight: 700, color: K.orange, letterSpacing: 4, textTransform: "uppercase" }}>
        Documentando mi proceso
      </div>
      <div style={{ marginTop: 8, fontSize: 66, fontWeight: 900, lineHeight: 1.0, letterSpacing: -2, whiteSpace: "nowrap" }}>
        De empleada a <span style={{ color: K.orange }}>High Ticket Closer</span>
      </div>
      <div style={{ marginTop: 26, display: "flex", justifyContent: "flex-end", gap: 14 }}>
        {["Ventas consultivas", "Manejo de objeciones", "#ClosersDesdeCero"].map((t, i) => (
          <span
            key={t}
            style={{
              padding: "10px 24px",
              borderRadius: 999,
              fontSize: 26,
              whiteSpace: "nowrap",
              fontWeight: 800,
              background: i === 2 ? K.orange : "transparent",
              color: i === 2 ? K.dark : K.cream,
              border: i === 2 ? "none" : `2px solid ${K.cream}55`,
            }}
          >
            {t}
          </span>
        ))}
      </div>
    </div>
  </AbsoluteFill>
);
