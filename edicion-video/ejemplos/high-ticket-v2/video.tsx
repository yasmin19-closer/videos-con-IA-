// "¿Qué es un High Ticket Closer?" v2 (65 s): explicado como para un niño de 5 años.
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
  { at: 5.93, box: PIP }, // la mentoría
  { at: 11.53, box: SPLIT }, // antes de pagar
  { at: 17.43, box: PIP }, // dudas y miedos
  { at: 25.93, box: punch(1.1) },
  { at: 27.03, box: punch(1.3) }, // "aparece el closer"
  { at: 28.03, box: SPLIT }, // la llamada
  { at: 30.93, box: PIP }, // el médico
  { at: 37.93, box: SPLIT }, // así de simple
  { at: 48.88, box: punch(1.1) },
  { at: 49.38, box: punch(1.28) }, // "lo mejor"
  { at: 51.83, box: PIP }, // lo que necesitas
  { at: 58.33, box: punch(1.1) },
  { at: 61.08, box: punch(1.25) }, // cierre
];

const KEYWORDS = [
  "High Ticket", "Closer.", "Closer", "mentoría", "$5", "segura", "dudas", "miedo", "anuncio", "llamada",
  "médico", "valor", "decisión", "comisión", "casa", "escuchar", "comunicarte", "aprende",
];

const HIDE_SUBS: [number, number][] = [[61.08, 99]];

// whoosh = cambio de encuadre · pop = dibujo/sticker · ding = número o logro · boom = zoom (máx. 1 por segundo)
const SFX: Sfx[] = [
  { at: 0.12, f: "pop" },
  { at: 1.8, f: "pop" },
  { at: 3.24, f: "boom", v: 0.5 },
  { at: 4.5, f: "pop" },
  { at: 5.93, f: "whoosh" },
  { at: 7.91, f: "pop" },
  { at: 10.23, f: "ding", v: 0.6 },
  { at: 11.53, f: "whoosh" },
  { at: 12.63, f: "pop" },
  { at: 15.46, f: "pop" },
  { at: 16.74, f: "ding", v: 0.5 },
  { at: 17.43, f: "whoosh" },
  { at: 19.58, f: "pop" },
  { at: 20.62, f: "pop" },
  { at: 22.14, f: "pop" },
  { at: 24.86, f: "click" },
  { at: 25.93, f: "whoosh" },
  { at: 27.1, f: "boom", v: 0.5 },
  { at: 28.03, f: "whoosh" },
  { at: 29.58, f: "pop" },
  { at: 30.93, f: "whoosh" },
  { at: 32.26, f: "pop" },
  { at: 34.02, f: "pop" },
  { at: 37.06, f: "ding", v: 0.5 },
  { at: 37.93, f: "whoosh" },
  { at: 42.26, f: "pop" },
  { at: 47.3, f: "ding", v: 0.6 },
  { at: 48.88, f: "whoosh" },
  { at: 50.94, f: "pop" },
  { at: 51.83, f: "whoosh" },
  { at: 54.26, f: "click" },
  { at: 55.46, f: "ding", v: 0.5 },
  { at: 57.5, f: "pop" },
  { at: 58.33, f: "whoosh" },
  { at: 59.43, f: "pop" },
  { at: 61.14, f: "boom", v: 0.4 },
  { at: 62.02, f: "pop" },
  { at: 63.13, f: "ding", v: 0.5 },
];

