// "El gran sueño" (51 s): presentación de la cuenta y nuevo camino como High Ticket Closer.
import React from "react";
import { AbsoluteFill } from "remotion";
import { C } from "./theme";
import {
  Arrow,
  Background,
  Brand,
  CamKey,
  Camera,
  Card,
  CARD_AREA,
  Chip,
  LowerThird,
  Node,
  PIP,
  Quote,
  ReelCards,
  Row,
  Sfx,
  Sounds,
  SPLIT,
  SPLIT_CARD,
  Stat,
  Subtitles,
  Title,
  punch,
} from "./lib";

// Reels de muestra: recortes de 5 s guardados en public/reels/
const REELS = [
  { at: 0.25, title: "El gran sueño", src: "reels/1.mp4" },
  { at: 1.2, title: "El control 😂", src: "reels/2.mp4" },
  { at: 2.2, title: "¿Quién será ese Jeison?", src: "reels/3.mp4" },
];

const KEYS: CamKey[] = [
  { at: 0, box: punch(1.0) },
  { at: 5.9, box: punch(1.18) }, // "soy yo"
  { at: 6.9, box: PIP },
  { at: 14.15, box: punch(1.0) },
  { at: 15.85, box: punch(1.15) }, // "totalmente diferente"
  { at: 17.1, box: SPLIT },
  { at: 25.3, box: PIP },
  { at: 29.1, box: punch(1.0) },
  { at: 31.9, box: PIP },
  { at: 36.97, box: punch(1.0) },
  { at: 39.57, box: punch(1.12) }, // "tranquilo"
  { at: 41.32, box: SPLIT },
  { at: 47.62, box: punch(1.2) }, // "quédate"
];

const KEYWORDS = [
  "cámara", "cara", "reír", "diferente", "High Ticket", "Closer", "comisión", "cero",
  "documentar", "cliente", "humor", "habilidad", "2026", "tips",
];

const HIDE_SUBS: [number, number][] = [[47.62, 99]];

// whoosh = cambio de encuadre · pop = ítem nuevo · ding = número o logro · boom = zoom de remate
const SFX: Sfx[] = [
  { at: 0.25, f: "pop" },
  { at: 1.2, f: "pop" },
  { at: 2.2, f: "pop" },
  { at: 5.9, f: "boom", v: 0.5 },
  { at: 6.9, f: "whoosh" },
  { at: 9.25, f: "pop" },
  { at: 12.85, f: "pop" },
  { at: 14.15, f: "whoosh" },
  { at: 15.85, f: "boom", v: 0.5 },
  { at: 17.1, f: "whoosh" },
  { at: 18.21, f: "ding", v: 0.6 },
  { at: 20.77, f: "pop" },
  { at: 22.13, f: "pop" },
  { at: 23.81, f: "ding", v: 0.5 },
  { at: 25.3, f: "whoosh" },
  { at: 26.94, f: "ding", v: 0.5 },
  { at: 27.95, f: "ding", v: 0.5 },
  { at: 29.1, f: "whoosh" },
  { at: 30.54, f: "pop" },
  { at: 31.9, f: "whoosh" },
  { at: 33.58, f: "pop" },
  { at: 35.69, f: "ding", v: 0.6 },
  { at: 36.97, f: "whoosh" },
  { at: 39.57, f: "boom", v: 0.4 },
  { at: 41.32, f: "whoosh" },
  { at: 44.75, f: "pop" },
  { at: 45.71, f: "pop" },
  { at: 47.62, f: "boom", v: 0.5 },
  { at: 49.55, f: "ding", v: 0.6 },
];

const Scenes = () => (
  <>
    {/* 0–4.3 gancho: tu cara + muestra de tus reels */}
    <ReelCards from={0} to={4.3} items={REELS} />

    {/* PIP 6.9–14.1: lo que hacía antes */}
    <Card from={7.0} to={14.05} style={CARD_AREA}>
      <Chip color={C.violet}>Antes</Chip>
      <Title>Creaba contenido de humor</Title>
      <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
        <Row at={9.25}>Cada video que viste</Row>
        <Row at={12.85}>Hecho para hacerte reír 😂</Row>
      </div>
    </Card>

    {/* SPLIT 17.1–25.3: el nuevo camino */}
    <Card from={17.2} to={25.2} style={SPLIT_CARD}>
      <Chip color={C.lime}>Mi nuevo camino</Chip>
      <Title size={64}>High Ticket Closer</Title>
      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        <Row at={20.77}>Profesión de ventas</Row>
        <Row at={22.13}>Productos de alto valor</Row>
        <Row at={23.81}>Ganas comisión por venta</Row>
      </div>
    </Card>

    {/* PIP 25.3–29.1: desde cero */}
    <Card from={25.4} to={29.0} style={CARD_AREA}>
      <Chip color={C.red}>Hoy</Chip>
      <Title>Empiezo desde cero</Title>
      <div style={{ display: "flex", gap: 22 }}>
        <Stat at={26.94} accent={C.red} label="clientes" big="0" />
        <Stat at={27.95} accent={C.red} label="comisiones" big="0" />
      </div>
    </Card>

    {/* FULL 29.1–31.9: el reto */}
    <LowerThird from={30.54} to={31.85} tag="Reto" text="Documento todo mi proceso" />

    {/* PIP 31.9–36.97: lo que vas a ver */}
    <Card from={32.0} to={36.87} style={CARD_AREA}>
      <Chip color={C.violet}>Vas a ver</Chip>
      <Title>Todo mi proceso real</Title>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <Node at={32.3} n="01" label="Aprendizajes" accent={C.violet} />
        <Arrow at={33.2} />
        <Node at={33.58} n="02" label="Rechazos" accent={C.violet} />
        <Arrow at={34.77} />
        <Node at={35.69} n="03" label="1er cliente" accent={C.lime} />
      </div>
    </Card>

    {/* SPLIT 41.32–47.57: la invitación */}
    <Card from={41.42} to={47.52} style={SPLIT_CARD}>
      <Chip color={C.lime}>En este 2026</Chip>
      <Title size={58}>Aprende una nueva habilidad</Title>
      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        <Row at={44.75}>Una habilidad que paga</Row>
        <Row at={45.71}>Dale valor a tu vida</Row>
      </div>
    </Card>

    {/* Punch-in 47.62–fin: cierre */}
    <Quote
      from={47.62}
      to={99}
      mark="tips"
      lines={[
        [["Quédate", 47.71]],
        [["te", 48.99], ["daré", 49.23]],
        [["todos", 49.55], ["mis", 49.79], ["tips", 49.95]],
      ]}
    />
  </>
);

export const Main: React.FC = () => (
  <AbsoluteFill style={{ background: C.bg }}>
    <Background />
    <Camera keys={KEYS} focusY={55} />
    <Scenes />
    <Subtitles keys={KEYS} keywords={KEYWORDS} hide={HIDE_SUBS} />
    <Brand />
    <Sounds list={SFX} />
  </AbsoluteFill>
);
