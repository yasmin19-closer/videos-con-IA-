// Piezas reutilizables para video.tsx. Todos los tiempos van en segundos del video ya cortado.
import React from "react";
import {
  AbsoluteFill,
  Audio,
  Easing,
  interpolate,
  OffthreadVideo,
  Sequence,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { BRAND, C, FONT, FONT_FACES, H, W } from "./theme";
import { VIDEO, WORDS } from "./words";

// ───────────────────────── tiempo ─────────────────────────

const useT = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return { t: frame / fps, frame, fps };
};

// 0→1 con rebote suave desde el segundo `at`
const usePop = (at: number, damping = 14) => {
  const { frame, fps } = useT();
  return spring({ frame: frame - Math.round(at * fps), fps, config: { damping, mass: 0.6 } });
};

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

// ───────────────────────── cámara ─────────────────────────

export type Box = { x: number; y: number; w: number; h: number; r: number; z: number; sub: number | null };
export type CamKey = { at: number; box: Box };

const FULL = { x: 0, y: 0, w: W, h: H, r: 0 };

/** Pantalla completa con zoom. Dos punch() seguidos = corte seco (punch-in). */
export const punch = (z = 1): Box => ({ ...FULL, z, sub: 1290 });
/** Cámara pequeña abajo a la derecha; el contenido va en CARD_AREA. */
export const PIP: Box = { x: 600, y: 1290, w: 420, h: 560, r: 40, z: 1, sub: 1040 };
/** Cámara en la mitad de arriba; el contenido va en SPLIT_CARD. */
export const SPLIT: Box = { x: 0, y: 0, w: W, h: 960, r: 0, z: 1, sub: 800 };
/** Cámara redonda pequeña para el cierre (EndTitle). Sin subtítulos. */
export const END: Box = { x: 390, y: 380, w: 300, h: 300, r: 150, z: 1.3, sub: null };

export const CARD_AREA: React.CSSProperties = { left: 60, top: 220, width: W - 120 };
export const SPLIT_CARD: React.CSSProperties = { left: 60, top: 1010, width: W - 120 };

const sameFrame = (a: Box, b: Box) => a.x === b.x && a.y === b.y && a.w === b.w && a.h === b.h && a.r === b.r;

/** Encuadre activo en el segundo t (con la animación entre cajas ya aplicada). */
const useBox = (keys: CamKey[]): Box => {
  const { t, frame, fps } = useT();
  let i = 0;
  for (let k = 0; k < keys.length; k++) if (keys[k].at <= t) i = k;
  const cur = keys[i].box;
  const prev = i > 0 ? keys[i - 1].box : cur;
  if (sameFrame(prev, cur)) return cur;
  const p = spring({ frame: frame - Math.round(keys[i].at * fps), fps, config: { damping: 20, mass: 0.7 } });
  const mix = (a: number, b: number) => a + (b - a) * p;
  return {
    x: mix(prev.x, cur.x),
    y: mix(prev.y, cur.y),
    w: mix(prev.w, cur.w),
    h: mix(prev.h, cur.h),
    r: mix(prev.r, cur.r),
    z: mix(prev.z, cur.z),
    sub: cur.sub === null || prev.sub === null ? cur.sub : mix(prev.sub, cur.sub),
  };
};

export const Camera: React.FC<{ keys: CamKey[] }> = ({ keys }) => {
  const b = useBox(keys);
  const full = b.w >= W - 1 && b.h >= H - 1;
  return (
    <div
      style={{
        position: "absolute",
        left: b.x,
        top: b.y,
        width: b.w,
        height: b.h,
        borderRadius: b.r,
        overflow: "hidden",
        boxShadow: full ? "none" : "0 30px 80px rgba(0,0,0,0.55)",
        outline: full ? "none" : `3px solid ${C.border}`,
      }}
    >
      <OffthreadVideo
        src={staticFile(VIDEO)}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          objectPosition: "50% 30%",
          transform: `scale(${b.z})`,
          transformOrigin: "50% 35%",
        }}
      />
    </div>
  );
};

