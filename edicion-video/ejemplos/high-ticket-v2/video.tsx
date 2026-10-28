// "¿Qué es un High Ticket Closer?" v2 (66 s): explicado como para un niño de 5 años.
// Tu cara siempre visible: stickers a los lados en tomas completas, dibujos en tarjetas en los recuadros.
import React from "react";
import { AbsoluteFill } from "remotion";
import { BRAND, C } from "./theme";
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
  FollowCTA,
  LowerThird,
  PIP,
  Picto,
  PictoRow,
  Row,
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
  { at: 0, box: punch(1.1) },
  { at: 3.24, box: punch(1.3) }, // "High Ticket Closer"
  { at: 4.3, box: punch(1.1) },
  { at: 7.1, box: PIP }, // la mentoría
  { at: 12.7, box: SPLIT }, // antes de pagar
  { at: 18.6, box: PIP }, // dudas y miedos
  { at: 27.1, box: punch(1.1) },
  { at: 28.2, box: punch(1.3) }, // "aparece el closer"
  { at: 29.2, box: SPLIT }, // la llamada
  { at: 32.1, box: PIP }, // el médico
  { at: 39.1, box: SPLIT }, // así de simple
  { at: 50.05, box: punch(1.1) },
  { at: 50.55, box: punch(1.28) }, // "lo mejor"
  { at: 53.0, box: PIP }, // lo que necesitas
  { at: 59.5, box: punch(1.1) },
  { at: 62.25, box: punch(1.25) }, // cierre
];

const KEYWORDS = [
  "High Ticket", "Closer.", "Closer", "mentoría", "$5", "segura", "dudas", "miedo", "anuncio", "llamada",
  "médico", "valor", "decisión", "comisión", "casa", "escuchar", "comunicarte", "aprende",
];

const HIDE_SUBS: [number, number][] = [[62.25, 99]];

// whoosh = cambio de encuadre · pop = dibujo/sticker · ding = número o logro · boom = zoom (máx. 1 por segundo)
const SFX: Sfx[] = [
  { at: 0.12, f: "pop" },
  { at: 1.8, f: "pop" },
  { at: 3.24, f: "boom", v: 0.5 },
  { at: 4.5, f: "pop" },
  { at: 6.04, f: "ding", v: 0.5 },
  { at: 7.1, f: "whoosh" },
  { at: 9.08, f: "pop" },
  { at: 11.4, f: "ding", v: 0.6 },
  { at: 12.7, f: "whoosh" },
  { at: 13.8, f: "pop" },
  { at: 16.63, f: "pop" },
  { at: 17.91, f: "ding", v: 0.5 },
  { at: 18.6, f: "whoosh" },
  { at: 20.75, f: "pop" },
  { at: 21.79, f: "pop" },
  { at: 23.31, f: "pop" },
  { at: 26.03, f: "click" },
  { at: 27.1, f: "whoosh" },
  { at: 28.27, f: "boom", v: 0.5 },
  { at: 29.2, f: "whoosh" },
  { at: 30.75, f: "pop" },
  { at: 32.1, f: "whoosh" },
  { at: 33.43, f: "pop" },
  { at: 35.19, f: "pop" },
  { at: 38.23, f: "ding", v: 0.5 },
  { at: 39.1, f: "whoosh" },
  { at: 43.43, f: "pop" },
  { at: 48.47, f: "ding", v: 0.6 },
  { at: 50.05, f: "whoosh" },
  { at: 52.11, f: "pop" },
  { at: 53.0, f: "whoosh" },
  { at: 55.43, f: "click" },
  { at: 56.63, f: "ding", v: 0.5 },
  { at: 58.67, f: "pop" },
  { at: 59.5, f: "whoosh" },
  { at: 60.6, f: "pop" },
  { at: 62.31, f: "boom", v: 0.4 },
  { at: 63.19, f: "pop" },
  { at: 64.3, f: "ding", v: 0.5 },
];

