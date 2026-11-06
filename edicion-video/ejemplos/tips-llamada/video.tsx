// "Tips para una llamada de venta" (65 s) · paleta Claude (beis, negro, naranja), sin @.
// El video de cámara ya trae los efectos de la skill Effects: shortcut-rain, red-collage, backdrop-word,
// dot-reveal y fan-build. Aquí: checklist propio (el de la skill quedaba tapado por el cuerpo), textos, subtítulos y sonido.
import React from "react";
import { AbsoluteFill, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { FONT, FONT_FACES } from "./theme";
import { CamKey, Camera, Sfx, Sounds, punch } from "./lib";
import { WORDS } from "./words";

const K = { bg: "#F0EEE6", paper: "#FAF9F5", ink: "#141413", orange: "#D97757", line: "#E3DACC", muted: "#8A8880" };
const SERIF = "Playfair Display";
const SERIF_FACE = `@font-face{font-family:"${SERIF}";src:url("${staticFile("fonts/PlayfairDisplay.ttf")}");font-weight:400 900;}`;

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

// ───────── cámara: pantalla completa (los efectos siguen tu cara) ─────────
const KEYS: CamKey[] = [
  { at: 0, box: punch(1.0) },
  { at: 57.44, box: punch(1.15) }, // "siente que lo entendieron"
  { at: 59.45, box: punch(1.0) }, // fan-build
];

// ───────── piezas de texto (arriba, sobre la pared) ─────────
const Block: React.FC<{ from: number; to: number; top?: number; children: React.ReactNode }> = ({
  from,
  to,
  top = 150,
  children,
}) => {
  const { t } = useT();
  const p = usePop(from, 16);
  if (t < from || t >= to) return null;
  const out = interpolate(t, [to - 0.15, to], [1, 0], clamp);
  return (
    <div
      style={{
        position: "absolute",
        top,
        left: 60,
        right: 60,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 18,
        textAlign: "center",
        fontFamily: FONT,
        color: K.ink,
        opacity: Math.min(p, out),
        transform: `translateY(${(1 - p) * 30}px)`,
      }}
    >
      {children}
    </div>
  );
};

const Head: React.FC<{ at: number; size?: number; children: React.ReactNode }> = ({ at, size = 84, children }) => {
  const p = usePop(at, 14);
  return (
    <div
      style={{
        padding: "16px 34px 22px",
        borderRadius: 30,
        background: `${K.paper}EE`,
        fontFamily: SERIF,
        fontWeight: 800,
        fontSize: size,
        lineHeight: 1.05,
        boxShadow: "0 16px 40px rgba(20,20,19,0.15)",
        opacity: p,
        transform: `scale(${0.85 + 0.15 * p})`,
      }}
    >
      {children}
    </div>
  );
};
const O: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <span style={{ color: K.orange, fontStyle: "italic" }}>{children}</span>
);

const Chip: React.FC<{ at: number; dark?: boolean; strikeAt?: number; children: React.ReactNode }> = ({
  at,
  dark,
  strikeAt,
  children,
}) => {
  const { t } = useT();
  const p = usePop(at, 11);
  const s = strikeAt === undefined ? 0 : interpolate(t, [strikeAt, strikeAt + 0.25], [0, 1], clamp);
  return (
    <div
      style={{
        position: "relative",
        padding: "14px 30px",
        borderRadius: 999,
        background: dark ? K.ink : K.orange,
        color: K.paper,
        fontSize: 44,
        fontWeight: 800,
        opacity: p,
        transform: `scale(${0.6 + 0.4 * p})`,
      }}
    >
      {children}
      {s > 0 ? (
        <div style={{ position: "absolute", left: 20, top: "50%", height: 7, width: `${s * 90}%`, background: K.paper, borderRadius: 4 }} />
      ) : null}
    </div>
  );
};

// ───────── checklist de los 5 pasos (estilo Claude) ─────────
const STEPS = [
  { t: "Conexión", m: "te hace sentir cómodo", start: 26.68, done: 30.12 },
  { t: "Diagnóstico", m: "dónde estás hoy", start: 30.92, done: 34.52 },
  { t: "Meta", m: "dónde quieres estar", start: 35.48, done: 38.4 },
  { t: "Obstáculo", m: "qué te frena", start: 39.08, done: 42.36 },
  { t: "Propuesta", m: "solo si encaja", start: 43.36, done: 50.8 },
];
const CHECK_FROM = 26.3;
const CHECK_TO = 51.5;

