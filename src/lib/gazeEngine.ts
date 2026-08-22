import {
  FaceLandmarker,
  FilesetResolver,
  FaceLandmarkerResult,
} from "@mediapipe/tasks-vision";

// Official MediaPipe-hosted WASM runtime + model bundle. Real, public URLs
// used by Google's own MediaPipe web codelabs — no local model shipping needed.
const WASM_BASE =
  "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.17/wasm";
const MODEL_URL =
  "https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task";

// Landmark index groups (MediaPipe's 478-point refined face mesh).
const LEFT_EYE_RING = [33, 7, 163, 144, 145, 153, 154, 155, 133, 173, 157, 158, 159, 160, 161, 246];
const RIGHT_EYE_RING = [263, 249, 390, 373, 374, 380, 381, 382, 362, 398, 384, 385, 386, 387, 388, 466];
const LEFT_IRIS_CENTER = 468;
const RIGHT_IRIS_CENTER = 473;

export interface GazeFrame {
  faceDetected: boolean;
  /** Raw normalized iris offset within eye socket, ~0.5,0.5 = looking straight. */
  irisX: number;
  irisY: number;
  /** Head yaw/pitch estimate in radians, used to compensate iris offset for head movement. */
  yaw: number;
  pitch: number;
  /** Blendshape-based blink scores, 0 (open) - 1 (closed), per eye. */
  blinkLeft: number;
  blinkRight: number;
}

function boundingBox(landmarks: { x: number; y: number }[], idxs: number[]) {
  let minX = Infinity,
    maxX = -Infinity,
    minY = Infinity,
    maxY = -Infinity;
  for (const i of idxs) {
    const p = landmarks[i];
    if (p.x < minX) minX = p.x;
    if (p.x > maxX) maxX = p.x;
    if (p.y < minY) minY = p.y;
    if (p.y > maxY) maxY = p.y;
  }
  return { minX, maxX, minY, maxY };
}

export class GazeEngine {
  private landmarker: FaceLandmarker | null = null;
  private ready = false;

  async init() {
    const fileset = await FilesetResolver.forVisionTasks(WASM_BASE);
    this.landmarker = await FaceLandmarker.createFromOptions(fileset, {
      baseOptions: { modelAssetPath: MODEL_URL, delegate: "GPU" },
      runningMode: "VIDEO",
      numFaces: 1,
      outputFaceBlendshapes: true,
      outputFacialTransformationMatrixes: true,
    });
    this.ready = true;
  }

  get isReady() {
    return this.ready;
  }

  /** Call once per animation frame with the live <video> element. */
  detect(video: HTMLVideoElement, timestampMs: number): GazeFrame | null {
    if (!this.landmarker || !this.ready) return null;
    if (video.readyState < 2) return null;

    let result: FaceLandmarkerResult;
    try {
      result = this.landmarker.detectForVideo(video, timestampMs);
    } catch {
      return null;
    }

    if (!result.faceLandmarks || result.faceLandmarks.length === 0) {
      return { faceDetected: false, irisX: 0.5, irisY: 0.5, yaw: 0, pitch: 0, blinkLeft: 0, blinkRight: 0 };
    }

    const lm = result.faceLandmarks[0];

    const leftBox = boundingBox(lm, LEFT_EYE_RING);
    const rightBox = boundingBox(lm, RIGHT_EYE_RING);
    const leftIris = lm[LEFT_IRIS_CENTER];
    const rightIris = lm[RIGHT_IRIS_CENTER];

    const leftNormX = (leftIris.x - leftBox.minX) / (leftBox.maxX - leftBox.minX || 1);
    const leftNormY = (leftIris.y - leftBox.minY) / (leftBox.maxY - leftBox.minY || 1);
    const rightNormX = (rightIris.x - rightBox.minX) / (rightBox.maxX - rightBox.minX || 1);
    const rightNormY = (rightIris.y - rightBox.minY) / (rightBox.maxY - rightBox.minY || 1);

    const irisX = (leftNormX + rightNormX) / 2;
    const irisY = (leftNormY + rightNormY) / 2;

    // Head pose from the facial transformation matrix (column-major 4x4).
    let yaw = 0;
    let pitch = 0;
    const matrices = result.facialTransformationMatrixes;
    if (matrices && matrices.length > 0) {
      const m = matrices[0].data; // 16 values
      // Standard Euler extraction from a rotation matrix embedded in the 4x4.
      yaw = Math.atan2(-m[8], Math.sqrt(m[0] * m[0] + m[4] * m[4]));
      pitch = Math.atan2(m[9], m[10]);
    }

    let blinkLeft = 0;
    let blinkRight = 0;
    const shapes = result.faceBlendshapes;
    if (shapes && shapes.length > 0) {
      for (const cat of shapes[0].categories) {
        if (cat.categoryName === "eyeBlinkLeft") blinkLeft = cat.score;
        if (cat.categoryName === "eyeBlinkRight") blinkRight = cat.score;
      }
    }

    return { faceDetected: true, irisX, irisY, yaw, pitch, blinkLeft, blinkRight };
  }
}
