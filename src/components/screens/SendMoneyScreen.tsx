"use client";

import { AccessibleTile } from "@/components/AccessibleTile";
import { beneficiaries } from "@/lib/mockBank";

interface Props {
  activeTileId: string | null;
  dwellProgress: number;
  registerTile: (id: string, rect: () => DOMRect | null) => () => void;
}

export function SendMoneyScreen({ activeTileId, dwellProgress, registerTile }: Props) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-8 px-8">
      <h1 className="font-display text-3xl text-paper/90">Send ₹500 to</h1>
      <div className="grid grid-cols-2 gap-8">
        {beneficiaries.map((b) => (
          <AccessibleTile
            key={b.id}
            id={`send-ben-${b.id}`}
            label={b.name}
            sublabel={b.relation}
            icon="◎"
            tone="gold"
            active={activeTileId === `send-ben-${b.id}`}
            dwellProgress={activeTileId === `send-ben-${b.id}` ? dwellProgress : 0}
            registerTile={registerTile}
          />
        ))}
        <AccessibleTile
          id="send-back"
          label="Back"
          icon="←"
          tone="teal"
          active={activeTileId === "send-back"}
          dwellProgress={activeTileId === "send-back" ? dwellProgress : 0}
          registerTile={registerTile}
        />
      </div>
    </div>
  );
}
