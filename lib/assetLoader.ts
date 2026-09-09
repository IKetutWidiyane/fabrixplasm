"use client";

import { processData } from "@/data/processData";

export const CRITICAL_ASSETS: readonly string[] = [
  "/models/hero/nozzle.glb",
  "/textures/hero/color.webp",
  "/textures/hero/normal.webp",
  "/textures/hero/roughness.png",
  "/textures/hero/metalness.png",
  "/hdri/empty_warehouse_01_1k.hdr",
];

export const IDLE_ASSETS: readonly string[] = [
  "/images/cnc/cnc-machine.webp",
  ...processData.map((step) => step.image),
];

const FONT_WEIGHT = 0.1;
const MAX_LOAD_MS = 8000;
// PERBAIKAN: Dinaikkan menjadi 2500ms (2.5 detik) agar logo FP punya waktu yang cukup untuk tergambar penuh dari 0 ke 100%.
const MIN_DISPLAY_MS = 2500; 
const FONT_FAMILIES = ["Geist Mono", "Geist Sans"];

export function getStatus(fraction: number): string {
  if (fraction <= 0) return "INITIALIZING";
  if (fraction < 0.3) return "LOADING ASSETS";
  if (fraction < 0.7) return "PREPARING SCENE";
  return "READY";
}

const sleep = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

async function fetchWithProgress(
  url: string,
  onProgress: (loaded: number, total: number) => void,
): Promise<void> {
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
    const total = Number(res.headers.get("content-length") ?? 0);
    if (!res.body || total <= 0) {
      await res.arrayBuffer();
      onProgress(1, 1);
      return;
    }
    const reader = res.body.getReader();
    let loaded = 0;
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      loaded += value?.length ?? 0;
      onProgress(loaded, total);
    }
    onProgress(total, total);
  } catch {
    onProgress(0, 0);
  }
}

async function forceFonts() {
  try {
    await Promise.allSettled(
      FONT_FAMILIES.map((family) => document.fonts.load(`600px "${family}"`, "FABRIXPLASM")),
    );
  } catch {
    // Abaikan jika API tidak tersedia
  }
}

export async function loadCriticalAssets(
  onUpdate: (fraction: number, status: string) => void,
): Promise<void> {
  const start = performance.now();

  const progress: Record<string, { loaded: number; total: number }> = {};
  for (const url of CRITICAL_ASSETS) {
    progress[url] = { loaded: 0, total: 1 };
  }
  let fontsReady = false;

  const emit = (forced?: number) => {
    let loaded = 0;
    let total = 0;
    for (const url of CRITICAL_ASSETS) {
      const s = progress[url];
      if (s.total > 0) {
        loaded += s.loaded;
        total += s.total;
      }
    }
    const assetFraction = total > 0 ? Math.min(1, loaded / total) : 1;
    const fraction =
      forced !== undefined
        ? forced
        : Math.min(1, assetFraction * (1 - FONT_WEIGHT) + (fontsReady ? FONT_WEIGHT : 0));
    onUpdate(fraction, fraction >= 1 ? "READY" : getStatus(fraction));
  };

  const tasks = CRITICAL_ASSETS.map((url) =>
    fetchWithProgress(url, (loaded, total) => {
      progress[url] = { loaded, total };
      emit();
    }),
  );
  
  const fontTask = forceFonts().then(() => {
    fontsReady = true;
    emit();
  });

  await Promise.race([Promise.all([...tasks, fontTask]), sleep(MAX_LOAD_MS)]);

  // Memastikan minimum waktu tampil terpenuhi sebelum layar hilang
  const elapsed = performance.now() - start;
  if (elapsed < MIN_DISPLAY_MS) {
    await sleep(MIN_DISPLAY_MS - elapsed);
  }
  emit(1);
}

export function preloadIdleAssets(): void {
  for (const url of IDLE_ASSETS) {
    const img = new Image();
    img.decoding = "async";
    img.src = url;
  }
}