import type { ReactNode } from "react";
import type { Dictionary } from "@/i18n/dictionaries";

type Step = Dictionary["process"]["steps"][number];

// Etapas da seção "Como trabalhamos": um quadro por etapa, com ícone, título
// e texto. É estático; só a borda fica dourada quando o mouse passa por cima.
export function ProcessSteps({ steps }: { steps: Step[] }) {
  return (
    <ol className="mt-10 grid gap-5 md:grid-cols-3">
      {steps.map((s, i) => (
        <li
          key={s.title}
          className="flex flex-col gap-3 rounded-2xl border border-line/60 bg-surface-2 p-6 transition-colors hover:border-accent/60"
        >
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/15 text-accent">
              {ICONS[i]}
            </span>
            <h3 className="text-xl font-semibold">{s.title}</h3>
          </div>
          <p className="leading-relaxed text-muted">{s.text}</p>
        </li>
      ))}
    </ol>
  );
}

const icon = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  className: "h-5 w-5",
  "aria-hidden": true,
};

// Conversa, proposta e entrega.
const ICONS: ReactNode[] = [
  <svg key="chat" {...icon}>
    <path d="M21 12a8 8 0 0 1-11.8 7L4 20l1.1-4.4A8 8 0 1 1 21 12Z" />
    <path d="M8.5 11h.01M12 11h.01M15.5 11h.01" />
  </svg>,
  <svg key="doc" {...icon}>
    <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8Z" />
    <path d="M14 3v5h5M9 13h6M9 17h4" />
  </svg>,
  <svg key="rocket" {...icon}>
    <path d="M5 15c-1.5 1.3-2 4-2 6 2 0 4.7-.5 6-2" />
    <path d="M9 18l-3-3a14 14 0 0 1 9-11.5A3 3 0 0 1 20.5 9 14 14 0 0 1 9 18Z" />
    <circle cx="15" cy="9" r="1.5" />
  </svg>,
];
