// "¿Qué es un High Ticket Closer?" (61 s), explicado como para un niño de 5 años, con dibujos.
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
  Counter,
  LowerThird,
  PIP,
  Picto,
  PictoRow,
  Quote,
  Row,
  Sfx,
  Sounds,
  SPLIT,
  SPLIT_CARD,
  Subtitles,
  Title,
  punch,
} from "./lib";

const KEYS: CamKey[] = [
  { at: 0, box: punch(1.0) },
  { at: 1.96, box: punch(1.15) }, // "High Ticket Closer"
  { at: 5.2, box: PIP }, // la mentoría
  { at: 11.45, box: SPLIT }, // antes de pagar
  { at: 16.8, box: PIP }, // dudas y miedos
  { at: 23.5, box: punch(1.0) },
  { at: 24.5, box: punch(1.18) }, // "aparece el closer"
  { at: 25.5, box: SPLIT }, // la llamada
  { at: 28.15, box: PIP }, // el médico
  { at: 36.3, box: SPLIT }, // definiciones
  { at: 45.85, box: punch(1.0) },
  { at: 46.4, box: punch(1.12) }, // "lo mejor"
  { at: 48.75, box: PIP }, // lo que necesitas
  { at: 55.2, box: punch(1.0) },
  { at: 57.25, box: punch(1.2) }, // "guárdalo"
];

const KEYWORDS = [
  "High Ticket", "Closer", "Closer.", "2.000", "segura", "dudas", "miedos", "anuncio", "llamada", "médico",
  "valor", "decisión", "comisión", "casa", "escuchar", "comunicarte", "aprende", "Guárdalo",
];

const HIDE_SUBS: [number, number][] = [[57.25, 99]];

// whoosh = cambio de encuadre · pop = dibujo nuevo · ding = número o logro · click = tachar · boom = zoom
const SFX: Sfx[] = [
  { at: 1.96, f: "boom", v: 0.5 },
  { at: 3.3, f: "pop" },
  { at: 5.2, f: "whoosh" },
  { at: 7.4, f: "pop" },
  { at: 10.36, f: "ding", v: 0.6 },
  { at: 11.45, f: "whoosh" },
  { at: 12.44, f: "pop" },
  { at: 14.92, f: "pop" },
  { at: 16.8, f: "whoosh" },
  { at: 18.84, f: "pop" },
  { at: 19.88, f: "pop" },
  { at: 21.08, f: "pop" },
  { at: 23.5, f: "whoosh" },
  { at: 24.5, f: "boom", v: 0.5 },
  { at: 25.5, f: "whoosh" },
  { at: 26.92, f: "pop" },
  { at: 28.15, f: "whoosh" },
  { at: 29.4, f: "pop" },
  { at: 31.65, f: "pop" },
  { at: 32.61, f: "pop" },
  { at: 35.41, f: "ding", v: 0.5 },
  { at: 36.3, f: "whoosh" },
  { at: 39.81, f: "pop" },
  { at: 44.24, f: "ding", v: 0.6 },
  { at: 45.85, f: "whoosh" },
  { at: 46.9, f: "boom", v: 0.4 },
  { at: 48.75, f: "whoosh" },
  { at: 51.05, f: "pop" },
  { at: 52.25, f: "ding", v: 0.5 },
  { at: 55.2, f: "whoosh" },
  { at: 57.25, f: "boom", v: 0.5 },
];

