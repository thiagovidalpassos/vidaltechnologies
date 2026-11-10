"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import type { Dictionary } from "@/i18n/dictionaries";

type Service = Dictionary["services"]["items"][number];

// Tempo que cada serviço fica aberto antes de abrir o próximo sozinho.
const INTERVAL = 6000;

// Cartões numerados da seção Serviços, iguais aos da landing page: um fica
// aberto em dourado e os outros fechados ao lado. A troca automática só começa
// quando a seção aparece na tela, sempre a partir do 01, e para quando ela sai.
// Clicar num cartão abre ele na hora e a contagem recomeça dali. Quem pediu
// menos movimento no sistema troca só clicando.
export function ServiceCards({ items }: { items: Service[] }) {
  const row = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(0);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = row.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { threshold: 0.4 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!visible || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = setTimeout(() => setOpen((o) => (o + 1) % items.length), INTERVAL);
    return () => clearTimeout(timer);
  }, [open, visible, items.length]);

  return (
    <div ref={row} className="flex flex-col gap-1.5 md:h-[400px] md:flex-row">
      {items.map((s, i) => {
        const isOpen = i === open;
        return (
          <article
            key={s.title}
            onClick={() => setOpen(i)}
            className={`group relative cursor-pointer overflow-hidden rounded-md border transition-all duration-500 ease-[cubic-bezier(.6,.1,.2,1)] ${
              isOpen
                ? "h-[400px] border-accent bg-accent text-accent-ink sm:h-[340px] md:h-auto md:flex-1"
                : "h-[58px] border-[#242424] bg-[#1c1c1c] hover:bg-[#222] md:h-auto md:flex-[0_0_96px]"
            }`}
          >
            <button
              type="button"
              aria-expanded={isOpen}
              className={`flex w-full items-baseline gap-1.5 px-4 pt-4 text-left text-[22px] tracking-tight md:pb-2.5 md:text-[26px] ${
                isOpen ? "md:border-b md:border-black/20" : "md:border-b md:border-[#333]"
              }`}
            >
              <svg
                viewBox="0 0 24 24"
                aria-hidden
                className={`h-4 w-4 shrink-0 transition-transform duration-500 ${isOpen ? "-rotate-[135deg]" : ""}`}
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 4v16M6 14l6 6 6-6" />
              </svg>
              {String(i + 1).padStart(2, "0")}
              <span className={`ml-auto text-xs md:hidden ${isOpen ? "opacity-0" : "text-subtle"}`}>{s.title}</span>
            </button>

            {/* Fechado no computador: o nome do serviço na vertical, embaixo. */}
            <span
              aria-hidden
              className={`absolute bottom-4 left-1/2 hidden -translate-x-1/2 rotate-180 whitespace-nowrap text-sm text-subtle transition-opacity duration-300 [writing-mode:vertical-rl] md:block ${
                isOpen ? "opacity-0" : "opacity-100 delay-300"
              }`}
            >
              {s.title}
            </span>

            <div
              className={`grid gap-6 px-4 pb-5 pt-5 transition-all duration-300 lg:grid-cols-[minmax(0,1fr)_220px] xl:grid-cols-[minmax(0,1fr)_260px] lg:gap-8 lg:px-6 ${
                isOpen ? "translate-y-0 opacity-100 delay-300" : "pointer-events-none translate-y-2 opacity-0"
              } md:w-[400px] lg:w-[540px] xl:w-[670px]`}
            >
              <div>
                <h3 className="text-2xl font-semibold tracking-tight">{s.title}</h3>
                <p className="mt-2 leading-relaxed text-black/75">{s.text}</p>
                <ul className="mt-5 grid gap-2 text-sm">
                  {s.examples.map((example) => (
                    <li key={example} className="flex gap-2">
                      <span aria-hidden>↗</span>
                      {example}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="hidden aspect-[2/1] overflow-hidden rounded-md bg-[#0d0d0d] lg:block">{ART[i]}</div>
            </div>
          </article>
        );
      })}
    </div>
  );
}

function V({ x, y, width, height, color }: { x: number; y: number; width: number; height: number; color: string }) {
  return (
    <svg x={x} y={y} width={width} height={height} viewBox="0 0 318 221">
      <path d="M0 0H86L184 165L138 221Z" fill={color} />
      <path d="M231 0H318L200 145L167 89Z" fill={color} />
    </svg>
  );
}

// Ilustrações dos cartões abertos, as mesmas da landing page.
const ART: ReactNode[] = [
  <svg key="sites" viewBox="0 0 280 140" width="100%" height="100%" aria-hidden>
    <rect width="280" height="140" fill="#0d0d0d" />
    <rect x="24" y="18" width="232" height="122" rx="8" fill="#1b1b1b" stroke="#333" />
    <circle cx="38" cy="30" r="3" fill="#fbc105" />
    <circle cx="48" cy="30" r="3" fill="#444" />
    <circle cx="58" cy="30" r="3" fill="#444" />
    <rect x="40" y="52" width="110" height="10" rx="3" fill="#fff" />
    <rect x="40" y="68" width="80" height="10" rx="3" fill="#fbc105" />
    <rect x="40" y="90" width="120" height="5" rx="2" fill="#555" />
    <rect x="40" y="100" width="96" height="5" rx="2" fill="#555" />
    <rect x="40" y="115" width="46" height="14" rx="7" fill="#fbc105" />
    <rect x="172" y="50" width="68" height="78" rx="6" fill="#262626" />
    <V x={186} y={72} width={40} height={28} color="#fbc105" />
  </svg>,
  <svg key="apps" viewBox="0 0 280 140" width="100%" height="100%" aria-hidden>
    <rect width="280" height="140" fill="#0d0d0d" />
    <rect x="20" y="16" width="60" height="112" rx="6" fill="#1b1b1b" />
    <rect x="30" y="30" width="40" height="6" rx="3" fill="#fbc105" />
    <rect x="30" y="46" width="34" height="5" rx="2" fill="#444" />
    <rect x="30" y="58" width="38" height="5" rx="2" fill="#444" />
    <rect x="30" y="70" width="30" height="5" rx="2" fill="#444" />
    <rect x="90" y="16" width="170" height="50" rx="6" fill="#1b1b1b" />
    <polyline points="100,54 130,40 158,48 186,28 214,36 248,22" fill="none" stroke="#fbc105" strokeWidth="2.5" />
    <rect x="90" y="74" width="80" height="54" rx="6" fill="#1b1b1b" />
    <rect x="180" y="74" width="80" height="54" rx="6" fill="#fbc105" />
    <rect x="100" y="98" width="40" height="10" rx="3" fill="#fff" />
    <rect x="190" y="98" width="40" height="10" rx="3" fill="#000" />
  </svg>,
  <svg key="automation" viewBox="0 0 280 140" width="100%" height="100%" aria-hidden>
    <rect width="280" height="140" fill="#0d0d0d" />
    <g fill="none" stroke="#fbc105" strokeWidth="2">
      <path d="M72 70H110" />
      <path d="M162 70C180 70 180 38 200 38" />
      <path d="M162 70C180 70 180 102 200 102" />
    </g>
    <rect x="20" y="50" width="52" height="40" rx="8" fill="#1b1b1b" stroke="#333" />
    <rect x="110" y="44" width="52" height="52" rx="10" fill="#fbc105" />
    <V x={122} y={60} width={28} height={20} color="#000" />
    <rect x="200" y="20" width="52" height="36" rx="8" fill="#1b1b1b" stroke="#333" />
    <rect x="200" y="84" width="52" height="36" rx="8" fill="#1b1b1b" stroke="#333" />
    <circle cx="46" cy="70" r="6" fill="#fbc105" />
    <rect x="214" y="35" width="24" height="5" rx="2" fill="#666" />
    <rect x="214" y="99" width="24" height="5" rx="2" fill="#666" />
  </svg>,
  <svg key="agents" viewBox="0 0 280 140" width="100%" height="100%" aria-hidden>
    <rect width="280" height="140" fill="#0d0d0d" />
    <rect x="24" y="22" width="150" height="30" rx="15" fill="#1f1f1f" />
    <rect x="38" y="34" width="100" height="6" rx="3" fill="#777" />
    <rect x="104" y="62" width="152" height="30" rx="15" fill="#fbc105" />
    <rect x="120" y="74" width="110" height="6" rx="3" fill="#000" />
    <rect x="24" y="102" width="120" height="26" rx="13" fill="#1f1f1f" />
    <circle cx="44" cy="115" r="3" fill="#fbc105" />
    <circle cx="56" cy="115" r="3" fill="#fbc105" opacity=".6" />
    <circle cx="68" cy="115" r="3" fill="#fbc105" opacity=".3" />
  </svg>,
];
