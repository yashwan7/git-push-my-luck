"use client";

import { useEffect, useRef } from "react";

interface Props {
  id: string;
  label: string;
  sublabel?: string;
  icon?: React.ReactNode;
  active: boolean;
  dwellProgress: number; // 0-1
  tone?: "gold" | "teal" | "alert";
  registerTile: (id: string, rect: () => DOMRect | null) => () => void;
}

const RADIUS = 42;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

const toneMap = {
  gold: { ring: "#E8B34D", glow: "rgba(232,179,77,0.35)" },
  teal: { ring: "#4DD6B0", glow: "rgba(77,214,176,0.35)" },
  alert: { ring: "#E85D4D", glow: "rgba(232,93,77,0.35)" },
};

export function AccessibleTile({
  id,
  label,
  sublabel,
  icon,
  active,
  dwellProgress,
  tone = "gold",
  registerTile,
}: Props) {
  const ref = useRef<HTMLDivElement | null>(null);
  const colors = toneMap[tone];

  useEffect(() => {
    const unregister = registerTile(id, () => ref.current?.getBoundingClientRect() ?? null);
    return unregister;
  }, [id, registerTile]);

  const offset = CIRCUMFERENCE * (1 - (active ? dwellProgress : 0));

  return (
    <div
      ref={ref}
      role="button"
      aria-label={label}
      className={`relative flex flex-col items-center justify-center gap-3 rounded-3xl border-2 px-6 py-8 transition-colors duration-150 ${
        active ? "border-gold bg-inkRaised" : "border-inkLine bg-inkRaised/40"
      }`}
      style={{
        boxShadow: active ? `0 0 40px ${colors.glow}` : "none",
      }}
    >
      <div className="relative flex h-24 w-24 items-center justify-center">
        <svg width="96" height="96" viewBox="0 0 96 96" className="absolute -rotate-90">
          <circle cx="48" cy="48" r={RADIUS} fill="none" stroke="#262B36" strokeWidth="4" />
          <circle
            cx="48"
            cy="48"
            r={RADIUS}
            fill="none"
            stroke={colors.ring}
            strokeWidth="4"
            strokeLinecap="round"
            strokeDasharray={CIRCUMFERENCE}
            strokeDashoffset={offset}
            style={{ transition: "stroke-dashoffset 60ms linear" }}
          />
        </svg>
        <div className="text-4xl">{icon}</div>
      </div>
      <div className="text-center">
        <div className="font-ui text-2xl font-bold text-paper">{label}</div>
        {sublabel && <div className="font-ui text-base text-paper/60">{sublabel}</div>}
      </div>
    </div>
  );
}
