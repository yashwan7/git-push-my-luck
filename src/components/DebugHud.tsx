"use client";

interface Props {
  blinkLeft: number;
  blinkRight: number;
  dwellTileId: string | null;
}

function Bar({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex items-center gap-2">
      <div className="w-10 font-ui text-xs text-paper/60">{label}</div>
      <div className="h-2 w-32 overflow-hidden rounded-full bg-inkLine">
        <div
          className="h-full rounded-full bg-gold transition-[width] duration-75"
          style={{ width: `${Math.min(100, value * 100)}%` }}
        />
      </div>
      <div className="w-10 font-ui text-xs text-paper/60">{value.toFixed(2)}</div>
    </div>
  );
}

export function DebugHud({ blinkLeft, blinkRight, dwellTileId }: Props) {
  return (
    <div className="fixed bottom-4 left-4 z-40 space-y-2 rounded-xl border border-inkLine bg-inkRaised/90 px-4 py-3">
      <Bar label="L eye" value={blinkLeft} />
      <Bar label="R eye" value={blinkRight} />
      <div className="font-ui text-xs text-paper/60">Dwell: {dwellTileId ?? "—"}</div>
      <div className="font-ui text-[10px] text-paper/30">Confirm fires past 0.55, held 400ms</div>
    </div>
  );
}
