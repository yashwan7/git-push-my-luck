"use client";

import { AccessibleTile } from "@/components/AccessibleTile";

interface Props {
  result: { reference: string; beneficiary: string; amount: number } | null;
  activeTileId: string | null;
  dwellProgress: number;
  registerTile: (id: string, rect: () => DOMRect | null) => () => void;
}

export function SendResultScreen({ result, activeTileId, dwellProgress, registerTile }: Props) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-10 px-8">
      <div className="text-center">
        <div className="text-6xl">✓</div>
        <h2 className="mt-4 font-display text-3xl text-teal">Sent ₹{result?.amount} to {result?.beneficiary}</h2>
        <div className="mt-2 font-ui text-base text-paper/50">Reference {result?.reference}</div>
      </div>
      <AccessibleTile
        id="result-back"
        label="Done"
        icon="✓"
        tone="teal"
        active={activeTileId === "result-back"}
        dwellProgress={activeTileId === "result-back" ? dwellProgress : 0}
        registerTile={registerTile}
      />
    </div>
  );
}
