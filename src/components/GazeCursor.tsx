"use client";

export function GazeCursor({ point }: { point: { x: number; y: number } | null }) {
  if (!point) return null;
  const left = point.x * (typeof window !== "undefined" ? window.innerWidth : 0);
  const top = point.y * (typeof window !== "undefined" ? window.innerHeight : 0);

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed z-50 h-6 w-6 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-gold bg-gold/30 transition-transform"
      style={{ left, top }}
    />
  );
}
