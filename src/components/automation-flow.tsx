import type { ReactNode } from "react";
import type { Dictionary } from "@/i18n/dictionaries";
import { LogoMark } from "@/components/logo";
import { WhatsAppIcon } from "@/components/whatsapp-icon";

// Fluxo de qualificação de leads no estilo n8n, o mesmo da apresentação:
// o lead passa pela IA e, se qualificado, recebe resposta no WhatsApp e
// segue em paralelo para Gmail e Google Calendar; senão, vai para o CRM e
// ganha um follow-up.
// Em loop, cada etapa acende na sua vez, pontos percorrem as ligações e as
// etapas concluídas ganham um check verde. A animação é SVG puro (SMIL).


const CYCLE = "7s";
// Cores fixas: a animação SMIL não entende variáveis CSS.
const LINE = "#3d3d3d";
const ACCENT = "#fbc105";
const MUTED = "#8a8a8a";

// Trecho do ciclo (0 a 1) em que cada etapa roda.
const timing = {
  trigger: { start: 0, end: 0.06 },
  ai: { start: 0.14, end: 0.26 },
  check: { start: 0.34, end: 0.4 },
  whatsapp: { start: 0.48, end: 0.54 },
  gmail: { start: 0.62, end: 0.68 },
  calendar: { start: 0.62, end: 0.68 },
  crm: { start: 0.48, end: 0.54 },
  followup: { start: 0.62, end: 0.68 },
};

type StepKey = keyof typeof timing;

const links: { from: StepKey; to: StepKey; start: number; end: number; nurture?: boolean }[] = [
  { from: "trigger", to: "ai", start: 0.06, end: 0.14 },
  { from: "ai", to: "check", start: 0.26, end: 0.34 },
  { from: "check", to: "whatsapp", start: 0.4, end: 0.48 },
  { from: "whatsapp", to: "gmail", start: 0.54, end: 0.62 },
  { from: "whatsapp", to: "calendar", start: 0.54, end: 0.62 },
  { from: "check", to: "crm", start: 0.4, end: 0.48, nurture: true },
  { from: "crm", to: "followup", start: 0.54, end: 0.62, nurture: true },
];

type Point = { x: number; y: number };
type Layout = {
  width: number;
  height: number;
  node: number;
  // "h": o fluxo corre da esquerda para a direita; "v": de cima para baixo.
  direction: "h" | "v";
  title: number;
  text: number;
  nodes: Record<StepKey, Point>;
  yes: Point;
  no: Point;
};

// No computador o fluxo corre na horizontal, ao lado do título.
const wide: Layout = {
  width: 660,
  height: 345,
  node: 56,
  direction: "h",
  title: 11.5,
  text: 10.5,
  nodes: {
    trigger: { x: 20, y: 130 },
    ai: { x: 155, y: 130 },
    check: { x: 290, y: 130 },
    whatsapp: { x: 425, y: 70 },
    gmail: { x: 560, y: 14 },
    calendar: { x: 560, y: 130 },
    crm: { x: 425, y: 250 },
    followup: { x: 560, y: 250 },
  },
  yes: { x: 380, y: 106 },
  no: { x: 360, y: 290 },
};

// No celular ele desce na vertical e se divide em duas colunas.
const tall: Layout = {
  width: 360,
  height: 800,
  node: 60,
  direction: "v",
  title: 14,
  text: 11.5,
  nodes: {
    trigger: { x: 150, y: 8 },
    ai: { x: 150, y: 138 },
    check: { x: 150, y: 268 },
    whatsapp: { x: 60, y: 430 },
    gmail: { x: 40, y: 560 },
    calendar: { x: 140, y: 690 },
    crm: { x: 240, y: 430 },
    followup: { x: 240, y: 560 },
  },
  yes: { x: 72, y: 395 },
  no: { x: 312, y: 395 },
};

