"use client";

import { AccessibleTile } from "@/components/AccessibleTile";
import { transactions } from "@/lib/mockBank";

interface Props {
  activeTileId: string | null;
  dwellProgress: number;
  registerTile: (id: string, rect: () => DOMRect | null) => () => void;
}

export function HistoryScreen({ activeTileId, dwellProgress, registerTile }: Props) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-8 px-8">
      <h1 className="font-display text-3xl text-paper/90">Recent activity</h1>
      <div className="w-full max-w-xl space-y-3">
        {transactions.map((t) => (
          <div
            key={t.id}
            className="flex items-center justify-between rounded-2xl border border-inkLine bg-inkRaised/40 px-6 py-4"
          >
            <div>
              <div className="font-ui text-lg text-paper">{t.label}</div>
              <div className="font-ui text-sm text-paper/40">{t.date}</div>
            </div>
            <div className={`font-ui text-xl font-bold ${t.amount > 0 ? "text-teal" : "text-paper/80"}`}>
              {t.amount > 0 ? "+" : ""}
              {t.amount}
            </div>
          </div>
        ))}
      </div>
      <AccessibleTile
        id="history-back"
        label="Back"
        icon="←"
        tone="teal"
        active={activeTileId === "history-back"}
        dwellProgress={activeTileId === "history-back" ? dwellProgress : 0}
        registerTile={registerTile}
      />
    </div>
  );
}