const Checklist: React.FC = () => {
  const { t, frame, fps } = useT();
  const p = usePop(CHECK_FROM, 16);
  if (t < CHECK_FROM || t >= CHECK_TO) return null;
  const out = interpolate(t, [CHECK_TO - 0.2, CHECK_TO], [1, 0], clamp);
  const nd = STEPS.filter((s) => t >= s.done).length;
  return (
    <div
      style={{
        position: "absolute",
        top: 110,
        left: 60,
        right: 60,
        borderRadius: 40,
        background: K.ink,
        color: K.paper,
        fontFamily: FONT,
        boxShadow: "0 30px 80px rgba(20,20,19,0.35)",
        opacity: Math.min(p, out),
        transform: `translateY(${(1 - p) * -60}px)`,
        overflow: "hidden",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 18, padding: "26px 36px", borderBottom: "2px solid #2a2a28" }}>
        <span style={{ color: K.orange, fontSize: 44, transform: `rotate(${frame * 2}deg)`, display: "inline-block" }}>✳</span>
        <span style={{ fontSize: 40, fontWeight: 800, flex: 1 }}>Llamada de venta · 5 pasos</span>
        <span style={{ fontSize: 30, fontWeight: 700, color: K.muted }}>
          {nd} de {STEPS.length}
        </span>
      </div>
      {STEPS.map((s, i) => {
        const done = t >= s.done;
        const active = !done && t >= s.start;
        const q = done ? spring({ frame: frame - Math.round(s.done * fps), fps, config: { damping: 9 } }) : 0;
        return (
          <div
            key={i}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 24,
              padding: "16px 36px",
              opacity: done || active ? 1 : 0.4,
              background: active ? "#ffffff0d" : "transparent",
            }}
          >
            <div style={{ position: "relative", width: 52, height: 52, flexShrink: 0 }}>
              {done ? (
                <div
                  style={{
                    width: 52,
                    height: 52,
                    borderRadius: 26,
                    background: K.orange,
                    color: K.ink,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 32,
                    fontWeight: 900,
                    transform: `scale(${0.6 + 0.4 * q})`,
                  }}
                >
                  ✓
                </div>
              ) : (
                <div
                  style={{
                    width: 46,
                    height: 46,
                    margin: 3,
                    borderRadius: 23,
                    border: "5px solid #ffffff22",
                    borderTopColor: active ? K.orange : "#ffffff22",
                    transform: `rotate(${active ? frame * 18 : 0}deg)`,
                    boxSizing: "border-box",
                  }}
                />
              )}
            </div>
            <span style={{ fontSize: 46, fontWeight: 800, flex: 1 }}>
              <span style={{ color: K.orange, marginRight: 14 }}>{i + 1}.</span>
              {s.t}
            </span>
            <span style={{ fontSize: 28, fontWeight: 700, color: done ? K.orange : K.muted }}>{s.m}</span>
          </div>
        );
      })}
    </div>
  );
};

const Scenes = () => (
  <>
    {/* 3.6–12.8: el entrenador personal */}
    <Block from={3.64} to={8.7}>
      <Chip at={4.36} dark>
        💪 Quieres un cambio físico
      </Chip>
      <Head at={7.08}>
        Vas con un <O>entrenador</O> 🏋️‍♀️
      </Head>
    </Block>
    <Block from={8.76} to={12.8}>
      <Head at={9.24}>
        Quieres mejorar tu <O>salud</O>
      </Head>
      <Chip at={11.64} strikeAt={12.04}>
        📄 Rutina genérica
      </Chip>
    </Block>
    <Block from={12.84} to={15.85}>
      <Head at={13.16} size={74}>
        Si te arma una pauta <O>sin preguntarte</O>…
      </Head>
    </Block>

    {/* 26.3–51.5: los 5 pasos */}
    <Checklist />

    {/* 51.6–54: cierre de la llamada */}
    <Block from={51.6} to={53.95}>
      <Chip at={51.6} dark>
        ❓ Resuelve tus dudas
      </Chip>
      <Chip at={52.96}>✅ Tú decides</Chip>
    </Block>

    {/* 54–59.4: el remate */}
    <Block from={54.0} to={59.4}>
      <Head at={55.92} size={70}>
        No siente que le <O>vendieron</O>…
      </Head>
      <Head at={57.44} size={96}>
        siente que lo <O>entendieron</O>
      </Head>
    </Block>

    {/* 59.45–fin: CTA sobre el abanico de pasos */}
    <Block from={60.0} to={99} top={1360}>
      <Chip at={60.0} dark>
        📌 Guárdalo para tu primera llamada
      </Chip>
      <Chip at={62.32}>💬 ¿Qué paso te parece más difícil?</Chip>
    </Block>
  </>
);

