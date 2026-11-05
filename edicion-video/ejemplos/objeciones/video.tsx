// "Objeciones" (47 s) · estilo Claude: beis, negro y naranja, sin @ de Instagram.
// Tú abajo en una tarjeta sin recortes; arriba el gancho y una escena por idea, lanzada en su palabra.
import React from "react";
import {
  AbsoluteFill,
  interpolate,
  OffthreadVideo,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { FONT, FONT_FACES } from "./theme";
import { Sfx, Sounds } from "./lib";
import { VIDEO, WORDS } from "./words";

// ───────── paleta Claude ─────────
const K = {
  bg: "#F0EEE6",
  paper: "#FAF9F5",
  ink: "#141413",
  orange: "#D97757",
  deep: "#C15F3C",
  line: "#E3DACC",
  muted: "#6B6A65",
};
const SERIF = "Playfair Display";
const SERIF_FACE = `@font-face{font-family:"${SERIF}";src:url("${staticFile("fonts/PlayfairDisplay.ttf")}");font-weight:400 900;}`;

// Tarjeta de cámara: abajo, ancho 640 → alto según 480×854, sin recortar
const CARD_W = 640;
const CARD_H = Math.round((CARD_W * 854) / 480);
const CARD_X = (1080 - CARD_W) / 2;
const CARD_Y = 1920 - CARD_H - 50;
const TOP_H = CARD_Y - 30; // espacio para gancho y escenas

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const useT = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return { t: frame / fps, frame, fps };
};
const usePop = (at: number, damping = 12) => {
  const { frame, fps } = useT();
  return spring({ frame: frame - Math.round(at * fps), fps, config: { damping, mass: 0.55 } });
};

// ───────── escenas ─────────
const SCENES: [number, number][] = [
  [0, 4.9],
  [4.96, 8.0],
  [8.08, 11.95],
  [12.0, 15.8],
  [15.84, 22.8],
  [22.88, 27.5],
  [27.6, 33.4],
  [33.48, 37.35],
  [37.4, 41.25],
  [41.32, 99],
];

const Scene: React.FC<{ i: number; children: React.ReactNode }> = ({ i, children }) => {
  const { t } = useT();
  const [from, to] = SCENES[i];
  const p = usePop(from, 16);
  if (t < from || t >= to) return null;
  const out = interpolate(t, [to - 0.15, to], [1, 0], clamp);
  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        height: TOP_H,
        padding: "110px 70px 20px",
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        gap: 26,
        textAlign: "center",
        color: K.ink,
        fontFamily: FONT,
        opacity: Math.min(p, out),
        transform: `translateY(${(1 - p) * 40}px)`,
      }}
    >
      {children}
    </div>
  );
};

const Head: React.FC<{ at?: number; size?: number; children: React.ReactNode }> = ({ at = 0, size = 96, children }) => {
  const p = usePop(at, 14);
  return (
    <div
      style={{
        fontFamily: SERIF,
        fontWeight: 800,
        fontSize: size,
        lineHeight: 1.04,
        letterSpacing: -1,
        opacity: p,
        transform: `translateY(${(1 - p) * 30}px)`,
      }}
    >
      {children}
    </div>
  );
};

const O: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <span style={{ color: K.orange, fontStyle: "italic" }}>{children}</span>
);

const Small: React.FC<{ at: number; children: React.ReactNode }> = ({ at, children }) => {
  const p = usePop(at, 14);
  return (
    <div style={{ fontSize: 40, fontWeight: 700, color: K.muted, opacity: p, transform: `translateY(${(1 - p) * 16}px)` }}>
      {children}
    </div>
  );
};

const Pop: React.FC<{ at: number; icon: string; size?: number; rot?: number }> = ({ at, icon, size = 130, rot = 0 }) => {
  const p = usePop(at, 9);
  return (
    <div style={{ fontSize: size, lineHeight: 1, transform: `scale(${p}) rotate(${rot * p}deg)` }}>{icon}</div>
  );
};

