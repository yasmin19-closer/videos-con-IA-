// "¿Cuánto gana un closer?" (56 s) · estilo de la referencia: tú recortada abajo, titular arriba a la izquierda,
// tarjetas, caja "?", píldoras naranjas y palabras gigantes; fondos crema y oscuro que se alternan.
// En dos tramos se ve el video de la skill Effects: backdrop-word (HUMO) y red-collage ($0).
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
import { Counter, Sfx, Sounds } from "./lib";
import { WORDS } from "./words";

const K = { cream: "#F3EEE4", dark: "#1C1B19", ink: "#141413", orange: "#F08A3C", paper: "#FFFDF8", line: "#E2D8C6" };

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

// ───────── escenas: [inicio, fin, fondo] ─────────
type Bg = "cream" | "dark" | "fx";
const SCENES: [number, number, Bg][] = [
  [0, 2.85, "dark"], // gancho
  [2.85, 5.35, "fx"], // backdrop-word HUMO
  [5.35, 7.1, "cream"], // ¿cuánto gana?
  [7.1, 13.95, "dark"], // la pregunta que más me hacen
  [13.95, 17.8, "cream"], // cifras locas
  [17.8, 23.9, "dark"], // un porcentaje
  [23.9, 26.55, "cream"], // según el negocio
  [26.55, 36.4, "dark"], // el ejemplo
  [36.4, 40.45, "fx"], // red-collage $0
  [40.45, 47.0, "cream"], // practicar / mis ingresos
  [47.0, 49.55, "dark"], // cifras más altas
  [49.55, 53.75, "cream"], // comentarios
  [53.75, 99, "dark"], // sígueme
];
const sceneAt = (t: number) => SCENES.find(([a, b]) => t >= a && t < b) ?? SCENES[SCENES.length - 1];

// ───────── piezas ─────────
const Show: React.FC<{ from: number; to: number; children: React.ReactNode }> = ({ from, to, children }) => {
  const { t } = useT();
  if (t < from || t >= to) return null;
  const out = interpolate(t, [to - 0.12, to], [1, 0], clamp);
  return <AbsoluteFill style={{ opacity: out }}>{children}</AbsoluteFill>;
};

/** Titular arriba a la izquierda: línea 1 en blanco/negro, línea 2 en naranja (como la referencia). */
const Headline: React.FC<{ at: number; a: string; b?: string; bAt?: number; dark: boolean }> = ({ at, a, b, bAt, dark }) => {
  const p1 = usePop(at, 14);
  const p2 = usePop(bAt ?? at + 0.25, 14);
  return (
    <div style={{ position: "absolute", top: 120, left: 60, right: 60, fontFamily: FONT, fontWeight: 900, lineHeight: 1.02 }}>
      <div style={{ fontSize: 78, color: dark ? K.paper : K.ink, opacity: p1, transform: `translateX(${(1 - p1) * -40}px)` }}>{a}</div>
      {b ? (
        <div style={{ fontSize: 78, color: K.orange, opacity: p2, transform: `translateX(${(1 - p2) * -40}px)` }}>{b}</div>
      ) : null}
    </div>
  );
};

/** Tarjeta con dibujo (emoji) y pie de texto. */
const Card: React.FC<{
  at: number;
  x: number;
  y: number;
  w?: number;
  h?: number;
  icon: React.ReactNode;
  label?: React.ReactNode;
  rot?: number;
  dark: boolean;
  question?: boolean;
  strikeAt?: number;
}> = ({ at, x, y, w = 300, h = 300, icon, label, rot = 0, dark, question, strikeAt }) => {
  const { t } = useT();
  const p = usePop(at, 11);
  const s = strikeAt === undefined ? 0 : interpolate(t, [strikeAt, strikeAt + 0.25], [0, 1], clamp);
  const bg = question ? "transparent" : dark ? "#2A2825" : K.paper;
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: w,
        height: h,
        borderRadius: 30,
        background: bg,
        border: question ? `6px solid ${K.orange}` : `4px solid ${dark ? "#3a3733" : K.line}`,
        boxShadow: question ? "none" : "0 18px 40px rgba(0,0,0,0.25)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 10,
        fontFamily: FONT,
        color: dark ? K.paper : K.ink,
        opacity: p,
        transform: `scale(${0.6 + 0.4 * p}) rotate(${rot * p}deg)`,
      }}
    >
      <div style={{ fontSize: question ? 190 : 110, fontWeight: 900, lineHeight: 1, color: question ? K.orange : undefined }}>
        {question ? "?" : icon}
      </div>
      {label ? <div style={{ fontSize: 34, fontWeight: 800, textAlign: "center", padding: "0 14px" }}>{label}</div> : null}
      {s > 0 ? (
        <div style={{ position: "absolute", width: `${s * 110}%`, height: 10, background: "#E5484D", borderRadius: 5, transform: "rotate(-20deg)" }} />
      ) : null}
    </div>
  );
};