// ───────── subtítulos: 1 a 3 palabras, la clave grande en naranja ─────────
const KEYWORDS = new Set(
  [
    "tips", "llamada", "venta", "segundos", "cambio", "físico", "entrenador", "salud", "genérica", "pauta",
    "preguntarte", "confíes", "ventas", "igual", "pasos", "conexión", "cómodo", "diagnóstico", "hoy", "meta",
    "estar", "obstáculo", "frena", "propuesta", "encajan", "ayudar", "dudas", "decides", "bien", "vendieron",
    "entendieron", "difícil",
  ],
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
const HIDE: [number, number][] = [
  [15.9, 19.95], // red-collage
  [23.1, 25.2], // dot-reveal
  [59.45, 99], // cierre
];

const Subs: React.FC = () => {
  const { t, frame, fps } = useT();
  if (HIDE.some(([a, b]) => t >= a && t < b)) return null;
  const gi = GROUPS.findIndex((g, i) => {
    const next = GROUPS[i + 1];
    return t >= g[0].s && t < Math.min(next ? next[0].s : Infinity, g[g.length - 1].e + 0.4);
  });
  if (gi < 0) return null;
  const g = GROUPS[gi];
  const ki = keyIndex(g);
  const p = spring({ frame: frame - Math.round(g[0].s * fps), fps, config: { damping: 13, mass: 0.4 } });
  return (
    <div style={{ position: "absolute", top: 1500, left: 40, right: 40, display: "flex", justifyContent: "center" }}>
      <div
        style={{
          display: "flex",
          alignItems: "baseline",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: "0 16px",
          maxWidth: 940,
          padding: "16px 36px 22px",
          borderRadius: 30,
          background: K.ink,
          fontFamily: FONT,
          transform: `scale(${0.85 + 0.15 * p})`,
          boxShadow: "0 16px 40px rgba(20,20,19,0.3)",
        }}
      >
        {g.map((w, i) => (
          <span
            key={i}
            style={{
              fontSize: i === ki ? 92 : 46,
              fontWeight: i === ki ? 900 : 700,
              color: i === ki ? K.orange : K.paper,
              opacity: t >= w.s ? 1 : 0.45,
              lineHeight: 1.05,
              textTransform: i === ki ? "uppercase" : "none",
            }}
          >
            {w.w.replace(/[.,;:]$/, "")}
          </span>
        ))}
      </div>
    </div>
  );
};

const Progress: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  return (
    <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 10, background: K.line }}>
      <div style={{ height: "100%", width: `${(frame / durationInFrames) * 100}%`, background: K.orange }} />
    </div>
  );
};

// ───────── sonido ─────────
// click = teclas (shortcut-rain) y tachones · whoosh = cada efecto o escena · pop = cada texto
// ding = cada paso completado y frase clave · boom = red-collage y remate (máx. 1 por segundo)
const SFX: Sfx[] = [
  { at: 0.3, f: "click" },
  { at: 1.3, f: "click" },
  { at: 2.3, f: "click" },
  { at: 3.64, f: "whoosh" },
  { at: 4.36, f: "pop" },
  { at: 7.08, f: "pop" },
  { at: 8.76, f: "whoosh", v: 0.5 },
  { at: 9.88, f: "pop" },
  { at: 11.64, f: "pop" },
  { at: 12.84, f: "click" },
  { at: 13.9, f: "pop" },
  { at: 15.9, f: "boom", v: 0.6 },
  { at: 20.55, f: "whoosh" },
  { at: 23.1, f: "whoosh" },
  { at: 25.2, f: "ding", v: 0.5 },
  { at: 26.3, f: "whoosh" },
  { at: 30.12, f: "ding", v: 0.5 },
  { at: 34.52, f: "ding", v: 0.5 },
  { at: 38.4, f: "ding", v: 0.5 },
  { at: 42.36, f: "ding", v: 0.5 },
  { at: 50.8, f: "ding", v: 0.6 },
  { at: 51.6, f: "pop" },
  { at: 52.96, f: "pop" },
  { at: 54.0, f: "whoosh", v: 0.5 },
  { at: 55.92, f: "pop" },
  { at: 57.44, f: "boom", v: 0.5 },
  { at: 59.45, f: "whoosh" },
  { at: 60.5, f: "pop" },
  { at: 62.32, f: "ding", v: 0.5 },
];

export const Main: React.FC = () => (
  <AbsoluteFill style={{ background: K.bg }}>
    <style>{FONT_FACES + SERIF_FACE}</style>
    <Camera keys={KEYS} focusY={45} />
    <Scenes />
    <Subs />
    <Progress />
    <Sounds list={SFX} />
  </AbsoluteFill>
);