const Scenes = () => (
  <>
    {/* 0–7.1 gancho: tu cara grande + reacciones */}
    <Sticker at={0.12} to={1.75} icon="🤷‍♀️" x={850} y={520} rot={10} />
    <Sticker at={1.8} to={3.2} icon="⏳" x={220} y={540} />
    <Sticker at={3.3} to={4.3} icon="🤯" x={860} y={480} rot={12} />
    <LowerThird from={4.5} to={7.05} tag="⏱ 1:30" text="Te lo explico fácil" />
    <Sticker at={6.04} to={7.05} icon="⚡" x={870} y={560} />

    {/* PIP 7.1–12.7: la mentoría cara */}
    <Card from={7.2} to={12.65} style={CARD_AREA}>
      <Chip color={C.violet}>Imagínate</Chip>
      <Title>Quieres una mentoría</Title>
      <PictoRow>
        <Picto at={7.2} icon="🙋‍♀️" label="Tú" />
        <Arrow at={8.6} />
        <Picto at={9.08} icon="🎓" label="Mentoría" />
        <Arrow at={10.4} />
        <Picto at={11.4} icon="💰" accent={C.lime} label={<Counter at={11.4} to={5000} prefix="$" dur={0.6} />} />
      </PictoRow>
    </Card>

    {/* SPLIT 12.7–18.6: antes de pagar */}
    <Card from={12.8} to={18.55} style={SPLIT_CARD}>
      <Chip color={C.lime}>Antes de pagar</Chip>
      <PictoRow>
        <Picto at={13.8} icon="🦋" label="Quieres un cambio" size={110} />
        <Picto at={16.63} icon="💬" label="Hablar con alguien" size={110} />
        <Picto at={17.91} icon="😌" label="Estar segura" size={110} accent={C.lime} okAt={18.1} />
      </PictoRow>
    </Card>

    {/* PIP 18.6–27.1: lo que pasa por tu cabeza */}
    <Card from={18.7} to={27.05} style={CARD_AREA}>
      <Chip color={C.red}>Mucho dinero en juego</Chip>
      <Title>Tu cabeza se llena de…</Title>
      <PictoRow>
        <Picto at={20.75} icon="🤔" label="Dudas" size={110} accent={C.red} />
        <Picto at={21.79} icon="😰" label="Miedo" size={110} accent={C.red} />
        <Picto at={22.51} icon="❓" label="Preguntas" size={110} accent={C.red} />
      </PictoRow>
      <Row at={23.31} icon="x" strikeAt={26.03}>
        Nadie paga solo por un anuncio 📱
      </Row>
    </Card>

    {/* FULL 27.1–29.2: ¡aparece el closer! */}
    <Sticker at={28.27} to={29.15} icon="🦸‍♀️" x={850} y={500} size={170} rot={8} />

    {/* SPLIT 29.2–32.1: la llamada */}
    <Card from={29.3} to={32.05} style={SPLIT_CARD}>
      <Chip color={C.lime}>El closer te llama</Chip>
      <PictoRow>
        <Picto at={29.4} icon="👩‍💼" label="Closer" accent={C.lime} />
        <Picto at={30.75} icon="📞" ring size={100} />
        <Picto at={31.23} icon="🙋‍♀️" label="Tú" />
      </PictoRow>
    </Card>

    {/* PIP 32.1–39.1: es como ir al médico */}
    <Card from={32.2} to={39.05} style={CARD_AREA}>
      <Chip color={C.violet}>Es como el médico 🩺</Chip>
      <Title>Primero pregunta, después decide</Title>
      <PictoRow>
        <Picto at={32.79} icon="👩‍⚕️" label="Médico" size={90} />
        <Arrow at={33.6} />
        <Picto at={34.39} icon="❓" label="Pregunta" size={90} />
        <Arrow at={34.9} />
        <Picto at={35.19} icon="🔍" label="Entiende" size={90} />
        <Arrow at={37.4} />
        <Picto at={38.23} icon="✅" label="¿Es para ti?" size={90} accent={C.lime} />
      </PictoRow>
    </Card>

    {/* SPLIT 39.1–50.05: así de simple */}
    <Card from={39.2} to={50.0} style={SPLIT_CARD}>
      <Chip color={C.lime}>Así de simple</Chip>
      <PictoRow>
        <Picto at={39.51} icon="💎" label="High Ticket = alto valor" size={100} />
        <Picto at={43.43} icon="🤝" label="Closer = te ayuda a decidir" size={100} />
        <Picto at={48.47} icon="💵" label="Gana comisión por venta" size={100} accent={C.lime} />
      </PictoRow>
    </Card>

    {/* FULL 50.05–53: desde casa */}
    <LowerThird from={51.5} to={52.95} tag="🏠 Bonus" text="Se puede hacer desde casa" />
    <Sticker at={52.11} to={52.95} icon="💻" x={860} y={540} />

    {/* PIP 53–59.5: lo que de verdad necesitas */}
    <Card from={53.1} to={59.45} style={CARD_AREA}>
      <Chip color={C.lime}>Lo que necesitas</Chip>
      <Title>¿Qué necesitas de verdad?</Title>
      <PictoRow>
        <Picto at={55.27} icon="🎓" label="Un título" size={110} accent={C.red} strikeAt={55.43} />
        <Picto at={56.63} icon="👂" label="Escuchar" size={110} accent={C.lime} okAt={56.8} />
        <Picto at={57.19} icon="🗣️" label="Comunicarte" size={110} accent={C.lime} okAt={57.4} />
      </PictoRow>
      <Row at={58.67}>Y eso se aprende ✨</Row>
    </Card>

    {/* FULL 59.5–62.25: yo también estoy aprendiendo */}
    <Sticker at={60.6} to={62.2} icon="📚" x={220} y={540} />

    {/* 62.25–fin: cierre con botones, tu cara sigue visible */}
    <FollowCTA from={62.25} saveAt={62.31} followAt={63.19} handle={BRAND} />
  </>
);

export const Main: React.FC = () => (
  <AbsoluteFill style={{ background: C.bg }}>
    <Background />
    <Camera keys={KEYS} focusY={48} />
    <Scenes />
    <Subtitles keys={KEYS} keywords={KEYWORDS} hide={HIDE_SUBS} />
    <Brand />
    <StoryProgress />
    <Sounds list={SFX} />
  </AbsoluteFill>
);