/** Píldora naranja inclinada (como "la oportunidad" en la referencia). */
const Pill: React.FC<{ at: number; x: number; y: number; rot?: number; children: React.ReactNode }> = ({ at, x, y, rot = -4, children }) => {
  const p = usePop(at, 10);
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        padding: "12px 28px",
        borderRadius: 999,
        background: K.orange,
        color: K.ink,
        fontFamily: FONT,
        fontWeight: 900,
        fontSize: 40,
        opacity: p,
        transform: `scale(${0.5 + 0.5 * p}) rotate(${rot}deg)`,
        boxShadow: "0 10px 24px rgba(0,0,0,0.2)",
      }}
    >
      {children}
    </div>
  );
};

/** Palabra gigante detrás de ti (se dibuja antes que tu recorte). */
const Giant: React.FC<{ at: number; text: string; dark: boolean; y?: number; size?: number }> = ({ at, text, dark, y = 560, size = 220 }) => {
  const p = usePop(at, 14);
  return (
    <div
      style={{
        position: "absolute",
        top: y,
        left: 0,
        right: 0,
        textAlign: "center",
        fontFamily: FONT,
        fontWeight: 900,
        fontSize: size,
        letterSpacing: -6,
        lineHeight: 1,
        color: dark ? K.orange : K.ink,
        opacity: p,
        transform: `translateY(${(1 - p) * 80}px) scale(${0.9 + 0.1 * p})`,
      }}
    >
      {text}
    </div>
  );
};

// ───────── fondo de cada escena ─────────
const Backdrop: React.FC = () => {
  const { t } = useT();
  const [, , bg] = sceneAt(t);
  if (bg === "fx") return null; // deja ver el video con efectos que está debajo
  const dark = bg === "dark";
  return (
    <AbsoluteFill style={{ background: dark ? K.dark : K.cream }}>
      <AbsoluteFill
        style={{
          backgroundImage: `radial-gradient(${dark ? "#2c2a27" : K.line} 2px, transparent 2px)`,
          backgroundSize: "38px 38px",
          opacity: 0.8,
        }}
      />
    </AbsoluteFill>
  );
};

// ───────── tu recorte (abajo) ─────────
const PERSON_Y = 240; // te baja para dejar arriba el espacio del titular
const Person: React.FC = () => {
  const { t, frame, fps } = useT();
  const [start, , bg] = sceneAt(t);
  if (bg === "fx") return null;
  const k = spring({ frame: frame - Math.round(start * fps), fps, config: { damping: 14, mass: 0.5 } });
  return (
    <AbsoluteFill style={{ transform: `translateY(${PERSON_Y + (1 - k) * 30}px)` }}>
      <OffthreadVideo src={staticFile("persona.webm")} transparent muted style={{ width: "100%", height: "100%" }} />
    </AbsoluteFill>
  );
};

/** Video con los efectos de la skill a pantalla completa, solo en sus tramos. Lleva el audio de todo el video. */
const FxLayer: React.FC = () => {
  const { t } = useT();
  const visible = sceneAt(t)[2] === "fx";
  return (
    <AbsoluteFill style={{ opacity: visible ? 1 : 0 }}>
      <OffthreadVideo src={staticFile("efectos.mp4")} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
    </AbsoluteFill>
  );
};

// ───────── capas por escena ─────────
// Lo que va DETRÁS de ti (palabras gigantes)
const Behind = () => (
  <>
    <Show from={13.95} to={17.8}>
      <Giant at={15.24} text="CIFRAS" dark={false} y={600} />
    </Show>
    <Show from={47.0} to={49.55}>
      <Giant at={48.28} text="MÁS ALTAS" dark size={170} y={640} />
    </Show>
  </>
);

