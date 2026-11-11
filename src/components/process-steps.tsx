import type { ReactNode } from "react";
import type { Dictionary } from "@/i18n/dictionaries";

type Step = Dictionary["process"]["steps"][number];

// Etapas da seção "Como trabalhamos": bolinhas 01, 02 e 03 ligadas por uma
// linha dourada, cada uma com um quadro com ícone, título e texto. É estático;
// só a borda do quadro fica dourada quando o mouse passa por cima.
export function ProcessSteps({ steps }: { steps: Step[] }) {
  return (
    <ol className="relative mt-12 grid gap-6 md:grid-cols-3 md:gap-5">
      {/* Linha que liga as etapas: na horizontal no computador, na vertical no celular.
          No computador ela vai do centro da bolinha 01 ao da 03. */}
      <span
        aria-hidden
        className="absolute bottom-7 left-[27px] top-7 w-px bg-accent/60 md:bottom-auto md:left-7 md:right-[calc((100%-40px)/3-28px)] md:h-px md:w-auto"
      />

      {steps.map((s, i) => (
        <li key={s.title} className="group relative flex gap-5 md:flex-col md:gap-6">
          <span className="relative z-[1] flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-accent bg-accent font-mono text-sm text-accent-ink shadow-[0_0_24px_rgba(251,193,5,0.35)]">
            {String(i + 1).padStart(2, "0")}
          </span>

          <div className="flex flex-1 flex-col gap-3 rounded-2xl border border-line/60 bg-surface-2 p-6 transition-colors group-hover:border-accent/60">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/15 text-accent">
                {ICONS[i]}
              </span>
              <h3 className="text-xl font-semibold">{s.title}</h3>
            </div>
            <p className="leading-relaxed text-muted">{s.text}</p>
          </div>
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
