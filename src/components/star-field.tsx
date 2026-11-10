"use client";

import { useEffect, useRef } from "react";

// Fundo de estrelas do site, o mesmo da landing page: pontinhos brancos e
// alguns dourados andando devagar para a direita, mais concentrados numa faixa
// diagonal como uma galáxia. Fica parado para quem pediu menos movimento.
export function StarField() {
  const canvas = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const c = canvas.current;
    const ctx = c?.getContext("2d");
    if (!c || !ctx) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let w = 0;
    let h = 0;
    let frame = 0;
    let stars: { x: number; y: number; r: number; a: number; v: number; gold: boolean }[] = [];

    const size = () => {
      w = c.offsetWidth;
      h = c.offsetHeight;
      c.width = w * dpr;
      c.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      stars = Array.from({ length: Math.round((w * h) / 2600) }, () => {
        const x = Math.random() * w;
        const band = h * 0.55 - (x / w) * h * 0.2 + (Math.random() - 0.5) * h * 0.5 * Math.random();
        return {
          x,
          y: Math.random() < 0.6 ? band : Math.random() * h,
          r: Math.random() * 1.2 + 0.2,
          a: Math.random() * 0.6 + 0.15,
          v: Math.random() * 0.15 + 0.03,
          gold: Math.random() < 0.08,
        };
      });
    };

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      for (const s of stars) {
        ctx.fillStyle = s.gold ? `rgba(251,193,5,${s.a})` : `rgba(255,255,255,${s.a * 0.7})`;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, 7);
        ctx.fill();
        if (!reduce) s.x = s.x + s.v > w ? 0 : s.x + s.v;
      }
      if (!reduce) frame = requestAnimationFrame(draw);
    };

    size();
    draw();
    // No celular a barra do navegador some e aparece ao rolar; só a largura
    // muda as estrelas de lugar.
    const onResize = () => {
      if (c.offsetWidth === w) return;
      size();
      if (reduce) draw();
    };
    window.addEventListener("resize", onResize);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <canvas
      ref={canvas}
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 -z-10 h-lvh w-full opacity-85"
    />
  );
}
