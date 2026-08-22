# Nayan — gaze-controlled everyday access

A browser-based interface controlled entirely by eye gaze and deliberate blinks,
built for people with dyskinetic cerebral palsy who can't reliably use a
keyboard, mouse, touchscreen, or even voice control (involuntary vocalizations
make speech recognition unreliable for many people with dyskinetic CP).

## What's actually real here

- **Face/iris tracking**: Google's MediaPipe FaceLandmarker (`@mediapipe/tasks-vision`),
  running live in the browser on your webcam feed. 478-point face mesh with iris
  landmarks and blendshape scores. No mock data — this is the same model family
  used in production MediaPipe apps.
- **Gaze estimation**: iris position is normalized within each eye socket, averaged
  across both eyes, and combined with head yaw/pitch (extracted from MediaPipe's
  facial transformation matrix) into a 5-dimensional feature vector. A **ridge
  regression** model, fit from a 5-point on-screen calibration you do at startup,
  maps that feature vector to normalized screen coordinates. This is the same
  general approach real gaze-tracking libraries (e.g. WebGazer) use — calibrated
  regression from eye features, not a lookup table or a fake cursor.
- **Blink detection**: uses MediaPipe's `eyeBlinkLeft`/`eyeBlinkRight` blendshape
  scores directly (more robust than hand-rolled eye-aspect-ratio math). A blink
  only counts as a "click" if both eyes stay closed for **450ms** — an ordinary
  reflexive blink is ~100–150ms, so this deliberately filters those out.
- **Voice feedback**: the real browser `SpeechSynthesis` API — no external TTS
  service, works offline.
- **Emergency SOS**: the real browser `Geolocation` API — asks for actual GPS/
  network location and reports real coordinates.

## What's simulated, on purpose

The account balance, transaction history, and beneficiaries (`src/lib/mockBank.ts`)
are fixture data. No hackathon team gets production bank API access in a few
hours — pretending otherwise would be exactly the kind of fake that prompted
rebuilding this in the first place. The interaction layer around it (how you
navigate to it, select it, confirm it) is 100% real and functional.

## The key design decision (worth saying out loud to judges)

This does **not** try to give you a precise mouse-like gaze cursor. Dyskinetic CP
involves involuntary movements — demanding pixel-accurate pointing is the wrong
UX for this population, even if it demos flashier. Instead:

**Large zone tiles → gaze dwell to highlight → sustained blink to confirm.**

Two-step confirmation (you have to both look *and* deliberately blink) also
guards against accidental selections from involuntary eye/head movement, which
matters a lot more here than in a general gaze-interface demo.

## Running it locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`, grant camera permission, click "Start camera,"
then run the 5-point calibration (look at each gold dot as it appears). After
that, everything is gaze + blink only.

Tips for it to actually work well:
- Sit in decent, even light — avoid strong backlight (window behind you).
- Keep your face fully in frame during calibration.
- Recalibrate (button, top-left) if you change position significantly.

## Deploying (so you have a live demo link)

```bash
npm i -g vercel   # if you don't have it
vercel
```

Follow the prompts (link/create a project, accept defaults). Vercel will give
you a live `https://...vercel.app` URL — camera and geolocation APIs require
HTTPS, which Vercel gives you automatically. No environment variables needed
for this version since nothing calls a paid API.

## Realistic next steps if you have more time

- Swap `mockBank.ts` for a real backend (Supabase/MongoDB, like your teammate's
  repo) once you're not racing the clock.
- Add a settings screen to adjust dwell time and blink threshold per-user —
  motor symptoms vary a lot person to person, so hardcoded timings are a v1
  compromise, not a real accessibility design.
- Add Sarvam AI (or similar) for regional-language TTS/STT to widen who this
  actually helps in India.
- Log calibration quality (residual error) and prompt a re-calibration if the
  fit is poor, instead of trusting one static regression for the whole session.
