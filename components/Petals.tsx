"use client";

import { useEffect, useState, type CSSProperties } from "react";

type Petal = {
  id: number;
  left: number;
  w: number;
  h: number;
  dur: number;
  delay: number;
  sway: number;
  tone: number;
};

export default function Petals({ active }: { active: boolean }) {
  const [petals, setPetals] = useState<Petal[]>([]);

  useEffect(() => {
    if (!active) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const n = window.innerWidth < 640 ? 14 : 22;
    setPetals(
      Array.from({ length: n }, (_, id) => {
        const w = 9 + Math.random() * 11;
        return {
          id,
          left: Math.random() * 100,
          w,
          h: w * 1.35,
          dur: 13 + Math.random() * 13,
          delay: -Math.random() * 24,
          sway: 28 + Math.random() * 70,
          tone: Math.floor(Math.random() * 3),
        };
      }),
    );
  }, [active]);

  if (!petals.length) return null;

  return (
    <div className="petals" aria-hidden="true">
      {petals.map((p) => (
        <span
          key={p.id}
          className={`petal tone${p.tone}`}
          style={
            {
              left: `${p.left}%`,
              width: p.w,
              height: p.h,
              animationDuration: `${p.dur}s`,
              animationDelay: `${p.delay}s`,
              "--sway": `${p.sway}px`,
            } as CSSProperties
          }
        />
      ))}
    </div>
  );
}