// ───────────────────────── fondo y marca ─────────────────────────

export const Background: React.FC = () => {
  const { t } = useT();
  return (
    <AbsoluteFill style={{ background: C.bg, fontFamily: FONT }}>
      <style>{FONT_FACES}</style>
      <AbsoluteFill
        style={{
          background: `radial-gradient(circle at ${30 + Math.sin(t / 3) * 10}% 20%, ${C.violet}55, transparent 45%),
            radial-gradient(circle at ${70 + Math.cos(t / 4) * 10}% 85%, ${C.lime}22, transparent 40%)`,
        }}
      />
      <AbsoluteFill
        style={{
          backgroundImage: `linear-gradient(${C.border} 1px, transparent 1px), linear-gradient(90deg, ${C.border} 1px, transparent 1px)`,
          backgroundSize: "90px 90px",
          opacity: 0.35,
        }}
      />
    </AbsoluteFill>
  );
};

export const Brand: React.FC = () => (
  <div
    style={{
      position: "absolute",
      top: 70,
      width: "100%",
      textAlign: "center",
      fontFamily: FONT,
      fontWeight: 700,
      fontSize: 30,
      letterSpacing: 2,
      color: C.white,
      opacity: 0.8,
      textShadow: "0 2px 12px rgba(0,0,0,0.7)",
    }}
  >
    {BRAND}
  </div>
);

// ───────────────────────── tarjetas ─────────────────────────

/** Panel visible entre `from` y `to`. Posición con style (CARD_AREA, SPLIT_CARD...). */
export const Card: React.FC<{ from: number; to: number; style?: React.CSSProperties; children: React.ReactNode }> = ({
  from,
  to,
  style,
  children,
}) => {
  const { t } = useT();
  const inP = usePop(from, 18);
  if (t < from || t > to) return null;
  const out = interpolate(t, [to - 0.2, to], [1, 0], clamp);
  return (
    <div
      style={{
        position: "absolute",
        boxSizing: "border-box",
        padding: 50,
        display: "flex",
        flexDirection: "column",
        gap: 28,
        background: C.card,
        border: `2px solid ${C.border}`,
        borderRadius: 40,
        fontFamily: FONT,
        color: C.white,
        boxShadow: "0 30px 90px rgba(0,0,0,0.5)",
        opacity: Math.min(inP, out),
        transform: `translateY(${(1 - inP) * 60}px) scale(${0.96 + inP * 0.04})`,
        ...style,
      }}
    >
      {children}
    </div>
  );
};

export const Chip: React.FC<{ color?: string; children: React.ReactNode }> = ({ color = C.lime, children }) => (
  <div
    style={{
      alignSelf: "flex-start",
      padding: "10px 24px",
      borderRadius: 999,
      background: `${color}22`,
      border: `2px solid ${color}`,
      color,
      fontWeight: 700,
      fontSize: 30,
      textTransform: "uppercase",
      letterSpacing: 1.5,
    }}
  >
    {children}
  </div>
);

export const Title: React.FC<{ size?: number; children: React.ReactNode }> = ({ size = 62, children }) => (
  <div style={{ fontWeight: 900, fontSize: size, lineHeight: 1.08, letterSpacing: -1 }}>{children}</div>
);

/** Fila de lista que aparece en `at`. icon: "x" (rojo) o "check" (lima). strikeAt tacha el texto. */
export const Row: React.FC<{ at: number; icon?: "x" | "check"; strikeAt?: number; children: React.ReactNode }> = ({
  at,
  icon = "check",
  strikeAt,
  children,
}) => {
  const p = usePop(at);
  const { t } = useT();
  const strike = strikeAt === undefined ? 0 : interpolate(t, [strikeAt, strikeAt + 0.3], [0, 1], clamp);
  const color = icon === "x" ? C.red : C.lime;
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 22,
        fontSize: 40,
        fontWeight: 700,
        opacity: p,
        transform: `translateX(${(1 - p) * -40}px)`,
      }}
    >
      <div
        style={{
          width: 54,
          height: 54,
          flexShrink: 0,
          borderRadius: 27,
          background: `${color}26`,
          color,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 32,
        }}
      >
        {icon === "x" ? "✕" : "✓"}
      </div>
      <div style={{ position: "relative", opacity: 1 - strike * 0.45 }}>
        {children}
        <div
          style={{
            position: "absolute",
            left: 0,
            top: "52%",
            height: 5,
            width: `${strike * 100}%`,
            background: C.red,
            borderRadius: 3,
          }}
        />
      </div>
    </div>
  );
};

