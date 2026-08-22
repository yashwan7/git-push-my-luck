"use client";

import { useState } from "react";
import { speech } from "@/lib/speech";

const POINTS = [
  { screenX: 0.5, screenY: 0.5, label: "center" },
  { screenX: 0.08, screenY: 0.1, label: "top left" },
  { screenX: 0.92, screenY: 0.1, label: "top right" },
  { screenX: 0.08, screenY: 0.9, label: "bottom left" },
  { screenX: 0.92, screenY: 0.9, label: "bottom right" },
];

interface Props {
  onRun: (
    points: { screenX: number; screenY: number }[],
    onPoint: (index: number) => Promise<void>
  ) => Promise<boolean>;
  onDone: () => void;
}

export function CalibrationScreen({ onRun, onDone }: Props) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [running, setRunning] = useState(false);

  const begin = async () => {
    setRunning(true);
    speech.speak("Calibration starting. Look steadily at each gold dot as it appears.", { interrupt: true });
    const ok = await onRun(POINTS, async (i) => {
      setActiveIndex(i);
      speech.speak(`Look at the ${POINTS[i].label} dot.`);
      await new Promise((r) => setTimeout(r, 600));
    });
    setActiveIndex(null);
    setRunning(false);
    if (ok) {
      speech.speak("Calibration complete.", { interrupt: true });
      onDone();
    }
  };

  return (
    <div className="fixed inset-0 z-40 flex flex-col items-center justify-center bg-ink">
      {!running && (
        <div className="max-w-md text-center">
          <h2 className="font-display text-3xl text-paper">Let's calibrate your gaze</h2>
          <p className="mt-4 font-ui text-lg text-paper/70">
            Five gold dots will appear one at a time. Sit comfortably, keep your head roughly
            steady, and look at each dot until it disappears. This takes about 10 seconds.
          </p>
          <button
            onClick={begin}
            className="mt-8 rounded-full bg-gold px-8 py-4 font-ui text-xl font-bold text-ink"
          >
            Start calibration
          </button>
        </div>
      )}

      {POINTS.map((p, i) => (
        <div
          key={i}
          className="absolute h-6 w-6 rounded-full bg-gold transition-opacity duration-300"
          style={{
            left: `${p.screenX * 100}%`,
            top: `${p.screenY * 100}%`,
            transform: "translate(-50%, -50%)",
            opacity: activeIndex === i ? 1 : 0,
            boxShadow: activeIndex === i ? "0 0 30px rgba(232,179,77,0.7)" : "none",
          }}
        />
      ))}
    </div>
  );
}
