import * as THREE from "three";

/** World Y of the steel plate top face (plate group at -0.4, half-thickness 0.2). */
export const PLATE_SURFACE_Y = -0.2;

/** Nozzle group origin is the torch tip. */
export const NOZZLE_CUT_Y = -0.11;
export const NOZZLE_TRAVEL_Y = 1.05;

export const FP_LAYOUT = {
  x: 0.15,
  z: 0.2,
  height: 2.15,
} as const;

export type CutEase = "linear" | "inOut" | "in" | "out";

export type CutKey = {
  at: number;
  x: number;
  y: number;
  z: number;
  cutting: boolean;
  ease: CutEase;
};

export type CutSample = {
  x: number;
  y: number;
  z: number;
  cutting: boolean;
  tangentX: number;
  tangentZ: number;
  cutDistance: number;
  totalCutLength: number;
  progress: number;
};

export type KerfSegment = {
  start: THREE.Vector3;
  end: THREE.Vector3;
  length: number;
};

const CUT_SPEED = 0.95;
const RAPID_SPEED = 2.6;
const PLUNGE_SPEED = 1.7;
const PIERCE_HOLD = 0.2;
const LOOP_HOLD = 2.2;

function easeValue(t: number, ease: CutEase) {
  const x = THREE.MathUtils.clamp(t, 0, 1);
  switch (ease) {
    case "in":
      return x * x;
    case "out":
      return 1 - (1 - x) * (1 - x);
    case "inOut":
      return x < 0.5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2;
    default:
      return x;
  }
}

function dist(ax: number, ay: number, az: number, bx: number, by: number, bz: number) {
  return Math.hypot(bx - ax, by - ay, bz - az);
}

function densify(points: { x: number; z: number }[], spacing = 0.05) {
  const out: { x: number; z: number }[] = [];
  for (let i = 1; i < points.length; i++) {
    const a = points[i - 1];
    const b = points[i];
    const d = Math.hypot(b.x - a.x, b.z - a.z);
    const steps = Math.max(1, Math.ceil(d / spacing));
    for (let s = i === 1 ? 0 : 1; s <= steps; s++) {
      const u = s / steps;
      out.push({ x: a.x + (b.x - a.x) * u, z: a.z + (b.z - a.z) * u });
    }
  }
  return out;
}

function letterContours() {
  const h = FP_LAYOUT.height;
  const gap = h * 0.16;
  const fW = h * 0.62;
  const pW = h * 0.7;
  const pairW = fW + gap + pW;
  const fOriginX = FP_LAYOUT.x - pairW / 2;
  const pOriginX = fOriginX + fW + gap;
  const topZ = FP_LAYOUT.z - h / 2;
  const botZ = FP_LAYOUT.z + h / 2;
  const t = h * 0.17;

  const f = densify([
    { x: fOriginX, z: botZ },
    { x: fOriginX, z: topZ },
    { x: fOriginX + fW, z: topZ },
    { x: fOriginX + fW, z: topZ + t },
    { x: fOriginX + t, z: topZ + t },
    { x: fOriginX + t, z: topZ + h * 0.46 },
    { x: fOriginX + fW * 0.78, z: topZ + h * 0.46 },
    { x: fOriginX + fW * 0.78, z: topZ + h * 0.46 + t },
    { x: fOriginX + t, z: topZ + h * 0.46 + t },
    { x: fOriginX + t, z: botZ },
    { x: fOriginX, z: botZ },
  ]);

  const pStemRight = pOriginX + t;
  const bowlRight = pOriginX + pW;
  const bowlBottomZ = topZ + h * 0.62;
  const bowlCz = (topZ + bowlBottomZ) / 2;
  const bowlRx = bowlRight - pStemRight;
  const bowlRy = (bowlBottomZ - topZ) / 2;

  const pOuter: { x: number; z: number }[] = [
    { x: pOriginX, z: botZ },
    { x: pOriginX, z: topZ },
  ];
  const arcSteps = 16;
  for (let i = 0; i <= arcSteps; i++) {
    const theta = -Math.PI / 2 + (Math.PI * i) / arcSteps;
    pOuter.push({
      x: pStemRight + bowlRx * Math.max(0, Math.cos(theta)),
      z: bowlCz + bowlRy * Math.sin(theta),
    });
  }
  pOuter.push({ x: pStemRight, z: botZ }, { x: pOriginX, z: botZ });

  return { f, p: densify(pOuter) };
}