/** Número que cuenta desde 0 hasta `to`. */
export const Counter: React.FC<{ at: number; to: number; dur?: number; prefix?: string; suffix?: string }> = ({
  at,
  to,
  dur = 0.8,
  prefix = "",
  suffix = "",
}) => {
  const { t } = useT();
  const v = interpolate(t, [at, at + dur], [0, to], { ...clamp, easing: Easing.out(Easing.cubic) });
  return (
    <>
      {prefix}
      {Math.round(v).toLocaleString("es")}
      {suffix}
    </>
  );
};

/** Caja con un dato grande y su etiqueta. */
export const Stat: React.FC<{ at: number; accent?: string; label: string; big: React.ReactNode }> = ({
  at,
  accent = C.lime,
  label,
  big,
}) => {
  const p = usePop(at, 12);
  return (
    <div
      style={{
        flex: 1,
        padding: "30px 20px",
        borderRadius: 28,
        background: `${accent}14`,
        border: `2px solid ${accent}55`,
        textAlign: "center",
        opacity: p,
        transform: `scale(${0.7 + p * 0.3})`,
      }}
    >
      <div style={{ fontSize: 72, fontWeight: 900, color: accent, lineHeight: 1 }}>{big}</div>
      <div style={{ fontSize: 26, fontWeight: 500, color: C.muted, marginTop: 12 }}>{label}</div>
    </div>
  );
};

/** Barra que aparece en showAt y se llena de `at` a `at+dur`. */
export const ProgressBar: React.FC<{ at: number; dur?: number; showAt?: number; left: string; right: string }> = ({
  at,
  dur = 1,
  showAt = at,
  left,
  right,
}) => {
  const { t } = useT();
  const show = usePop(showAt);
  const fill = interpolate(t, [at, at + dur], [0, 1], { ...clamp, easing: Easing.inOut(Easing.cubic) });
  return (
    <div style={{ opacity: show }}>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 28, fontWeight: 700, marginBottom: 14 }}>
        <span style={{ color: C.muted }}>{left}</span>
        <span style={{ color: fill > 0.98 ? C.lime : C.muted }}>{right}</span>
      </div>
      <div style={{ height: 22, borderRadius: 11, background: "rgba(255,255,255,0.1)", overflow: "hidden" }}>
        <div
          style={{
            height: "100%",
            width: `${fill * 100}%`,
            borderRadius: 11,
            background: `linear-gradient(90deg, ${C.violet}, ${C.lime})`,
          }}
        />
      </div>
    </div>
  );
};

/** Paso numerado de un flujo (usar con Arrow entre pasos). */
export const Node: React.FC<{ at: number; n: string; label: string; accent?: string }> = ({
  at,
  n,
  label,
  accent = C.violet,
}) => {
  const p = usePop(at, 12);
  return (
    <div style={{ textAlign: "center", opacity: p, transform: `scale(${0.6 + p * 0.4})` }}>
      <div
        style={{
          width: 130,
          height: 130,
          margin: "0 auto",
          borderRadius: 65,
          border: `4px solid ${accent}`,
          background: `${accent}22`,
          color: accent,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 50,
          fontWeight: 900,
        }}
      >
        {n}
      </div>
      <div style={{ fontSize: 30, fontWeight: 700, marginTop: 16 }}>{label}</div>
    </div>
  );
};

export const Arrow: React.FC<{ at: number }> = ({ at }) => {
  const p = usePop(at);
  return (
    <div
      style={{
        fontSize: 56,
        fontWeight: 900,
        color: C.muted,
        marginBottom: 50,
        opacity: p,
        transform: `translateX(${(1 - p) * -20}px)`,
      }}
    >
      →
    </div>
  );
};