// Lo que va DELANTE (titulares, tarjetas, píldoras)
const Front = () => (
  <>
    {/* 1 · gancho */}
    <Show from={0} to={2.85}>
      <Headline at={0.1} a="Si no tienes claro esto…" b="te venden humo 💨" bAt={2.2} dark />
      <Card at={1.24} x={140} y={380} icon="🤔" label="¿Claridad?" dark rot={-4} />
      <Card at={1.96} x={560} y={370} icon="" question dark rot={3} />
    </Show>

    {/* 3 · ¿cuánto gana? */}
    <Show from={5.35} to={7.1}>
      <Headline at={5.4} a="¿Cuánto gana" b="un closer?" bAt={6.52} dark={false} />
      <Card at={5.96} x={140} y={380} icon="💰" label="Comisión" dark={false} rot={-4} />
      <Card at={6.52} x={560} y={370} icon="" question dark={false} rot={3} />
    </Show>

    {/* 4 · la pregunta que más me hacen */}
    <Show from={7.1} to={13.95}>
      <Headline at={7.16} a="La pregunta que" b="más me han hecho" bAt={7.88} dark />
      <Card at={8.92} x={110} y={390} w={380} h={270} icon="💬💬💬" label="Desde que empecé" dark rot={-3} />
      <Card at={11.56} x={560} y={400} w={380} h={260} icon="🤔" label="¿Vale la pena?" dark rot={3} />
      <Pill at={12.68} x={590} y={640}>
        vale la pena
      </Pill>
    </Show>

    {/* 5 · cifras locas */}
    <Show from={13.95} to={17.8}>
      <Headline at={14.04} a="En internet ves" b="cifras locas 🤑" bAt={15.24} dark={false} />
      <Card at={15.56} x={90} y={380} w={300} h={220} icon="" label={<span style={{ fontSize: 54 }}>$10K/día</span>} dark={false} rot={-6} strikeAt={16.9} />
      <Card at={15.9} x={650} y={360} w={300} h={220} icon="" label={<span style={{ fontSize: 54 }}>$50K/mes</span>} dark={false} rot={5} strikeAt={17.1} />
      <Pill at={16.92} x={330} y={330}>
        ¿de dónde salen?
      </Pill>
    </Show>

    {/* 6 · un porcentaje */}
    <Show from={17.8} to={23.9}>
      <Headline at={17.88} a="El closer gana" b="un porcentaje" bAt={21.28} dark />
      <Card at={21.28} x={140} y={380} w={340} h={320} icon={<span style={{ color: K.orange, fontSize: 200 }}>%</span>} dark rot={-3} />
      <Card at={22.4} x={560} y={400} w={360} h={290} icon="🤝" label="por venta cerrada" dark rot={3} />
    </Show>

    {/* 7 · según el negocio */}
    <Show from={23.9} to={26.55}>
      <Headline at={24.0} a="El porcentaje" b="cambia según el negocio" bAt={25.04} dark={false} />
      <Card at={25.52} x={70} y={440} w={280} h={260} icon="🏋️" label="Fitness" dark={false} rot={-5} />
      <Card at={25.75} x={400} y={420} w={280} h={260} icon="🎓" label="Educación" dark={false} />
      <Card at={26.0} x={730} y={440} w={280} h={260} icon="💼" label="Negocios" dark={false} rot={5} />
    </Show>

    {/* 8 · el ejemplo: $2.000 × 10% = $200 */}
    <Show from={26.55} to={36.4}>
      <Headline at={26.64} a="Por ejemplo" b="¿cuánto ganarías?" bAt={27.6} dark />
      <Card at={29.2} x={70} y={400} w={290} h={260} icon="🎓" label={<span style={{ fontSize: 46 }}>$2.000</span>} dark rot={-4} />
      <Card at={32.24} x={395} y={400} w={290} h={260} icon={<span style={{ color: K.orange }}>×</span>} label={<span style={{ fontSize: 46 }}>10%</span>} dark />
      <Card
        at={33.6}
        x={720}
        y={400}
        w={290}
        h={260}
        icon="💵"
        label={
          <span style={{ fontSize: 54, color: K.orange }}>
            <Counter at={33.6} to={200} prefix="$" dur={0.6} />
          </span>
        }
        dark
        rot={4}
      />
      <Pill at={35.04} x={600} y={680}>
        por venta cerrada
      </Pill>
    </Show>

    {/* 10 · practicar y mis ingresos */}
    <Show from={40.45} to={47.0}>
      <Headline at={40.52} a="Por eso hay que" b="practicar mucho 🎯" bAt={41.56} dark={false} />
      <Card
        at={43.56}
        x={180}
        y={390}
        w={720}
        h={260}
        icon=""
        label={
          <span style={{ fontSize: 46 }}>
            Mis ingresos como closer: <span style={{ color: K.orange, fontSize: 76 }}>$0</span>
          </span>
        }
        dark={false}
      />
      <Pill at={46.04} x={520} y={630}>
        te lo voy a mostrar
      </Pill>
    </Show>

    {/* 11 · cifras más altas */}
    <Show from={47.0} to={49.55}>
      <Headline at={47.08} a="¿Te habían dicho" b="cifras más altas?" bAt={47.96} dark />
    </Show>

    {/* 12 · comentarios */}
    <Show from={49.55} to={53.75}>
      <Headline at={49.64} a="Escríbeme en" b="los comentarios 💬" bAt={50.76} dark={false} />
      <Card at={51.8} x={130} y={400} w={820} h={240} icon="" label={<span style={{ fontSize: 46 }}>"Me dijeron que ganaría…"</span>} dark={false} rot={-2} />
      <Pill at={52.92} x={620} y={620}>
        te leo
      </Pill>
    </Show>

    {/* 13 · sígueme */}
    <Show from={53.75} to={99}>
      <Headline at={53.8} a="Sígueme para" b="más contenido así" bAt={55.08} dark />
      <Pill at={54.04} x={400} y={400} rot={-3}>
        ➕ Seguir
      </Pill>
    </Show>
  </>
);

