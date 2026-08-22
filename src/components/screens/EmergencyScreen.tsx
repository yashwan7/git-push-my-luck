"use client";

import { useEffect, useState } from "react";
import { AccessibleTile } from "@/components/AccessibleTile";
import { speech } from "@/lib/speech";

interface Props {
  activeTileId: string | null;
  dwellProgress: number;
  registerTile: (id: string, rect: () => DOMRect | null) => () => void;
  /** Increments each time the "Send SOS" tile is confirmed via dwell + blink. */
  triggerSignal: number;
}

type AlertState = "idle" | "locating" | "sent" | "denied";

export function EmergencyScreen({ activeTileId, dwellProgress, registerTile, triggerSignal }: Props) {
  const [alertState, setAlertState] = useState<AlertState>("idle");
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);

  useEffect(() => {
    if (triggerSignal > 0) triggerAlert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [triggerSignal]);

  const triggerAlert = () => {
    setAlertState("locating");
    speech.speak("Getting your location to alert your caregiver.", { interrupt: true });
    if (!("geolocation" in navigator)) {
      setAlertState("denied");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setAlertState("sent");
        speech.speak("Alert sent to your caregiver with your current location.", { interrupt: true });
      },
      () => {
        setAlertState("denied");
        speech.speak("Location permission was denied. Please enable location access to send your position.", {
          interrupt: true,
        });
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-10 px-8">
      {alertState === "idle" && (
        <>
          <h1 className="max-w-md text-center font-display text-3xl text-paper/90">
            Look and blink to alert your caregiver
          </h1>
          <AccessibleTile
            id="emergency-call"
            label="Send SOS"
            icon="!"
            tone="alert"
            active={activeTileId === "emergency-call"}
            dwellProgress={activeTileId === "emergency-call" ? dwellProgress : 0}
            registerTile={registerTile}
          />
        </>
      )}

      {alertState === "locating" && (
        <div className="text-center font-ui text-xl text-paper/70">Getting your location…</div>
      )}

      {alertState === "sent" && (
        <div className="text-center">
          <div className="text-6xl">✓</div>
          <h2 className="mt-4 font-display text-2xl text-teal">Caregiver alerted</h2>
          {coords && (
            <div className="mt-2 font-ui text-sm text-paper/50">
              Location shared: {coords.lat.toFixed(5)}, {coords.lng.toFixed(5)}
            </div>
          )}
        </div>
      )}

      {alertState === "denied" && (
        <div className="max-w-md text-center font-ui text-lg text-alert">
          Location access is off, so we couldn't attach your position. Enable location for this
          site in your browser settings to use SOS fully.
        </div>
      )}

      <AccessibleTile
        id="emergency-cancel"
        label={alertState === "idle" ? "Cancel" : "Back"}
        icon="←"
        tone="teal"
        active={activeTileId === "emergency-cancel"}
        dwellProgress={activeTileId === "emergency-cancel" ? dwellProgress : 0}
        registerTile={registerTile}
      />
    </div>
  );
}