// ───────────────────────── etiquetas sobre la cámara ─────────────────────────

/** Etiqueta arriba de la pantalla (para cuando la cámara ocupa todo). */
export const LowerThird: React.FC<{ from: number; to: number; tag: string; text: string }> = ({
  from,
  to,
  tag,
  text,
}) => {
  const { t } = useT();
  const p = usePop(from, 16);
  if (t < from || t > to) return null;
  const out = interpolate(t, [to - 0.2, to], [1, 0], clamp);
  return (
    <div
      style={{
        position: "absolute",
        top: 150,
        left: 60,
        display: "flex",
        alignItems: "center",
        gap: 18,
        padding: "16px 30px 16px 16px",
        borderRadius: 999,
        background: C.card,
        border: `2px solid ${C.border}`,
        fontFamily: FONT,
        opacity: Math.min(p, out),
        transform: `translateX(${(1 - p) * -80}px)`,
      }}
    >
      <span
        style={{
          padding: "8px 20px",
          borderRadius: 999,
          background: C.lime,
          color: C.bg,
          fontWeight: 900,
          fontSize: 26,
          textTransform: "uppercase",
        }}
      >
        {tag}
      </span>
      <span style={{ color: C.white, fontWeight: 700, fontSize: 34 }}>{text}</span>
    </div>
  );
};

/** Barra de recorrido "de A a B" arriba de la pantalla. */
export const JourneyBar: React.FC<{
  from: number;
  to: number;
  fillAt: number;
  fillDur?: number;
  left: string;
  right: string;
}> = ({ from, to, fillAt, fillDur = 2, left, right }) => {
  const { t } = useT();
  const p = usePop(from, 16);
  if (t < from || t > to) return null;
  const out = interpolate(t, [to - 0.2, to], [1, 0], clamp);
  return (
    <div
      style={{
        position: "absolute",
        top: 270,
        left: 60,
        right: 60,
        padding: 30,
        borderRadius: 30,
        background: C.card,
        border: `2px solid ${C.border}`,
        fontFamily: FONT,
        color: C.white,
        opacity: Math.min(p, out),
        transform: `translateY(${(1 - p) * -40}px)`,
      }}
    >
      <ProgressBar at={fillAt} dur={fillDur} showAt={from} left={left} right={right} />
    </div>
  );
};

// ───────────────────────── frase destacada y cierre ─────────────────────────

const norm = (w: string) => w.toLowerCase().replace(/[^\p{L}\p{N}]/gu, "");

