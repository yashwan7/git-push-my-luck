import { ridgeRegression, matVec } from "./matrix";
import type { GazeFrame } from "./gazeEngine";

// Feature vector fed to the regressor: [irisX, irisY, yaw, pitch, 1(bias)]
// Head yaw/pitch are included so the model partially compensates for the
// head movement that happens naturally with dyskinetic CP, rather than
// assuming a perfectly still head like a naive "iris position = gaze" model.
function toFeature(f: GazeFrame): number[] {
  return [f.irisX, f.irisY, f.yaw, f.pitch, 1];
}

export interface CalibrationPoint {
  screenX: number; // normalized 0-1
  screenY: number; // normalized 0-1
  samples: GazeFrame[];
}

export class GazeCalibrator {
  private wx: number[] | null = null;
  private wy: number[] | null = null;

  get calibrated() {
    return this.wx !== null && this.wy !== null;
  }

  fit(points: CalibrationPoint[]) {
    const F: number[][] = [];
    const tx: number[] = [];
    const ty: number[] = [];
    for (const p of points) {
      for (const s of p.samples) {
        F.push(toFeature(s));
        tx.push(p.screenX);
        ty.push(p.screenY);
      }
    }
    if (F.length < 5) return false;
    this.wx = ridgeRegression(F, tx);
    this.wy = ridgeRegression(F, ty);
    return true;
  }

  predict(frame: GazeFrame): { x: number; y: number } | null {
    if (!this.wx || !this.wy) return null;
    const feat = toFeature(frame);
    const x = matVec([this.wx], feat)[0];
    const y = matVec([this.wy], feat)[0];
    return { x: clamp01(x), y: clamp01(y) };
  }

  reset() {
    this.wx = null;
    this.wy = null;
  }
}

function clamp01(v: number) {
  return Math.max(0, Math.min(1, v));
}
