// "¿Suena a estafa?" (58 s). El video de cámara ya trae los efectos de la skill Effects
// (glass-widgets, orbit, spotlight, comment-box); aquí se suman subtítulos, tarjetas, stickers, sonido y cierre.
import React from "react";
import { AbsoluteFill } from "remotion";
import { BRAND, C } from "./theme";
import {
  Background,
  Brand,
  CamKey,
  Camera,
  Card,
  CARD_AREA,
  Chip,
  FollowCTA,
  PIP,
  Picto,
  PictoRow,
  Sfx,
  Sounds,
  SPLIT,
  SPLIT_CARD,
  Sticker,
  StoryProgress,
  Subtitles,
  Title,
  punch,
} from "./lib";

const KEYS: CamKey[] = [
  { at: 0, box: punch(1.0) }, // glass-widgets (0–2.3) y orbit (2.3–5.4) vienen en el video
  { at: 13.0, box: punch(1.12) }, // "quieres ganar dinero desde casa"
  { at: 16.04, box: punch(1.0) },
  { at: 21.32, box: punch(1.15) }, // "ninguna de las dos es verdad"
  { at: 23.1, box: SPLIT }, // qué hace un closer
  { at: 32.45, box: punch(1.0) },
  { at: 38.52, box: punch(1.15) }, // "te dicen que no"
  { at: 39.55, box: PIP }, // lo que sí vas a ver
  { at: 47.6, box: punch(1.0) }, // spotlight (48.2–52.35) y comment-box (52.4–55.55) vienen en el video
  { at: 55.6, box: punch(1.1) }, // cierre
];

const KEYWORDS = [
  "estafa?", "película", "simple", "lujo", "millonario", "estafa", "fácil,", "verdad.", "Closer", "decidir,",
  "comisión.", "práctica,", "no.", "proceso", "venta.", "desconfía.", "comentarios",
];

const HIDE_SUBS: [number, number][] = [
  [48.2, 52.35], // spotlight: la palabra DESCONFÍA ya está en pantalla
  [55.6, 99],
];

// whoosh = cambio de encuadre o efecto · pop = sticker/ítem · ding = logro · boom = zoom (máx. 1 por segundo)
const SFX: Sfx[] = [
  { at: 0.1, f: "pop" },
  { at: 2.3, f: "whoosh" },
  { at: 5.4, f: "whoosh", v: 0.5 },
  { at: 9.08, f: "pop" },
  { at: 10.92, f: "ding", v: 0.5 },
  { at: 13.0, f: "boom", v: 0.4 },
  { at: 16.04, f: "whoosh", v: 0.5 },
  { at: 19.4, f: "pop" },
  { at: 20.52, f: "pop" },
  { at: 21.32, f: "boom", v: 0.5 },
  { at: 23.1, f: "whoosh" },
  { at: 24.28, f: "pop" },
  { at: 27.4, f: "pop" },
  { at: 31.72, f: "ding", v: 0.6 },
  { at: 32.45, f: "whoosh" },
  { at: 35.4, f: "pop" },
  { at: 36.68, f: "pop" },
  { at: 38.52, f: "boom", v: 0.5 },
  { at: 39.55, f: "whoosh" },
  { at: 40.9, f: "click" },
  { at: 44.0, f: "pop" },
  { at: 45.04, f: "pop" },
  { at: 46.96, f: "ding", v: 0.6 },
  { at: 48.2, f: "boom", v: 0.6 },
  { at: 52.4, f: "whoosh" },
  { at: 53.3, f: "click" },
  { at: 54.3, f: "pop" },
  { at: 55.64, f: "pop" },
  { at: 56.6, f: "ding", v: 0.5 },
];

const Scenes = () => (
  <>
    {/* 7.4–12.5: las promesas de los gurús */}
    <Sticker at={9.08} to={10.8} icon="🏎️" x={180} y={560} size={160} />
    <Sticker at={10.92} to={12.4} icon="🤑" x={900} y={540} size={160} rot={10} />

    {/* 16–23: estafa o dinero fácil */}
    <Sticker at={19.4} to={20.45} icon="🚩" x={180} y={560} />
    <Sticker at={20.52} to={21.3} icon="💸" x={900} y={560} rot={10} />

    {/* SPLIT 23.1–32.45: lo que de verdad hace un closer */}
    <Card from={23.2} to={32.4} style={SPLIT_CARD}>
      <Chip color={C.lime}>Lo real</Chip>
      <PictoRow>
        <Picto at={24.28} icon="📞" label="Llamadas con interesados" size={100} />
        <Picto at={27.4} icon="🤝" label="Les ayuda a decidir" size={100} />
        <Picto at={31.72} icon="💰" label="Comisión solo si se cierra" size={100} accent={C.lime} />
      </PictoRow>
    </Card>

    {/* 32.45–39.5: días buenos y malos */}
    <Sticker at={35.4} to={36.6} icon="☀️" x={180} y={560} />
    <Sticker at={36.68} to={38.45} icon="🌧️" x={900} y={560} rot={10} />

    {/* PIP 39.55–47.6: lo que sí vas a ver aquí */}
    <Card from={39.65} to={47.55} style={CARD_AREA}>
      <Chip color={C.violet}>Lo que verás aquí</Chip>
      <Title>Mi proceso real</Title>
      <PictoRow>
        <Picto at={40.48} icon="🏎️" label="Autos de lujo" size={90} accent={C.red} strikeAt={40.9} />
        <Picto at={44.0} icon="👍" label="Lo que va bien" size={90} />
        <Picto at={45.04} icon="👎" label="Lo que va mal" size={90} />
        <Picto at={46.96} icon="🎯" label="Mi 1ª venta" size={90} accent={C.lime} />
      </PictoRow>
    </Card>

    {/* 55.6–fin: cierre */}
    <FollowCTA from={55.6} saveAt={55.64} followAt={56.3} handle={BRAND} />
  </>
);

export const Main: React.FC = () => (
  <AbsoluteFill style={{ background: C.bg }}>
    <Background />
    <Camera keys={KEYS} focusY={36} />
    <Scenes />
    <Subtitles keys={KEYS} keywords={KEYWORDS} hide={HIDE_SUBS} />
    <Brand hide={[[52.4, 55.55]]} />
    <StoryProgress />
    <Sounds list={SFX} />
  </AbsoluteFill>
);
