// Carrusel "Día 2: Setter vs. Closer" (8 diapositivas).
import React from "react";
import { C } from "../../remotion/src/theme";
import type { Slide } from "./Root";

const Chip: React.FC<{ color?: string; children: React.ReactNode }> = ({ color = C.lime, children }) => (
  <div
    style={{
      alignSelf: "flex-start",
      padding: "12px 28px",
      borderRadius: 999,
      background: `${color}22`,
      border: `3px solid ${color}`,
      color,
      fontWeight: 900,
      fontSize: 34,
      letterSpacing: 2,
      textTransform: "uppercase",
    }}
  >
    {children}
  </div>
);

const Big: React.FC<{ size?: number; children: React.ReactNode }> = ({ size = 92, children }) => (
  <div style={{ fontSize: size, fontWeight: 900, lineHeight: 1.05, letterSpacing: -2 }}>{children}</div>
);

const Text: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div style={{ fontSize: 44, fontWeight: 500, lineHeight: 1.3, color: C.muted }}>{children}</div>
);

const Hl: React.FC<{ color?: string; children: React.ReactNode }> = ({ color = C.lime, children }) => (
  <span style={{ color }}>{children}</span>
);

const Item: React.FC<{ icon: string; color?: string; children: React.ReactNode }> = ({ icon, color = C.violet, children }) => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      gap: 30,
      padding: "28px 34px",
      borderRadius: 32,
      background: C.card,
      border: `2px solid ${C.border}`,
      fontSize: 48,
      fontWeight: 800,
    }}
  >
    <div
      style={{
        width: 100,
        height: 100,
        flexShrink: 0,
        borderRadius: 50,
        background: `${color}26`,
        border: `3px solid ${color}88`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 56,
      }}
    >
      {icon}
    </div>
    {children}
  </div>
);

const Rule: React.FC<{ who: string; what: string; color: string }> = ({ who, what, color }) => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: 26,
      padding: "30px 20px",
      borderRadius: 32,
      background: color,
      color: C.bg,
      fontSize: 64,
      fontWeight: 900,
    }}
  >
    {who} <span style={{ fontSize: 56 }}>→</span> {what}
  </div>
);

const Portada: Slide = () => (
  <>
    <Chip>Día 2</Chip>
    <Big size={104}>
      Descubrí que hay <Hl>2 trabajos</Hl> que casi todos confunden 🤯
    </Big>
    <div style={{ display: "flex", gap: 24, fontSize: 52, fontWeight: 900 }}>
      <span style={{ padding: "14px 34px", borderRadius: 999, background: `${C.violet}33`, border: `3px solid ${C.violet}` }}>SETTER</span>
      <span style={{ alignSelf: "center", color: C.muted }}>vs.</span>
      <span style={{ padding: "14px 34px", borderRadius: 999, background: `${C.lime}22`, border: `3px solid ${C.lime}`, color: C.lime }}>CLOSER</span>
    </div>
  </>
);

const QueHice: Slide = () => (
  <>
    <Chip color={C.violet}>Qué hice hoy</Chip>
    <Big size={80}>
      Estudié videos de <Hl>closers en español</Hl> 📚
    </Big>
    <Item icon="🎥">Alex Dey</Item>
    <Item icon="🎥">Margarita Pasos</Item>
    <Text>Y esto fue lo que más me abrió los ojos 👇</Text>
  </>
);

const Setter: Slide = () => (
  <>
    <Chip color={C.violet}>Trabajo #1</Chip>
    <Big size={120}>📲 El Setter</Big>
    <Item icon="💬">Inicia la conversación</Item>
    <Item icon="📅">Agenda la llamada</Item>
    <Rule who="SETTER" what="AGENDA" color={C.violet} />
  </>
);

const Closer: Slide = () => (
  <>
    <Chip>Trabajo #2</Chip>
    <Big size={120}>
      🤝 El <Hl>Closer</Hl>
    </Big>
    <Item icon="📞" color={C.lime}>
      Toma esa llamada
    </Item>
    <Item icon="🧭" color={C.lime}>
      Acompaña la decisión
    </Item>
    <Rule who="CLOSER" what="CIERRA" color={C.lime} />
  </>
);

const Step: React.FC<{ icon: string; title: string; who: string; color: string }> = ({ icon, title, who, color }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 30 }}>
    <div
      style={{
        width: 130,
        height: 130,
        flexShrink: 0,
        borderRadius: 65,
        background: `${color}26`,
        border: `4px solid ${color}`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 70,
      }}
    >
      {icon}
    </div>
    <div>
      <div style={{ fontSize: 52, fontWeight: 900 }}>{title}</div>
      <div style={{ fontSize: 36, fontWeight: 700, color }}>{who}</div>
    </div>
  </div>
);

const Equipo: Slide = () => (
  <>
    <Chip color={C.violet}>Así trabajan juntos</Chip>
    <Step icon="💬" title="Conversación" who="lo hace el Setter" color={C.violet} />
    <div style={{ fontSize: 60, color: C.muted, marginLeft: 44 }}>↓</div>
    <Step icon="📅" title="Llamada agendada" who="lo hace el Setter" color={C.violet} />
    <div style={{ fontSize: 60, color: C.muted, marginLeft: 44 }}>↓</div>
    <Step icon="🤝" title="Decisión" who="la acompaña el Closer" color={C.lime} />
  </>
);

const Dato: Slide = () => (
  <>
    <Chip>Dato que no sabía</Chip>
    <div style={{ fontSize: 200, lineHeight: 1 }}>🌱</div>
    <Big size={96}>
      Muchos <Hl>empiezan como setter</Hl>
    </Big>
    <Text>Primero aprendes a conversar y agendar… y luego das el salto a cerrar.</Text>
  </>
);

const Pregunta: Slide = () => (
  <>
    <Chip color={C.violet}>Ahora te pregunto a ti</Chip>
    <Big size={100}>
      ¿Tú empezarías como <span style={{ color: C.violet }}>setter</span> o irías directo a <Hl>closer</Hl>?
    </Big>
    <Text>Déjamelo en los comentarios 👇 Escribe SETTER o CLOSER.</Text>
  </>
);

const CTA: Slide = () => (
  <>
    <div style={{ fontSize: 160, lineHeight: 1 }}>🚀</div>
    <Big size={92}>
      Sígueme si quieres <Hl>aprender esta habilidad</Hl> conmigo
    </Big>
    <Text>Estoy empezando desde cero y te cuento todo, día a día.</Text>
    <div
      style={{
        alignSelf: "flex-start",
        display: "flex",
        alignItems: "center",
        gap: 18,
        padding: "26px 54px",
        borderRadius: 999,
        background: C.lime,
        color: C.bg,
        fontSize: 54,
        fontWeight: 900,
        boxShadow: `0 20px 60px ${C.lime}44`,
      }}
    >
      ➕ Seguir
    </div>
    <div style={{ fontSize: 40, fontWeight: 700 }}>Día 3 muy pronto 👀</div>
  </>
);

export const DIA2: Slide[] = [Portada, QueHice, Setter, Closer, Equipo, Dato, Pregunta, CTA];