const Scenes = () => (
  <>
    {/* 0–5.93 gancho: tu cara grande + reacciones */}
    <Sticker at={0.12} to={1.75} icon="🤷‍♀️" x={850} y={520} rot={10} />
    <Sticker at={1.8} to={3.2} icon="⏳" x={220} y={540} />
    <Sticker at={3.3} to={4.3} icon="🤯" x={860} y={480} rot={12} />
    <LowerThird from={4.5} to={5.88} tag="⏱ 1 min" text="Te lo explico fácil" />

    {/* PIP 5.93–11.53: la mentoría cara */}
    <Card from={6.03} to={11.48} style={CARD_AREA}>
      <Chip color={C.violet}>Imagínate</Chip>
      <Title>Quieres una mentoría</Title>
      <PictoRow>
        <Picto at={6.03} icon="🙋‍♀️" label="Tú" />
        <Arrow at={7.43} />
        <Picto at={7.91} icon="🎓" label="Mentoría" />
        <Arrow at={9.23} />
        <Picto at={10.23} icon="💰" accent={C.lime} label={<Counter at={10.23} to={5000} prefix="$" dur={0.6} />} />
      </PictoRow>
    </Card>

    {/* SPLIT 11.53–17.43: antes de pagar */}
    <Card from={11.63} to={17.38} style={SPLIT_CARD}>
      <Chip color={C.lime}>Antes de pagar</Chip>
      <PictoRow>
        <Picto at={12.63} icon="🦋" label="Quieres un cambio" size={110} />
        <Picto at={15.46} icon="💬" label="Hablar con alguien" size={110} />
        <Picto at={16.74} icon="😌" label="Estar segura" size={110} accent={C.lime} okAt={16.93} />
      </PictoRow>
    </Card>

    {/* PIP 17.43–25.93: lo que pasa por tu cabeza */}
    <Card from={17.53} to={25.88} style={CARD_AREA}>
      <Chip color={C.red}>Mucho dinero en juego</Chip>
      <Title>Tu cabeza se llena de…</Title>
      <PictoRow>
        <Picto at={19.58} icon="🤔" label="Dudas" size={110} accent={C.red} />
        <Picto at={20.62} icon="😰" label="Miedo" size={110} accent={C.red} />
        <Picto at={21.34} icon="❓" label="Preguntas" size={110} accent={C.red} />
      </PictoRow>
      <Row at={22.14} icon="x" strikeAt={24.86}>
        Nadie paga solo por un anuncio 📱
      </Row>
    </Card>

    {/* FULL 25.93–28.03: ¡aparece el closer! */}
    <Sticker at={27.1} to={27.98} icon="🦸‍♀️" x={850} y={500} size={170} rot={8} />

    {/* SPLIT 28.03–30.93: la llamada */}
    <Card from={28.13} to={30.88} style={SPLIT_CARD}>
      <Chip color={C.lime}>El closer te llama</Chip>
      <PictoRow>
        <Picto at={28.23} icon="👩‍💼" label="Closer" accent={C.lime} />
        <Picto at={29.58} icon="📞" ring size={100} />
        <Picto at={30.06} icon="🙋‍♀️" label="Tú" />
      </PictoRow>
    </Card>

    {/* PIP 30.93–37.93: es como ir al médico */}
    <Card from={31.03} to={37.88} style={CARD_AREA}>
      <Chip color={C.violet}>Es como el médico 🩺</Chip>
      <Title>Primero pregunta, después decide</Title>
      <PictoRow>
        <Picto at={31.62} icon="👩‍⚕️" label="Médico" size={90} />
        <Arrow at={32.43} />
        <Picto at={33.22} icon="❓" label="Pregunta" size={90} />
        <Arrow at={33.73} />
        <Picto at={34.02} icon="🔍" label="Entiende" size={90} />
        <Arrow at={36.23} />
        <Picto at={37.06} icon="✅" label="¿Es para ti?" size={90} accent={C.lime} />
      </PictoRow>
    </Card>

    {/* SPLIT 37.93–48.88: así de simple */}
    <Card from={38.03} to={48.83} style={SPLIT_CARD}>
      <Chip color={C.lime}>Así de simple</Chip>
      <PictoRow>
        <Picto at={38.34} icon="💎" label="High Ticket = alto valor" size={100} />
        <Picto at={42.26} icon="🤝" label="Closer = te ayuda a decidir" size={100} />
        <Picto at={47.3} icon="💵" label="Gana comisión por venta" size={100} accent={C.lime} />
      </PictoRow>
    </Card>

    {/* FULL 48.88–53: desde casa */}
    <LowerThird from={50.33} to={51.78} tag="🏠 Bonus" text="Se puede hacer desde casa" />
    <Sticker at={50.94} to={51.78} icon="💻" x={860} y={540} />

    {/* PIP 53–58.33: lo que de verdad necesitas */}
    <Card from={51.93} to={58.28} style={CARD_AREA}>
      <Chip color={C.lime}>Lo que necesitas</Chip>
      <Title>¿Qué necesitas de verdad?</Title>
      <PictoRow>
        <Picto at={54.1} icon="🎓" label="Un título" size={110} accent={C.red} strikeAt={54.26} />
        <Picto at={55.46} icon="👂" label="Escuchar" size={110} accent={C.lime} okAt={55.63} />
        <Picto at={56.02} icon="🗣️" label="Comunicarte" size={110} accent={C.lime} okAt={56.23} />
      </PictoRow>
      <Row at={57.5}>Y eso se aprende ✨</Row>
    </Card>

    {/* FULL 58.33–61.08: yo también estoy aprendiendo */}
    <Sticker at={59.43} to={61.03} icon="📚" x={220} y={540} />

    {/* 61.08–fin: cierre con botones, tu cara sigue visible */}
    <FollowCTA from={61.08} saveAt={61.14} followAt={62.02} handle={BRAND} />
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