const Tag: React.FC<{ at: number; children: React.ReactNode }> = ({ at, children }) => {
  const p = usePop(at, 12);
  return (
    <div
      style={{
        padding: "12px 30px",
        borderRadius: 999,
        background: K.orange,
        color: K.paper,
        fontWeight: 900,
        fontSize: 40,
        letterSpacing: 3,
        textTransform: "uppercase",
        transform: `scale(${0.6 + p * 0.4})`,
        opacity: p,
      }}
    >
      {children}
    </div>
  );
};

/** Burbuja de chat. side "l" = familia (negro), "r" = tú (naranja). */
const Bubble: React.FC<{ at: number; side?: "l" | "r"; children: React.ReactNode }> = ({ at, side = "l", children }) => {
  const p = usePop(at, 11);
  const left = side === "l";
  return (
    <div
      style={{
        alignSelf: left ? "flex-start" : "flex-end",
        maxWidth: 680,
        padding: "20px 34px",
        borderRadius: 40,
        borderBottomLeftRadius: left ? 8 : 40,
        borderBottomRightRadius: left ? 40 : 8,
        background: left ? K.ink : K.orange,
        color: K.paper,
        fontSize: 44,
        fontWeight: 700,
        opacity: p,
        transform: `scale(${0.5 + p * 0.5})`,
        transformOrigin: left ? "left bottom" : "right bottom",
      }}
    >
      {children}
    </div>
  );
};

/** Tarjeta clave (fondo naranja) para la frase que hay que guardar. */
const KeyCard: React.FC<{ at: number; children: React.ReactNode }> = ({ at, children }) => {
  const p = usePop(at, 11);
  return (
    <div
      style={{
        position: "relative",
        padding: "34px 44px",
        borderRadius: 36,
        background: K.orange,
        color: K.paper,
        fontFamily: SERIF,
        fontWeight: 800,
        fontSize: 70,
        lineHeight: 1.08,
        boxShadow: `0 24px 60px ${K.deep}55`,
        opacity: p,
        transform: `scale(${0.6 + p * 0.4}) rotate(${(1 - p) * -3}deg)`,
      }}
    >
      {children}
      <div style={{ position: "absolute", top: -34, right: -18, fontSize: 70, transform: `rotate(${18 * p}deg)` }}>📌</div>
    </div>
  );
};

const Scenes = () => (
  <>
    {/* 1 · gancho: lo que todos dicen */}
    <Scene i={0}>
      <Head size={100}>
        ¿Cómo se manejan las <O>objeciones</O>?
      </Head>
      <div style={{ display: "flex", flexDirection: "column", gap: 14, width: "100%" }}>
        <Bubble at={1.72}>"Aprende a manejar objeciones"</Bubble>
        <Bubble at={2.84} side="r">
          Ok… ¿pero cómo? 🤷‍♀️
        </Bubble>
      </div>
    </Scene>

    {/* 2 · ¿qué es eso? */}
    <Scene i={1}>
      <Pop at={5.0} icon="🤔" size={170} rot={-8} />
      <Head at={6.08} size={110}>
        ¿Qué <O>es</O> eso?
      </Head>
    </Scene>

    {/* 3 · definición */}
    <Scene i={2}>
      <Tag at={8.32}>Objeción</Tag>
      <Head at={9.6} size={86}>
        Una <O>excusa</O> para no decidir
      </Head>
      <Pop at={10.48} icon="🙅‍♀️" size={120} />
    </Scene>

    {/* 4 · en mi casa */}
    <Scene i={3}>
      <Pop at={13.92} icon="🏠" size={170} />
      <Head at={14.08} size={92}>
        En mi casa pasa <O>todos los días</O>
      </Head>
    </Scene>

    {/* 5 · el control remoto */}
    <Scene i={4}>
      <Head at={16.64} size={74}>
        Yo quiero el <O>control</O> 📺
      </Head>
      <div style={{ display: "flex", flexDirection: "column", gap: 16, width: "100%" }}>
        <Bubble at={19.2}>Ahorita no</Bubble>
        <Bubble at={20.16}>Déjame pensarlo</Bubble>
        <Bubble at={21.44}>Después te lo doy</Bubble>
      </div>
    </Scene>

    {/* 6 · no presiones */}
    <Scene i={5}>
      <Head at={25.44} size={104}>
        "Lo voy a <O>pensar</O>"
      </Head>
      <Small at={26.32}>Cuando te dicen esto…</Small>
      <Tag at={26.88}>🚫 No presiones</Tag>
    </Scene>

    {/* 7 · la pregunta clave */}
    <Scene i={6}>
      <Small at={27.6}>🔍 Pregunta con curiosidad</Small>
      <KeyCard at={29.6}>¿Qué parte te gustaría pensar?</KeyCard>
      <Head at={32.72} size={64}>
        → descubres la <O>duda real</O> 💡
      </Head>
    </Scene>

    {/* 8 · lo probé en casa */}
    <Scene i={7}>
      <Small at={33.6}>Lo probé en casa…</Small>
      <div style={{ display: "flex", alignItems: "center", gap: 30 }}>
        <Pop at={35.32} icon="📺" size={150} />
        <Head at={36.04} size={84}>
          sigue sin ser <O>mío</O> 😂
        </Head>
      </div>
    </Scene>

    {/* 9 · en una llamada de venta */}
    <Scene i={8}>
      <Pop at={38.04} icon="📞" size={150} rot={-10} />
      <Head at={38.04} size={80}>
        En una llamada de venta
      </Head>
      <Head at={39.32} size={110}>
        cambia <O>todo</O>
      </Head>
    </Scene>

    {/* 10 · cierre */}
    <Scene i={9}>
      <Head at={41.96} size={96}>
        Aprendamos <O>juntas</O> 🤝
      </Head>
      <Small at={45.88}>Objeciones · diario de una closer desde cero</Small>
    </Scene>
  </>
);

