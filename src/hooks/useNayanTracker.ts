"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { GazeEngine, GazeFrame } from "@/lib/gazeEngine";
import { GazeCalibrator, CalibrationPoint } from "@/lib/calibration";

export type TrackerStatus =
  | "idle"
  | "requesting-camera"
  | "loading-model"
  | "uncalibrated"
  | "calibrating"
  | "ready"
  | "error";

// Deliberate confirm-blink must be held this long. Reflexive human blinks are
// typically 100-150ms; requiring a longer sustained closure is how we tell a
// real "click" apart from ordinary blinking, without needing a second input device.
const BLINK_CONFIRM_MS = 400;
const BLINK_SCORE_THRESHOLD = 0.55;
// Below this, we don't trust iris position at all (eyelid starting to cover
// the iris makes the gaze estimate noisy right when you're trying to blink-click).
// We freeze gaze/dwell updates once either eye crosses this, instead of letting
// a jumpy reading reset your dwell target mid-blink.
const BLINK_FREEZE_THRESHOLD = 0.3;
const DWELL_MS = 1100;
const SMOOTHING = 0.25; // EMA factor for the gaze point, higher = snappier

interface TileRect {
  id: string;
  rect: () => DOMRect | null;
}

export function useNayanTracker() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const engineRef = useRef<GazeEngine | null>(null);
  const calibratorRef = useRef(new GazeCalibrator());
  const rafRef = useRef<number | null>(null);
  const tilesRef = useRef<Map<string, TileRect>>(new Map());
  const smoothedPointRef = useRef<{ x: number; y: number } | null>(null);
  const dwellStartRef = useRef<{ id: string; t: number } | null>(null);
  const blinkStartRef = useRef<number | null>(null);

  const [status, setStatus] = useState<TrackerStatus>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [faceDetected, setFaceDetected] = useState(false);
  const [gazePoint, setGazePoint] = useState<{ x: number; y: number } | null>(null);
  const [activeTileId, setActiveTileId] = useState<string | null>(null);
  const [dwellProgress, setDwellProgress] = useState(0);
  const [confirmedTileId, setConfirmedTileId] = useState<string | null>(null);
  const [confirmNonce, setConfirmNonce] = useState(0);
  const [debugInfo, setDebugInfo] = useState<{ blinkLeft: number; blinkRight: number; dwellTileId: string | null }>({
    blinkLeft: 0,
    blinkRight: 0,
    dwellTileId: null,
  });

  const registerTile = useCallback((id: string, rect: () => DOMRect | null) => {
    tilesRef.current.set(id, { id, rect });
    return () => {
      tilesRef.current.delete(id);
    };
  }, []);

  const start = useCallback(async () => {
    setStatus("requesting-camera");
    setErrorMessage(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 640, height: 480, facingMode: "user" },
        audio: false,
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
    } catch (e) {
      setStatus("error");
      setErrorMessage(
        "Couldn't access the camera. Check camera permissions for this site and that no other app is using it."
      );
      return;
    }

    setStatus("loading-model");
    try {
      const engine = new GazeEngine();
      await engine.init();
      engineRef.current = engine;
    } catch (e) {
      setStatus("error");
      setErrorMessage("Couldn't load the face-tracking model. Check your internet connection and reload.");
      return;
    }

    setStatus("uncalibrated");
    loop();
  }, []);

  const loop = useCallback(() => {
    const tick = (t: number) => {
      const engine = engineRef.current;
      const video = videoRef.current;
      if (engine && video && engine.isReady) {
        const frame = engine.detect(video, t);
        if (frame) {
          setFaceDetected(frame.faceDetected);
          if (frame.faceDetected) {
            processFrame(frame);
          } else {
            dwellStartRef.current = null;
            setActiveTileId(null);
            setDwellProgress(0);
          }
        }
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
  }, []);

  const processFrame = useCallback((frame: GazeFrame) => {
    const closing = frame.blinkLeft > BLINK_FREEZE_THRESHOLD || frame.blinkRight > BLINK_FREEZE_THRESHOLD;
    const calibrator = calibratorRef.current;

    // Freeze the gaze point / dwell target while eyes are closing or closed,
    // so the noisy iris reading during a blink doesn't knock you off the tile
    // right when you're trying to confirm it.
    if (calibrator.calibrated && !closing) {
      const pred = calibrator.predict(frame);
      if (pred) {
        const prev = smoothedPointRef.current;
        const next = prev
          ? { x: prev.x + (pred.x - prev.x) * SMOOTHING, y: prev.y + (pred.y - prev.y) * SMOOTHING }
          : pred;
        smoothedPointRef.current = next;
        setGazePoint(next);
        evaluateDwell(next);
      }
    }

    setDebugInfo({
      blinkLeft: frame.blinkLeft,
      blinkRight: frame.blinkRight,
      dwellTileId: dwellStartRef.current?.id ?? null,
    });

    evaluateBlink(frame);
  }, []);

  const evaluateDwell = useCallback((point: { x: number; y: number }) => {
    const px = point.x * window.innerWidth;
    const py = point.y * window.innerHeight;
    let hitId: string | null = null;
    for (const tile of tilesRef.current.values()) {
      const r = tile.rect();
      if (!r) continue;
      if (px >= r.left && px <= r.right && py >= r.top && py <= r.bottom) {
        hitId = tile.id;
        break;
      }
    }

    setActiveTileId(hitId);

    if (!hitId) {
      dwellStartRef.current = null;
      setDwellProgress(0);
      return;
    }

    const now = performance.now();
    if (!dwellStartRef.current || dwellStartRef.current.id !== hitId) {
      dwellStartRef.current = { id: hitId, t: now };
    }
    const elapsed = now - dwellStartRef.current.t;
    setDwellProgress(Math.min(1, elapsed / DWELL_MS));
  }, []);

  const evaluateBlink = useCallback((frame: GazeFrame) => {
    const closed = frame.blinkLeft > BLINK_SCORE_THRESHOLD && frame.blinkRight > BLINK_SCORE_THRESHOLD;
    const now = performance.now();

    if (closed) {
      if (blinkStartRef.current === null) blinkStartRef.current = now;
      const held = now - blinkStartRef.current;
      if (held >= BLINK_CONFIRM_MS) {
        // Confirm only the tile currently under dwell, and only once per blink.
        const dwelling = dwellStartRef.current;
        if (dwelling && dwelling.id) {
          setConfirmedTileId(dwelling.id);
          setConfirmNonce((n) => n + 1);
        }
        blinkStartRef.current = -1; // sentinel: already fired this closure
      }
    } else {
      blinkStartRef.current = null;
    }
  }, []);

  const runCalibration = useCallback(
    async (
      points: { screenX: number; screenY: number }[],
      onPoint: (index: number) => Promise<void>
    ) => {
      setStatus("calibrating");
      const collected: CalibrationPoint[] = [];
      for (let i = 0; i < points.length; i++) {
        await onPoint(i);
        const samples: GazeFrame[] = [];
        const start = performance.now();
        while (performance.now() - start < 900) {
          const engine = engineRef.current;
          const video = videoRef.current;
          if (engine && video) {
            const f = engine.detect(video, performance.now());
            if (f && f.faceDetected) samples.push(f);
          }
          // eslint-disable-next-line no-await-in-loop
          await new Promise((r) => requestAnimationFrame(r));
        }
        collected.push({ screenX: points[i].screenX, screenY: points[i].screenY, samples });
      }
      const ok = calibratorRef.current.fit(collected);
      setStatus(ok ? "ready" : "error");
      if (!ok) setErrorMessage("Calibration didn't collect enough samples. Make sure your face is well lit and try again.");
      return ok;
    },
    []
  );

  const recalibrate = useCallback(() => {
    calibratorRef.current.reset();
    setStatus("uncalibrated");
  }, []);

  useEffect(() => {
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      const stream = videoRef.current?.srcObject as MediaStream | null;
      stream?.getTracks().forEach((tr) => tr.stop());
    };
  }, []);

  return {
    videoRef,
    status,
    errorMessage,
    faceDetected,
    gazePoint,
    activeTileId,
    dwellProgress,
    confirmedTileId,
    confirmNonce,
    debugInfo,
    start,
    runCalibration,
    recalibrate,
    registerTile,
  };
}