const linkPath = (layout: Layout, from: Point, to: Point) => {
  const n = layout.node;
  if (layout.direction === "h") {
    const [x1, y1, x2, y2] = [from.x + n, from.y + n / 2, to.x, to.y + n / 2];
    const mid = (x1 + x2) / 2;
    return `M${x1} ${y1} C${mid} ${y1} ${mid} ${y2} ${x2} ${y2}`;
  }
  // Na vertical a ligação sai de baixo da caixa e entra por cima da próxima,
  // passando por baixo do texto da etapa.
  const [x1, y1, x2, y2] = [from.x + n / 2, from.y + n, to.x + n / 2, to.y];
  const mid = (y1 + y2) / 2;
  return `M${x1} ${y1} C${x1} ${mid} ${x2} ${mid} ${x2} ${y2}`;
};

// Largura aproximada do texto de uma etapa, para o fundo atrás dele.
const labelWidth = (layout: Layout, key: StepKey, t: Dictionary["flow"]) =>
  Math.max(
    t.nodes[key].title.length * layout.title * 0.6,
    t.nodes[key].text.length * layout.text * 0.52,
  ) + 10;

// Valores animados que só mudam dentro de [start, end] do ciclo.
const during = (start: number, end: number, off: string, on: string) => ({
  values: `${off};${off};${on};${on};${off};${off}`,
  keyTimes: `0;${start};${start + 0.01};${end};${end + 0.01};1`,
});

const after = (end: number) => ({
  values: "0;0;1;1;0",
  keyTimes: `0;${end};${end + 0.01};0.97;1`,
});


const stroke = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

// Ícone de cada etapa, desenhado numa caixa de 24x24 (ou 48x48 nos logos).
const icons: Record<StepKey, { viewBox: string; size: number; body: ReactNode }> = {
  trigger: {
    viewBox: "0 0 24 24",
    size: 30,
    // Uma pessoa com um "+": um contato novo chegando.
    body: (
      <>
        <circle cx="9" cy="7" r="4" {...stroke} />
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M19 8v6M22 11h-6" {...stroke} />
      </>
    ),
  },
  ai: { viewBox: "0 0 318 221", size: 40, body: null },
  check: {
    viewBox: "0 0 24 24",
    size: 30,
    body: <path d="M4 12h6l4-6h6M10 12l4 6h6" {...stroke} />,
  },
  whatsapp: { viewBox: "0 0 24 24", size: 36, body: null },
  // Como no n8n, nós de apps mostram o logo do próprio app.
  gmail: {
    viewBox: "0 0 48 48",
    size: 38,
    body: (
      <>
        <path fill="#4caf50" d="M45 16.2l-5 2.75-5 4.75V40h7c1.657 0 3-1.343 3-3V16.2z" />
        <path fill="#1e88e5" d="M3 16.2l3.614 1.71L13 23.7V40H6c-1.657 0-3-1.343-3-3V16.2z" />
        <path fill="#e53935" d="M35 11.2 24 19.45 13 11.2 12 17l1 6.7 11 8.25 11-8.25 1-6.7z" />
        <path
          fill="#c62828"
          d="M3 12.298V16.2l10 7.5V11.2L9.876 8.859A4.3 4.3 0 0 0 7.298 8C4.924 8 3 9.924 3 12.298z"
        />
        <path
          fill="#fbc02d"
          d="M45 12.298V16.2l-10 7.5V11.2l3.124-2.341A4.3 4.3 0 0 1 40.702 8C43.076 8 45 9.924 45 12.298z"
        />
      </>
    ),
  },
  calendar: {
    viewBox: "0 0 48 48",
    size: 40,
    body: (
      <>
        <rect x="6" y="6" width="36" height="36" rx="5" fill="#fff" />
        <path fill="#4285f4" d="M11 6h26v8H6v-3a5 5 0 0 1 5-5Z" />
        <path fill="#34a853" d="M6 34h26v8H11a5 5 0 0 1-5-5Z" />
        <path fill="#fbbc04" d="M34 14h8v20h-8Z" />
        <path fill="#ea4335" d="M34 34h8l-8 8Z" />
        <text
          x="22"
          y="31"
          textAnchor="middle"
          fontWeight="800"
          fontSize="14"
          fill="#1a73e8"
          className="font-sans"
        >
          31
        </text>
      </>
    ),
  },
  // O CRM é uma tabela no Supabase, então o nó mostra o logo dele.
  crm: {
    viewBox: "0 0 109 113",
    size: 32,
    body: (
      <>
        <path
          fill="#249361"
          d="M63.708 110.284c-2.86 3.601-8.658 1.628-8.727-2.97l-1.007-67.251h45.22c8.19 0 12.758 9.46 7.665 15.874l-43.151 54.347Z"
        />
        <path
          fill="#3ecf8e"
          d="M45.317 2.071c2.86-3.601 8.657-1.628 8.726 2.97l.442 67.251H9.831c-8.19 0-12.759-9.46-7.665-15.875L45.317 2.071Z"
        />
      </>
    ),
  },
  followup: {
    viewBox: "0 0 24 24",
    size: 30,
    body: (
      <>
        <circle cx="12" cy="13" r="8" {...stroke} />
        <path d="M12 9v4l3 2M9 2h6" {...stroke} />
      </>
    ),
  },
};

