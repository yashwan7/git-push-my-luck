"use client";

import { useEffect, useRef, useState } from "react";
import { useNayanTracker } from "@/hooks/useNayanTracker";
import { CalibrationScreen } from "@/components/CalibrationScreen";
import { GazeCursor } from "@/components/GazeCursor";
import { HomeScreen } from "@/components/screens/HomeScreen";
import { BalanceScreen } from "@/components/screens/BalanceScreen";
import { SendMoneyScreen } from "@/components/screens/SendMoneyScreen";
import { SendResultScreen } from "@/components/screens/SendResultScreen";
import { HistoryScreen } from "@/components/screens/HistoryScreen";
import { EmergencyScreen } from "@/components/screens/EmergencyScreen";
import { DebugHud } from "@/components/DebugHud";
import { simulateTransfer } from "@/lib/mockBank";
import { speech } from "@/lib/speech";

type Screen = "home" | "balance" | "send" | "send-result" | "history" | "emergency";

export default function Page() {
  const tracker = useNayanTracker();
  const [screen, setScreen] = useState<Screen>("home");
  const [sosSignal, setSosSignal] = useState(0);
  const [showDebug, setShowDebug] = useState(true);
  const [sendResult, setSendResult] = useState<{ reference: string; beneficiary: string; amount: number } | null>(
    null
  );
  const lastHandledNonce = useRef(0);

  // Central navigation: reacts once per confirmed dwell+blink event.
  useEffect(() => {
    if (tracker.confirmNonce === lastHandledNonce.current) return;
    lastHandledNonce.current = tracker.confirmNonce;
    const id = tracker.confirmedTileId;
    if (!id) return;

    if (screen === "home") {
      if (id === "home-balance") { setScreen("balance"); speech.speak("Balance", { interrupt: true }); }
      if (id === "home-send") { setScreen("send"); speech.speak("Send money", { interrupt: true }); }
      if (id === "home-history") { setScreen("history"); speech.speak("Transaction history", { interrupt: true }); }
      if (id === "home-emergency") { setScreen("emergency"); speech.speak("Emergency", { interrupt: true }); }
    } else if (screen === "balance") {
      if (id === "balance-back") { setScreen("home"); speech.speak("Home", { interrupt: true }); }
    } else if (screen === "send") {
      if (id === "send-back") { setScreen("home"); speech.speak("Home", { interrupt: true }); }
      if (id.startsWith("send-ben-")) {
        const benId = id.replace("send-ben-", "");
        const result = simulateTransfer(benId, 500);
        setSendResult(result);
        setScreen("send-result");
        speech.speak(`Sent 500 rupees to ${result.beneficiary}`, { interrupt: true });
      }
    } else if (screen === "send-result") {
      if (id === "result-back") { setScreen("home"); speech.speak("Home", { interrupt: true }); }
    } else if (screen === "history") {
      if (id === "history-back") { setScreen("home"); speech.speak("Home", { interrupt: true }); }
    } else if (screen === "emergency") {
      if (id === "emergency-call") setSosSignal((n) => n + 1);
      if (id === "emergency-cancel") { setScreen("home"); speech.speak("Home", { interrupt: true }); }
    }
  }, [tracker.confirmNonce, tracker.confirmedTileId, screen]);

  const screenProps = {
    activeTileId: tracker.activeTileId,
    dwellProgress: tracker.dwellProgress,
    registerTile: tracker.registerTile,
  };

  return (
    <main className="relative min-h-screen bg-ink">
      {/* Live camera preview - small and mirrored, so it's visibly real, not simulated */}
      <video
        ref={tracker.videoRef}
        muted
        playsInline
        className="fixed bottom-4 right-4 z-40 h-32 w-40 -scale-x-100 rounded-xl border border-inkLine object-cover opacity-80"
      />

      {tracker.status === "idle" && (
        <div className="flex min-h-screen flex-col items-center justify-center gap-6 px-8 text-center">
          <h1 className="font-display text-5xl text-gold">Nayan</h1>
          <p className="max-w-md font-ui text-lg text-paper/70">
            Navigate everyday banking with just your eyes. Look at a tile to highlight it, then
            hold a deliberate blink to confirm.
          </p>
          <button
            onClick={tracker.start}
            className="rounded-full bg-gold px-8 py-4 font-ui text-xl font-bold text-ink"
          >
            Start camera
          </button>
        </div>
      )}

      {(tracker.status === "requesting-camera" || tracker.status === "loading-model") && (
        <div className="flex min-h-screen items-center justify-center font-ui text-xl text-paper/70">
          {tracker.status === "requesting-camera" ? "Requesting camera access…" : "Loading tracking model…"}
        </div>
      )}

      {tracker.status === "error" && (
        <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-8 text-center">
          <p className="max-w-md font-ui text-lg text-alert">{tracker.errorMessage}</p>
          <button
            onClick={tracker.start}
            className="rounded-full bg-gold px-6 py-3 font-ui text-lg font-bold text-ink"
          >
            Try again
          </button>
        </div>
      )}

      {tracker.status === "uncalibrated" && (
        <CalibrationScreen onRun={tracker.runCalibration} onDone={() => {}} />
      )}

      {tracker.status === "calibrating" && (
        <CalibrationScreen onRun={tracker.runCalibration} onDone={() => {}} />
      )}

      {tracker.status === "ready" && (
        <>
          <GazeCursor point={tracker.gazePoint} />
          {!tracker.faceDetected && (
            <div className="fixed left-1/2 top-4 z-50 -translate-x-1/2 rounded-full bg-alert/90 px-4 py-2 font-ui text-sm text-ink">
              Face not detected — move into frame
            </div>
          )}
          {screen === "home" && <HomeScreen {...screenProps} />}
          {screen === "balance" && <BalanceScreen {...screenProps} />}
          {screen === "send" && <SendMoneyScreen {...screenProps} />}
          {screen === "send-result" && <SendResultScreen {...screenProps} result={sendResult} />}
          {screen === "history" && <HistoryScreen {...screenProps} />}
          {screen === "emergency" && <EmergencyScreen {...screenProps} triggerSignal={sosSignal} />}

          <div className="fixed left-4 top-4 z-40 flex gap-2">
            <button
              onClick={tracker.recalibrate}
              className="rounded-full border border-inkLine bg-inkRaised/80 px-4 py-2 font-ui text-sm text-paper/60"
            >
              Recalibrate
            </button>
            <button
              onClick={() => setShowDebug((v) => !v)}
              className="rounded-full border border-inkLine bg-inkRaised/80 px-4 py-2 font-ui text-sm text-paper/60"
            >
              {showDebug ? "Hide" : "Show"} debug
            </button>
          </div>

          {showDebug && (
            <DebugHud
              blinkLeft={tracker.debugInfo.blinkLeft}
              blinkRight={tracker.debugInfo.blinkRight}
              dwellTileId={tracker.debugInfo.dwellTileId}
            />
          )}
        </>
      )}
    </main>
  );
}