// ───────── cámara en tarjeta ─────────
const CamCard: React.FC = () => {
  const { t, frame, fps } = useT();
  // pequeño "latido" de la tarjeta al empezar cada escena (sin recortar el video)
  const start = [...SCENES].reverse().find(([a]) => a <= t)?.[0] ?? 0;
  const k = spring({ frame: frame - Math.round(start * fps), fps, config: { damping: 12, mass: 0.5 } });
  const s = start === 0 ? 1 : 0.97 + 0.03 * k;
  return (
    <div
      style={{
        position: "absolute",
        left: CARD_X,
        top: CARD_Y,
        width: CARD_W,
        height: CARD_H,
        borderRadius: 44,
        overflow: "hidden",
        border: `8px solid ${K.ink}`,
        boxShadow: "0 30px 80px rgba(20,20,19,0.25)",
        background: K.ink,
        transform: `scale(${s})`,
      }}
    >
      <OffthreadVideo src={staticFile(VIDEO)} style={{ width: "100%", height: "100%", objectFit: "contain" }} />
    </div>
  );
};

// ───────── subtítulos: 1 a 3 palabras, la clave grande ─────────
const KEYWORDS = new Set(
  [
    "hace", "objeciones", "eso", "objeción", "excusa", "decidir", "casa", "días", "control", "familia", "ahorita",
    "pensarlo", "doy", "aprendí", "pensar", "presionar", "curiosidad", "parte", "gustaría", "duda", "real", "probé",
    "mío", "llamada", "venta", "conversación", "completo", "juntas", "proceso", "invito",
  ].map((w) => w.normalize("NFC")),
);
const norm = (w: string) => w.toLowerCase().replace(/[^\p{L}\p{N}]/gu, "");

const GROUPS = (() => {
  const out: { w: string; s: number; e: number }[][] = [];
  let cur: { w: string; s: number; e: number }[] = [];
  WORDS.forEach((w, i) => {
    cur.push(w);
    const next = WORDS[i + 1];
    if (!next || /[.,;:?!]$/.test(w.w) || next.s - w.e > 0.3 || cur.length >= 3) {
      out.push(cur);
      cur = [];
    }
  });
  return out;
})();

const keyIndex = (g: { w: string }[]) => {
  const k = g.findIndex((w) => KEYWORDS.has(norm(w.w)));
  if (k >= 0) return k;
  let best = 0;
  g.forEach((w, i) => {
    if (norm(w.w).length > norm(g[best].w).length) best = i;
  });
  return best;
};

