"use client";

import { useEffect, useState } from "react";

type Left = { d: number; h: number; m: number; s: number };

export default function Countdown({
  target,
  labels,
}: {
  target: number;
  labels: { days: string; hours: string; minutes: string; seconds: string };
}) {
  const [left, setLeft] = useState<Left | null>(null);

  useEffect(() => {
    const tick = () => {
      const diff = Math.max(0, target - Date.now());
      const total = Math.floor(diff / 1000);
      setLeft({
        d: Math.floor(total / 86400),
        h: Math.floor((total % 86400) / 3600),
        m: Math.floor((total % 3600) / 60),
        s: total % 60,
      });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [target]);

  const pad = (n: number) => String(n).padStart(2, "0");
  const items: [string, string][] = [
    [left ? String(left.d) : "--", labels.days],
    [left ? pad(left.h) : "--", labels.hours],
    [left ? pad(left.m) : "--", labels.minutes],
    [left ? pad(left.s) : "--", labels.seconds],
  ];

  return (
    <div className="countdown" role="timer" aria-live="off">
      {items.map(([value, label]) => (
        <div className="cd-box" key={label}>
          <span className="cd-num">{value}</span>
          <span className="cd-label t">{label}</span>
        </div>
      ))}
    </div>
  );
}
