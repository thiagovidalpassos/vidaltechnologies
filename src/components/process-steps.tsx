"use client";

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import type { Dictionary } from "@/i18n/dictionaries";

type Step = Dictionary["process"]["steps"][number];

// Tempo que cada etapa fica em destaque antes de passar para a próxima.
const INTERVAL = 4500;

// Linha do tempo da seção "Como trabalhamos". Quando a seção aparece na tela,
// a linha dourada vai se enchendo e acende uma etapa de cada vez (01, 02, 03),
// em loop. Passar o mouse ou clicar numa etapa leva o destaque para ela.
// Quem pediu menos movimento no sistema vê as três etapas acesas, sem animação.
export function ProcessSteps({ steps }: { steps: Step[] }) {
  const root = useRef<HTMLOListElement>(null);
  const [active, setActive] = useState(-1);
  const [visible, setVisible] = useState(false);
  const [paused, setPaused] = useState(false);
  const [still, setStill] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setStill(true);
      return;
    }
    const el = root.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        // Toda vez que a seção volta para a tela, recomeça na etapa 01.
        if (entry.isIntersecting) setActive(0);
        else setActive(-1);
        setVisible(entry.isIntersecting);
      },
      { threshold: 0.35 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!visible || paused || still) return;
    const timer = setTimeout(() => setActive((a) => (a + 1) % steps.length), INTERVAL);
    return () => clearTimeout(timer);
  }, [active, visible, paused, still, steps.length]);

  // Até onde a linha dourada vai: até a bolinha da etapa ativa. No computador
  // cada coluna tem 1/3 da largura mais o espaço entre elas (20px); a bolinha
  // tem 56px, então o centro fica 28px depois do início da coluna.
  const n = steps.length;
  const at = still ? n - 1 : active;
  const fillStyle = {
    "--fill-x": at < 0 ? "0px" : `calc(${at} * (100% + 20px) / ${n} + 28px)`,
    "--fill-y": at < 0 ? "0%" : `${(at / (n - 1)) * 100}%`,
  } as CSSProperties;

  return (
    <ol
      ref={root}
      onMouseLeave={() => setPaused(false)}
      className="relative mt-12 grid gap-6 md:grid-cols-3 md:gap-5"
    >
      {/* Trilho da linha do tempo: na horizontal no computador, na vertical no celular. */}
      <span
        aria-hidden
        style={fillStyle}
        className="absolute bottom-7 left-[27px] top-7 w-px bg-line md:inset-x-0 md:bottom-auto md:h-px md:w-auto"
      >
        <span className="absolute left-0 top-0 h-[var(--fill-y)] w-px bg-accent shadow-[0_0_12px_#fbc105] transition-all duration-1000 ease-out md:h-px md:w-[var(--fill-x)]" />
      </span>

      {steps.map((s, i) => {
        const on = still || i === active;
        const done = still || (active >= 0 && i <= active);
        return (
          <li
            key={s.title}
            onMouseEnter={() => {
              setPaused(true);
              setActive(i);
            }}
            onClick={() => setActive(i)}
            className="relative flex gap-5 md:flex-col md:gap-6"
          >
            <span
              className={`relative z-[1] flex h-14 w-14 shrink-0 items-center justify-center rounded-full border font-mono text-sm transition-all duration-500 ${
                done
                  ? "border-accent bg-accent text-accent-ink shadow-[0_0_24px_rgba(251,193,5,0.45)]"
                  : "border-line bg-background text-subtle"
              } ${on && !still ? "scale-110" : ""}`}
            >
              {String(i + 1).padStart(2, "0")}
            </span>

            <div
              className={`flex flex-1 cursor-default flex-col gap-3 rounded-2xl border p-6 transition-all duration-500 ${
                on
                  ? "border-accent/70 bg-surface-2 md:-translate-y-1"
                  : "border-line/60 bg-surface-2/40"
              }`}
            >
              <div className="flex items-center gap-3">
                <span
                  className={`flex h-10 w-10 items-center justify-center rounded-lg transition-colors duration-500 ${
                    on ? "bg-accent/15 text-accent" : "bg-line/40 text-muted"
                  }`}
                >
                  {ICONS[i]}
                </span>
                <h3 className="text-xl font-semibold">{s.title}</h3>
              </div>
              <p className={`leading-relaxed transition-colors duration-500 ${on ? "text-foreground/85" : "text-muted"}`}>
                {s.text}
              </p>
              {/* Barrinha que enche enquanto a etapa está em destaque. */}
              <span aria-hidden className="mt-auto block h-0.5 overflow-hidden rounded-full bg-line/60">
                <span
                  key={on && !still && !paused ? `run-${active}` : "idle"}
                  className={`block h-full bg-accent ${
                    still || (on && paused) ? "w-full" : on ? "animate-[process-bar_4.5s_linear_forwards]" : "w-0"
                  }`}
                />
              </span>
            </div>
          </li>
        );
      })}
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
