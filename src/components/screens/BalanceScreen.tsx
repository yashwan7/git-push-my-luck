"use client";

import { AccessibleTile } from "@/components/AccessibleTile";
import { account } from "@/lib/mockBank";

interface Props {
  activeTileId: string | null;
  dwellProgress: number;
  registerTile: (id: string, rect: () => DOMRect | null) => () => void;
}

export function BalanceScreen({ activeTileId, dwellProgress, registerTile }: Props) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-10 px-8">
      <div className="text-center">
        <div className="font-ui text-xl text-paper/60">{account.holder} · {account.accountNumberMasked}</div>
        <div className="mt-4 font-display text-6xl font-bold text-gold">
          ₹{account.balance.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
        </div>
        <div className="mt-2 font-ui text-base text-paper/40">Available balance</div>
      </div>
      <AccessibleTile
        id="balance-back"
        label="Back"
        icon="←"
        tone="teal"
        active={activeTileId === "balance-back"}
        dwellProgress={activeTileId === "balance-back" ? dwellProgress : 0}
        registerTile={registerTile}
      />
    </div>
  );
}
