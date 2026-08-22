"use client";

import { AccessibleTile } from "@/components/AccessibleTile";

interface Props {
  activeTileId: string | null;
  dwellProgress: number;
  registerTile: (id: string, rect: () => DOMRect | null) => () => void;
}

export function HomeScreen({ activeTileId, dwellProgress, registerTile }: Props) {
  const tiles = [
    { id: "home-balance", label: "Check Balance", icon: "₹", tone: "gold" as const },
    { id: "home-send", label: "Send Money", icon: "↗", tone: "gold" as const },
    { id: "home-history", label: "Transaction History", icon: "≡", tone: "teal" as const },
    { id: "home-emergency", label: "Emergency SOS", icon: "!", tone: "alert" as const },
  ];

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-8 px-8">
      <h1 className="font-display text-3xl text-paper/90">What would you like to do?</h1>
      <div className="grid grid-cols-2 gap-8">
        {tiles.map((t) => (
          <AccessibleTile
            key={t.id}
            id={t.id}
            label={t.label}
            icon={t.icon}
            tone={t.tone}
            active={activeTileId === t.id}
            dwellProgress={activeTileId === t.id ? dwellProgress : 0}
            registerTile={registerTile}
          />
        ))}
      </div>
    </div>
  );
}
