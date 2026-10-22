// Video de prueba: "objeción 2" (20 s). Tiempos tomados de transcripcion.txt.
import React from "react";
import { AbsoluteFill } from "remotion";
import { C } from "./theme";
import {
  Background,
  Brand,
  CamKey,
  Camera,
  Card,
  CARD_AREA,
  Chip,
  Quote,
  Row,
  Sfx,
  Sounds,
  Subtitles,
  Title,
  PIP,
  punch,
} from "./lib";

const KEYS: CamKey[] = [
  { at: 0, box: punch(1.0) },
  { at: 1.56, box: punch(1.15) },
  { at: 3.2, box: PIP },
  { at: 17.3, box: punch(1.0) },
  { at: 18.45, box: punch(1.18) },
];

const KEYWORDS = ["2000", "dólares", "ángulo", "seguimiento", "dominado", "resultado", "valor", "posicionada"];

const HIDE_SUBS: [number, number][] = [[18.4, 99]];

const SFX: Sfx[] = [
  { at: 1.56, f: "boom", v: 0.5 },
  { at: 2.36, f: "ding", v: 0.5 },
  { at: 3.2, f: "whoosh" },
  { at: 3.4, f: "pop" },
  { at: 6.06, f: "pop" },
  { at: 9.27, f: "pop" },
  { at: 12.48, f: "pop" },
  { at: 14.49, f: "pop" },
  { at: 16.4, f: "ding", v: 0.5 },
  { at: 17.3, f: "whoosh" },
  { at: 18.45, f: "boom", v: 0.5 },
];

const Scenes = () => (
  <>
    <Card from={3.3} to={17.2} style={CARD_AREA}>
      <Chip color={C.lime}>Mi sistema</Chip>
      <Title>Así vendo una oferta de $2.000</Title>
      <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
        <Row at={3.4}>Publico un ángulo pensado</Row>
        <Row at={6.06}>Seguimiento para mi link</Row>
        <Row at={9.27}>Aplico lo que ya dominé</Row>
        <Row at={12.48}>Cobro por resultado</Row>
        <Row at={14.49}>Subo mi valor al posicionarme</Row>
      </div>
    </Card>

    <Quote
      from={18.4}
      to={99}
      mark="Closer"
      lines={[
        [["Yo", 17.46], ["sigo", 17.86], ["a", 18.26]],
        [["Yasmin", 18.5], ["Albert", 18.98]],
        [["Closer", 19.54]],
      ]}
    />
  </>
);

export const Main: React.FC = () => (
  <AbsoluteFill style={{ background: C.bg }}>
    <Background />
    <Camera keys={KEYS} />
    <Scenes />
    <Subtitles keys={KEYS} keywords={KEYWORDS} hide={HIDE_SUBS} />
    <Brand />
    <Sounds list={SFX} />
  </AbsoluteFill>
);