const Scenes = () => (
  <>
    {/* 0–5.2 gancho: tu cara + la promesa */}
    <LowerThird from={3.3} to={5.15} tag="⏱ 1:30" text="Te lo explico fácil" />

    {/* PIP 5.2–11.45: la mentoría cara */}
    <Card from={5.3} to={11.4} style={CARD_AREA}>
      <Chip color={C.violet}>Imagínate</Chip>
      <Title>Quieres una mentoría</Title>
      <PictoRow>
        <Picto at={5.3} icon="🙋‍♀️" label="Tú" />
        <Arrow at={6.9} />
        <Picto at={7.4} icon="🎓" label="Mentoría" />
        <Arrow at={9.6} />
        <Picto at={10.36} icon="💰" accent={C.lime} label={<Counter at={10.36} to={2000} prefix="$" dur={0.6} /> } />
      </PictoRow>
    </Card>

    {/* SPLIT 11.45–16.8: antes de pagar */}
    <Card from={11.55} to={16.75} style={SPLIT_CARD}>
      <Chip color={C.lime}>Antes de pagar</Chip>
      <PictoRow>
        <Picto at={12.44} icon="🦋" label="Quieres un cambio" size={110} />
        <Picto at={14.92} icon="💬" label="Hablar con alguien" size={110} />
        <Picto at={16.04} icon="😌" label="Estar segura" size={110} accent={C.lime} okAt={16.3} />
      </PictoRow>
    </Card>

    {/* PIP 16.8–23.5: lo que pasa por tu cabeza */}
    <Card from={16.9} to={23.45} style={CARD_AREA}>
      <Chip color={C.red}>Mucho dinero en juego</Chip>
      <Title>Tu cabeza se llena de…</Title>
      <PictoRow>
        <Picto at={18.84} icon="🤔" label="Dudas" size={110} accent={C.red} />
        <Picto at={19.4} icon="😰" label="Miedos" size={110} accent={C.red} />
        <Picto at={20.04} icon="❓" label="Preguntas" size={110} accent={C.red} />
      </PictoRow>
      <Row at={21.08} icon="x" strikeAt={22.68}>
        Nadie paga solo por un anuncio 📱
      </Row>
    </Card>

    {/* SPLIT 25.5–28.15: la llamada */}
    <Card from={25.6} to={28.1} style={SPLIT_CARD}>
      <Chip color={C.lime}>El closer</Chip>
      <PictoRow>
        <Picto at={25.7} icon="👩‍💼" label="Closer" accent={C.lime} />
        <Picto at={26.92} icon="📞" ring size={100} />
        <Picto at={27.32} icon="🙋‍♀️" label="Tú" />
      </PictoRow>
    </Card>

    {/* PIP 28.15–36.3: es como ir al médico */}
    <Card from={28.25} to={36.25} style={CARD_AREA}>
      <Chip color={C.violet}>Es como el médico 🩺</Chip>
      <Title>Primero pregunta, después decide</Title>
      <PictoRow>
        <Picto at={29.4} icon="👩‍⚕️" label="Médico" size={90} />
        <Arrow at={30.6} />
        <Picto at={31.65} icon="❓" label="Pregunta" size={90} />
        <Arrow at={32.3} />
        <Picto at={32.61} icon="🔍" label="Entiende" size={90} />
        <Arrow at={34.6} />
        <Picto at={35.41} icon="✅" label="¿Es para ti?" size={90} accent={C.lime} />
      </PictoRow>
    </Card>

    {/* SPLIT 36.3–45.85: así de simple */}
    <Card from={36.4} to={45.8} style={SPLIT_CARD}>
      <Chip color={C.lime}>Así de simple</Chip>
      <PictoRow>
        <Picto at={36.93} icon="💎" label="High Ticket = alto valor" size={100} />
        <Picto at={39.81} icon="🤝" label="Closer = te ayuda a decidir" size={100} />
        <Picto at={44.24} icon="💵" label="Gana comisión por venta" size={100} accent={C.lime} />
      </PictoRow>
    </Card>

    {/* FULL 45.85–48.75: desde casa */}
    <LowerThird from={47.6} to={48.7} tag="🏠 Bonus" text="Se puede hacer desde casa" />

    {/* PIP 48.75–55.2: lo que de verdad necesitas */}
    <Card from={48.85} to={55.15} style={CARD_AREA}>
      <Chip color={C.lime}>Lo que necesitas</Chip>
      <Title>¿Qué necesitas de verdad?</Title>
      <PictoRow>
        <Picto at={51.05} icon="🎓" label="Un título" size={110} accent={C.red} strikeAt={51.3} />
        <Picto at={52.25} icon="👂" label="Escuchar" size={110} accent={C.lime} okAt={52.4} />
        <Picto at={52.89} icon="🗣️" label="Comunicarte" size={110} accent={C.lime} okAt={53.1} />
      </PictoRow>
      <Row at={54.41}>Y eso se aprende ✨</Row>
    </Card>

    {/* Punch-in 57.25–fin: cierre */}
    <Quote
      from={57.25}
      to={99}
      mark="sígueme"
      lines={[
        [["Guárdalo 📌", 57.29]],
        [["y", 57.93], ["sígueme", 58.01]],
      ]}
    />
  </>
);

export const Main: React.FC = () => (
  <AbsoluteFill style={{ background: C.bg }}>
    <Background />
    <Camera keys={KEYS} focusY={30} />
    <Scenes />
    <Subtitles keys={KEYS} keywords={KEYWORDS} hide={HIDE_SUBS} />
    <Brand />
    <Sounds list={SFX} />
  </AbsoluteFill>
);