// ───────── subtítulos estilo referencia: blancos, una palabra clave en naranja ─────────
const KEYWORDS = new Set(
  [
    "claridad", "humo", "atención", "closer", "pregunta", "empecé", "pena", "internet", "cifras", "locas", "salen",
    "aprendiendo", "porcentaje", "venta", "cierra", "negocio", "programa", "2000", "comisión", "10", "200", "cerrada",
    "nadie", "practicar", "ingresos", "mostrar", "altas", "comentarios", "leo", "sígueme", "contenido",
  ],
);
const norm = (w: string) => w.toLowerCase().replace(/[^\p{L}\p{N}]/gu, "");
const GROUPS = (() => {
  const out: { w: string; s: number; e: number }[][] = [];
  let cur: { w: string; s: number; e: number }[] = [];
  WORDS.forEach((w, i) => {
    cur.push(w);
    const next = WORDS[i + 1];
    if (!next || /[.,;:?!]$/.test(w.w) || next.s - w.e > 0.3 || cur.length >= 4) {
      out.push(cur);
      cur = [];
    }
  });
  return out;
})();
const HIDE: [number, number][] = [
  [2.85, 5.35],
  [36.4, 40.45],
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
  const p = spring({ frame: frame - Math.round(g[0].s * fps), fps, config: { damping: 14, mass: 0.4 } });
  return (
    <div
      style={{
        position: "absolute",
        top: 1500,
        left: 50,
        right: 50,
        textAlign: "center",
        fontFamily: FONT,
        fontWeight: 900,
        fontSize: 58,
        lineHeight: 1.1,
        transform: `scale(${0.9 + 0.1 * p})`,
      }}
    >
      {g.map((w, i) => (
        <span
          key={i}
          style={{
            margin: "0 9px",
            color: KEYWORDS.has(norm(w.w)) ? K.orange : "#ffffff",
            opacity: t >= w.s ? 1 : 0.55,
            WebkitTextStroke: "8px rgba(0,0,0,0.85)",
            paintOrder: "stroke fill",
          }}
        >
          {w.w.replace(/[.,;:]$/, "")}
        </span>
      ))}
    </div>
  );
};

// ───────── sonido ─────────
// whoosh = cambio de escena · pop = tarjeta o píldora · ding = número/resultado · click = tachón · boom = efectos de la skill
const SFX: Sfx[] = [
  { at: 0.1, f: "pop" },
  { at: 2.2, f: "pop" },
  { at: 2.85, f: "boom", v: 0.5 },
  { at: 5.35, f: "whoosh" },
  { at: 6.52, f: "pop" },
  { at: 7.1, f: "whoosh" },
  { at: 8.92, f: "pop" },
  { at: 11.56, f: "pop" },
  { at: 12.68, f: "ding", v: 0.4 },
  { at: 13.95, f: "whoosh" },
  { at: 15.56, f: "pop" },
  { at: 16.92, f: "click" },
  { at: 17.8, f: "whoosh" },
  { at: 21.28, f: "pop" },
  { at: 22.4, f: "ding", v: 0.5 },
  { at: 23.9, f: "whoosh" },
  { at: 25.52, f: "pop" },
  { at: 26.55, f: "whoosh" },
  { at: 29.2, f: "pop" },
  { at: 32.24, f: "pop" },
  { at: 33.6, f: "ding", v: 0.7 },
  { at: 35.04, f: "pop" },
  { at: 36.4, f: "boom", v: 0.6 },
  { at: 40.45, f: "whoosh" },
  { at: 43.56, f: "pop" },
  { at: 46.04, f: "pop" },
  { at: 47.0, f: "whoosh" },
  { at: 48.28, f: "boom", v: 0.4 },
  { at: 49.55, f: "whoosh" },
  { at: 51.8, f: "click" },
  { at: 52.92, f: "pop" },
  { at: 53.75, f: "whoosh" },
  { at: 54.04, f: "ding", v: 0.5 },
];

const Progress: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  return (
    <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 10, background: "#00000022" }}>
      <div style={{ height: "100%", width: `${(frame / durationInFrames) * 100}%`, background: K.orange }} />
    </div>
  );
};

export const Main: React.FC = () => (
  <AbsoluteFill>
    <style>{FONT_FACES}</style>
    <FxLayer />
    <Backdrop />
    <Behind />
    <Person />
    <Front />
    <Subs />
    <Progress />
    <Sounds list={SFX} />
  </AbsoluteFill>
);