const Subs: React.FC = () => {
  const { t, frame, fps } = useT();
  const gi = GROUPS.findIndex((g, i) => {
    const next = GROUPS[i + 1];
    return t >= g[0].s && t < Math.min(next ? next[0].s : Infinity, g[g.length - 1].e + 0.4);
  });
  if (gi < 0) return null;
  const g = GROUPS[gi];
  const ki = keyIndex(g);
  const p = spring({ frame: frame - Math.round(g[0].s * fps), fps, config: { damping: 13, mass: 0.4 } });
  return (
    <div style={{ position: "absolute", top: CARD_Y + CARD_H - 330, left: 40, right: 40, display: "flex", justifyContent: "center" }}>
      <div
        style={{
          display: "flex",
          alignItems: "baseline",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: "0 16px",
          maxWidth: 860,
          padding: "18px 36px 24px",
          borderRadius: 30,
          background: K.ink,
          fontFamily: FONT,
          transform: `scale(${0.85 + 0.15 * p})`,
          boxShadow: "0 16px 40px rgba(20,20,19,0.3)",
        }}
      >
        {g.map((w, i) => {
          const key = i === ki;
          const said = t >= w.s;
          return (
            <span
              key={i}
              style={{
                fontSize: key ? 92 : 46,
                fontWeight: key ? 900 : 700,
                color: key ? K.orange : K.paper,
                opacity: said ? 1 : 0.45,
                lineHeight: 1.05,
                textTransform: key ? "uppercase" : "none",
              }}
            >
              {w.w.replace(/[.,;:]$/, "")}
            </span>
          );
        })}
      </div>
    </div>
  );
};

// ───────── fondo ─────────
const Stage: React.FC = () => (
  <AbsoluteFill style={{ background: K.bg }}>
    <style>{FONT_FACES + SERIF_FACE}</style>
    <AbsoluteFill
      style={{
        backgroundImage: `radial-gradient(${K.line} 2.5px, transparent 2.5px)`,
        backgroundSize: "42px 42px",
        opacity: 0.9,
      }}
    />
    <AbsoluteFill style={{ background: `radial-gradient(circle at 50% 18%, ${K.paper}, transparent 60%)` }} />
  </AbsoluteFill>
);

const Progress: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  return (
    <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 10, background: K.line }}>
      <div style={{ height: "100%", width: `${(frame / durationInFrames) * 100}%`, background: K.orange }} />
    </div>
  );
};

// ───────── diseño de sonido ─────────
// whoosh = cada escena nueva · pop = cada dibujo/título · click = cada mensaje de chat
// ding = definición, frase clave y remate · boom = "No presiones" (máx. 1 efecto por segundo)
const SFX: Sfx[] = [
  { at: 0.05, f: "pop", v: 0.6 },
  { at: 1.72, f: "click" },
  { at: 2.84, f: "click" },
  { at: 4.96, f: "whoosh" },
  { at: 6.08, f: "pop" },
  { at: 8.08, f: "whoosh" },
  { at: 9.6, f: "ding", v: 0.5 },
  { at: 10.6, f: "pop" },
  { at: 12.0, f: "whoosh" },
  { at: 13.92, f: "pop" },
  { at: 15.84, f: "whoosh" },
  { at: 17.12, f: "pop" },
  { at: 19.2, f: "click" },
  { at: 20.16, f: "click" },
  { at: 21.44, f: "click" },
  { at: 22.88, f: "whoosh" },
  { at: 25.44, f: "pop" },
  { at: 26.88, f: "boom", v: 0.5 },
  { at: 27.9, f: "whoosh", v: 0.6 },
  { at: 29.6, f: "ding", v: 0.7 },
  { at: 32.72, f: "pop" },
  { at: 33.7, f: "whoosh" },
  { at: 35.32, f: "pop" },
  { at: 36.6, f: "ding", v: 0.4 },
  { at: 37.6, f: "whoosh" },
  { at: 39.32, f: "boom", v: 0.4 },
  { at: 41.32, f: "whoosh" },
  { at: 42.4, f: "pop" },
  { at: 44.44, f: "ding", v: 0.5 },
];

export const Main: React.FC = () => (
  <AbsoluteFill>
    <Stage />
    <Scenes />
    <CamCard />
    <Subs />
    <Progress />
    <Sounds list={SFX} />
  </AbsoluteFill>
);