function buildKeys(): CutKey[] {
  const { f, p } = letterContours();
  const keys: CutKey[] = [];
  let t = 0;
  let x = f[0].x;
  let y = NOZZLE_TRAVEL_Y;
  let z = f[0].z;

  const push = (
    nx: number,
    ny: number,
    nz: number,
    duration: number,
    cutting: boolean,
    ease: CutEase,
  ) => {
    t += Math.max(duration, 0.001);
    x = nx;
    y = ny;
    z = nz;
    keys.push({ at: t, x, y, z, cutting, ease });
  };

  const moveXZ = (nx: number, nz: number, speed: number, cutting: boolean, ease: CutEase) => {
    const d = dist(x, y, z, nx, y, nz);
    push(nx, y, nz, d / speed, cutting, ease);
  };

  const setHeight = (ny: number, speed: number, cutting: boolean, ease: CutEase) => {
    push(x, ny, z, Math.abs(ny - y) / speed, cutting, ease);
  };

  const cutContour = (contour: { x: number; z: number }[]) => {
    moveXZ(contour[0].x, contour[0].z, RAPID_SPEED, false, "inOut");
    setHeight(NOZZLE_CUT_Y, PLUNGE_SPEED, false, "in");
    push(x, y, z, PIERCE_HOLD, true, "linear");
    for (let i = 1; i < contour.length; i++) {
      moveXZ(contour[i].x, contour[i].z, CUT_SPEED, true, "linear");
    }
    setHeight(NOZZLE_TRAVEL_Y, PLUNGE_SPEED, false, "out");
  };

  keys.push({ at: 0, x, y, z, cutting: false, ease: "linear" });
  push(f[0].x, NOZZLE_TRAVEL_Y, f[0].z, 0.9, false, "inOut");
  cutContour(f);
  cutContour(p);
  push(f[0].x, NOZZLE_TRAVEL_Y, f[0].z, LOOP_HOLD, false, "inOut");
  return keys;
}

const KEYS = buildKeys();
const DURATION = KEYS[KEYS.length - 1].at;
const TOTAL_CUT_LENGTH = (() => {
  let length = 0;
  for (let i = 1; i < KEYS.length; i++) {
    const a = KEYS[i - 1];
    const b = KEYS[i];
    if (b.cutting) length += dist(a.x, a.y, a.z, b.x, b.y, b.z);
  }
  return length;
})();

export function getCutCycleDuration() {
  return DURATION;
}

export function getTotalCutLength() {
  return TOTAL_CUT_LENGTH;
}

export function getKerfSegments(): KerfSegment[] {
  const y = 0.208;
  const segments: KerfSegment[] = [];
  for (let i = 1; i < KEYS.length; i++) {
    const a = KEYS[i - 1];
    const b = KEYS[i];
    if (!b.cutting) continue;
    const start = new THREE.Vector3(a.x, y, a.z);
    const end = new THREE.Vector3(b.x, y, b.z);
    const length = start.distanceTo(end);
    if (length < 0.0008) continue;
    segments.push({ start, end, length });
  }
  return segments;
}

function sampleAtTime(time: number): CutSample {
  const t = THREE.MathUtils.clamp(time, 0, DURATION);
  let i = 1;
  while (i < KEYS.length && KEYS[i].at < t) i++;
  const b = KEYS[Math.min(i, KEYS.length - 1)];
  const a = KEYS[Math.max(i - 1, 0)];
  const span = Math.max(b.at - a.at, 0.0001);
  const u = easeValue((t - a.at) / span, b.ease);

  const x = a.x + (b.x - a.x) * u;
  const y = a.y + (b.y - a.y) * u;
  const z = a.z + (b.z - a.z) * u;

  let tx = b.x - a.x;
  let tz = b.z - a.z;
  const tLen = Math.hypot(tx, tz);
  if (tLen > 1e-5) {
    tx /= tLen;
    tz /= tLen;
  } else {
    tx = 0;
    tz = 1;
  }

  let cutDistance = 0;
  for (let k = 1; k < i; k++) {
    const ka = KEYS[k - 1];
    const kb = KEYS[k];
    if (kb.cutting) cutDistance += dist(ka.x, ka.y, ka.z, kb.x, kb.y, kb.z);
  }
  if (b.cutting) cutDistance += dist(a.x, a.y, a.z, x, y, z);

  return {
    x,
    y,
    z,
    cutting: b.cutting,
    tangentX: tx,
    tangentZ: tz,
    cutDistance,
    totalCutLength: TOTAL_CUT_LENGTH,
    progress: TOTAL_CUT_LENGTH > 0 ? cutDistance / TOTAL_CUT_LENGTH : 0,
  };
}

/** Loop-friendly sampler (mempertahankan perilaku loop lama). */
export function sampleCutPath(time: number): CutSample {
  const wrapped = ((time % DURATION) + DURATION) % DURATION;
  return sampleAtTime(wrapped);
}

/** Scroll-driven sampler (tanpa wrap): progress 0→1 = satu siklus pemotongan. */
export function sampleCutProgress(progress: number): CutSample {
  return sampleAtTime(THREE.MathUtils.clamp(progress, 0, 1) * DURATION);
}
