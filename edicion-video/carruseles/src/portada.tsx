// Portada del reel "¿Cuánto gana un closer?" (1080×1920), estilo de la referencia: fondo oscuro, titular grande,
// "$" gigante detrás y tu recorte abajo. Lo importante va en la zona central que Instagram muestra en el perfil.
import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { FONT, FONT_FACES } from "../../remotion/src/theme";

const K = { dark: "#1C1B19", dot: "#2c2a27", orange: "#F08A3C", paper: "#FFFDF8", ink: "#141413" };

export const PortadaCloser: React.FC = () => (
  <AbsoluteFill style={{ background: K.dark, fontFamily: FONT }}>
    <style>{FONT_FACES}</style>
    <AbsoluteFill style={{ backgroundImage: `radial-gradient(${K.dot} 2px, transparent 2px)`, backgroundSize: "38px 38px" }} />
    <AbsoluteFill style={{ background: `radial-gradient(circle at 50% 62%, ${K.orange}40, transparent 45%)` }} />

    {/* "$" gigante detrás de ti */}
    <div
      style={{
        position: "absolute",
        top: 600,
        left: 0,
        right: 0,
        textAlign: "center",
        fontSize: 760,
        fontWeight: 900,
        lineHeight: 1,
        color: K.orange,
        opacity: 0.95,
      }}
    >
      $
    </div>

    {/* tu recorte */}
    <Img src={staticFile("portada-closer.png")} style={{ position: "absolute", left: 0, top: 300, width: 1080 }} />

    {/* titular */}
    <div style={{ position: "absolute", top: 270, left: 70, right: 70, fontWeight: 900, lineHeight: 0.98, letterSpacing: -3 }}>
      <div style={{ fontSize: 132, color: K.paper }}>¿Cuánto gana</div>
      <div style={{ fontSize: 132, color: K.orange }}>un closer?</div>
    </div>

    {/* píldora */}
    <div
      style={{
        position: "absolute",
        top: 580,
        left: 70,
        padding: "16px 36px",
        borderRadius: 999,
        background: K.orange,
        color: K.ink,
        fontSize: 52,
        fontWeight: 900,
        transform: "rotate(-4deg)",
        boxShadow: "0 14px 30px rgba(0,0,0,0.35)",
      }}
    >
      Sin humo 💨
    </div>

    {/* etiqueta inferior dentro de la zona segura */}
    <div
      style={{
        position: "absolute",
        top: 1600,
        left: 0,
        right: 0,
        display: "flex",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          padding: "18px 40px",
          borderRadius: 26,
          background: K.paper,
          color: K.ink,
          fontSize: 50,
          fontWeight: 900,
          boxShadow: "0 18px 40px rgba(0,0,0,0.4)",
        }}
      >
        La verdad sobre las <span style={{ color: K.orange }}>comisiones</span>
      </div>
    </div>
  </AbsoluteFill>
);