function NodeIcon({ name, x, y, size }: { name: StepKey; x: number; y: number; size: number }) {
  if (name === "ai") {
    // A IA do fluxo é a da Vidal Technologies: o V da marca.
    return <LogoMark x={x} y={y} width={size} height={size} className="text-accent" />;
  }
  if (name === "whatsapp") {
    return <WhatsAppIcon x={x} y={y} width={size} height={size} className="fill-[#25D366]" />;
  }
  const icon = icons[name];
  return (
    <svg x={x} y={y} width={size} height={size} viewBox={icon.viewBox} className="text-foreground">
      {icon.body}
    </svg>
  );
}

// Versão em lista para telas estreitas, onde o diagrama ficaria pequeno demais.

function FlowDiagram({
  t,
  layout,
  label,
  className,
}: {
  t: Dictionary["flow"];
  layout: Layout;
  label: string;
  className: string;
}) {
  const { width, height, node: n } = layout;
  const grid = `flow-grid-${layout.direction}`;
  return (
    <svg viewBox={`0 0 ${width} ${height}`} role="img" aria-label={label} className={className}>
      <defs>
        <pattern id={grid} width="18" height="18" patternUnits="userSpaceOnUse">
          <circle cx="1" cy="1" r="1" fill="var(--line)" opacity="0.5" />
        </pattern>
      </defs>
      <rect width={width} height={height} fill={`url(#${grid})`} />

      {links.map((link) => {
        const d = linkPath(layout, layout.nodes[link.from], layout.nodes[link.to]);
        const on = link.nurture ? MUTED : ACCENT;
        return (
          <g key={`${link.from}-${link.to}`}>
            <path d={d} fill="none" stroke={LINE} strokeWidth="2">
              <animate
                attributeName="stroke"
                dur={CYCLE}
                repeatCount="indefinite"
                {...during(link.start, link.end, LINE, on)}
              />
            </path>
            <circle r="4.5" fill={on} opacity="0">
              <animateMotion
                path={d}
                dur={CYCLE}
                repeatCount="indefinite"
                calcMode="linear"
                keyPoints="0;0;1;1"
                keyTimes={`0;${link.start};${link.end};1`}
              />
              <animate
                attributeName="opacity"
                dur={CYCLE}
                repeatCount="indefinite"
                {...during(link.start, link.end, "0", "1")}
              />
            </circle>
          </g>
        );
      })}

      <text
        x={layout.yes.x}
        y={layout.yes.y}
        textAnchor="middle"
        fill="#3ddc84"
        fontSize="13"
        className="font-mono"
      >
        {t.branches.yes}
      </text>
      <text
        x={layout.no.x}
        y={layout.no.y}
        textAnchor="middle"
        fill={MUTED}
        fontSize="13"
        className="font-mono"
      >
        {t.branches.no}
      </text>

      {(Object.keys(timing) as StepKey[]).map((key) => {
        const { x, y } = layout.nodes[key];
        const { start, end } = timing[key];
        const size = (icons[key].size * n) / 76;
        return (
          <g key={key}>
            <rect
              x={x}
              y={y}
              width={n}
              height={n}
              // No n8n o nó de gatilho é mais arredondado que os outros.
              rx={key === "trigger" ? n / 3 : n / 6}
              fill="var(--surface-2)"
              stroke={key === "ai" ? ACCENT : LINE}
              strokeWidth="2"
            >
              <animate
                attributeName="stroke"
                dur={CYCLE}
                repeatCount="indefinite"
                {...during(start, end, key === "ai" ? ACCENT : LINE, ACCENT)}
              />
            </rect>
            <NodeIcon name={key} x={x + (n - size) / 2} y={y + (n - size) / 2} size={size} />
            <g opacity="0">
              <circle cx={x + n - 3} cy={y + 3} r="9" fill="#3ddc84" />
              <path
                d={`M${x + n - 7.5} ${y + 3}l3 3 5.5-6`}
                fill="none"
                stroke="#000"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <animate attributeName="opacity" dur={CYCLE} repeatCount="indefinite" {...after(end)} />
            </g>
            {layout.direction === "v" && (
              // Na vertical as ligações passam por baixo dos textos; o fundo
              // atrás do texto mantém a leitura limpa.
              <rect
                x={x + n / 2 - labelWidth(layout, key, t) / 2}
                y={y + n + 4}
                width={labelWidth(layout, key, t)}
                height={layout.title + layout.text + 12}
                rx="4"
                fill="var(--surface)"
              />
            )}
            <text
              x={x + n / 2}
              y={y + n + layout.title + 6}
              textAnchor="middle"
              fill="var(--foreground)"
              fontSize={layout.title}
              fontWeight="700"
            >
              {t.nodes[key].title}
            </text>
            <text
              x={x + n / 2}
              y={y + n + layout.title + layout.text + 10}
              textAnchor="middle"
              fill="var(--muted)"
              fontSize={layout.text}
            >
              {t.nodes[key].text}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

export function AutomationFlow({ t }: { t: Dictionary["flow"] }) {
  const label = [
    t.nodes.trigger.title,
    t.nodes.ai.title,
    t.nodes.check.title,
    `${t.branches.yes}: ${[t.nodes.whatsapp, t.nodes.gmail, t.nodes.calendar].map((n) => n.title).join(", ")}`,
    `${t.branches.no}: ${[t.nodes.crm, t.nodes.followup].map((n) => n.title).join(", ")}`,
  ].join(" → ");

  return (
    <div className="rounded-2xl border border-line bg-surface p-5">
      <div className="mb-3 flex items-center justify-between font-mono text-xs">
        <div className="flex items-center gap-3">
          <div className="flex gap-1.5" aria-hidden>
            <span className="h-2.5 w-2.5 rounded-full bg-line" />
            <span className="h-2.5 w-2.5 rounded-full bg-line" />
            <span className="h-2.5 w-2.5 rounded-full bg-accent" />
          </div>
          <span className="text-subtle">{t.name}</span>
        </div>
        <span className="flex items-center gap-2 text-[#3ddc84]">
          <span className="h-2 w-2 animate-pulse rounded-full bg-[#3ddc84]" />
          {t.status}
        </span>
      </div>

      <FlowDiagram t={t} layout={tall} label={label} className="mx-auto w-full max-w-sm md:hidden" />
      <FlowDiagram t={t} layout={wide} label={label} className="hidden w-full md:block" />

      <p className="mt-2 font-mono text-xs text-subtle">{t.footer}</p>
    </div>
  );
}