/** Frase grande palabra por palabra. lines = [[palabra, segundo], ...] por línea. `mark` va en lima. */
export const Quote: React.FC<{ from: number; to: number; mark?: string; lines: [string, number][][] }> = ({
  from,
  to,
  mark,
  lines,
}) => {
  const { t, frame, fps } = useT();
  if (t < from || t > to) return null;
  const out = interpolate(t, [to - 0.2, to], [1, 0], clamp);
  return (
    <AbsoluteFill style={{ background: "rgba(0,0,0,0.55)", opacity: out }}>
      <div
        style={{
          position: "absolute",
          top: 1150,
          left: 60,
          right: 60,
          textAlign: "center",
          fontFamily: FONT,
          fontWeight: 900,
          fontSize: 92,
          lineHeight: 1.1,
          color: C.white,
          textShadow: "0 6px 30px rgba(0,0,0,0.8)",
        }}
      >
        {lines.map((line, li) => (
          <div key={li}>
            {line.map(([w, at], wi) => {
              const p = spring({ frame: frame - Math.round(at * fps), fps, config: { damping: 12, mass: 0.5 } });
              const isMark = mark !== undefined && norm(w) === norm(mark);
              return (
                <span
                  key={wi}
                  style={{
                    display: "inline-block",
                    margin: "0 12px",
                    opacity: p,
                    transform: `translateY(${(1 - p) * 30}px) scale(${0.8 + p * 0.2})`,
                    color: isMark ? C.lime : C.white,
                  }}
                >
                  {w}
                </span>
              );
            })}
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
};

export const EndTitle: React.FC<{ from: number; chip?: string; title: string }> = ({ from, chip, title }) => {
  const { t } = useT();
  const p = usePop(from + 0.15, 16);
  if (t < from) return null;
  return (
    <div
      style={{
        position: "absolute",
        top: 760,
        left: 60,
        right: 60,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 30,
        fontFamily: FONT,
        color: C.white,
        textAlign: "center",
        opacity: p,
        transform: `translateY(${(1 - p) * 40}px)`,
      }}
    >
      {chip ? (
        <div style={{ alignSelf: "center" }}>
          <Chip>{chip}</Chip>
        </div>
      ) : null}
      <Title size={84}>{title}</Title>
    </div>
  );
};

// ───────────────────────── subtítulos ─────────────────────────

type Word = { w: string; s: number; e: number };

// Agrupa palabras en frases cortas: corta por puntuación, pausas o largo máximo
const groups = (() => {
  const out: Word[][] = [];
  let cur: Word[] = [];
  WORDS.forEach((w, i) => {
    cur.push(w);
    const next = WORDS[i + 1];
    const chars = cur.map((x) => x.w).join(" ").length;
    const end = !next || /[.,;:?!]$/.test(w.w) || next.s - w.e > 0.35 || cur.length >= 3 || chars > 16;
    if (end) {
      out.push(cur);
      cur = [];
    }
  });
  return out;
})();

export const Subtitles: React.FC<{ keys: CamKey[]; keywords?: string[]; hide?: [number, number][] }> = ({
  keys,
  keywords = [],
  hide = [],
}) => {
  const { t, frame, fps } = useT();
  const box = useBox(keys);
  if (box.sub === null || hide.some(([a, b]) => t >= a && t < b)) return null;
  const gi = groups.findIndex((g, i) => {
    const next = groups[i + 1];
    return t >= g[0].s && t < Math.min(next ? next[0].s : Infinity, g[g.length - 1].e + 0.5);
  });
  if (gi < 0) return null;
  const g = groups[gi];
  const kw = new Set(keywords.map(norm));
  const enter = spring({ frame: frame - Math.round(g[0].s * fps), fps, config: { damping: 14, mass: 0.4 } });
  return (
    <div
      style={{
        position: "absolute",
        top: box.sub,
        left: 50,
        right: 50,
        textAlign: "center",
        fontFamily: FONT,
        fontWeight: 900,
        fontSize: 76,
        lineHeight: 1.1,
        textTransform: "uppercase",
        transform: `scale(${0.85 + enter * 0.15})`,
      }}
    >
      {g.map((w, i) => {
        const active = t >= w.s;
        const isKw = kw.has(norm(w.w));
        return (
          <span
            key={i}
            style={{
              display: "inline-block",
              margin: "0 10px",
              color: isKw ? C.lime : C.white,
              opacity: active ? 1 : 0.45,
              WebkitTextStroke: "10px rgba(0,0,0,0.85)",
              paintOrder: "stroke fill",
              textShadow: "0 8px 24px rgba(0,0,0,0.6)",
            }}
          >
            {w.w.replace(/[.,;:]$/, "")}
          </span>
        );
      })}
    </div>
  );
};

// ───────────────────────── efectos de sonido ─────────────────────────

export type Sfx = { at: number; f: "whoosh" | "pop" | "ding" | "click" | "boom"; v?: number };

export const Sounds: React.FC<{ list: Sfx[] }> = ({ list }) => {
  const { fps } = useVideoConfig();
  return (
    <>
      {list.map((s, i) => (
        <Sequence key={i} from={Math.round(s.at * fps)} durationInFrames={Math.round(2 * fps)} layout="none">
          <Audio src={staticFile(`sfx/${s.f}.wav`)} volume={s.v ?? 0.8} />
        </Sequence>
      ))}
    </>
  );
};
