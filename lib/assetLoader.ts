"use client";

/**
 * Smart preloader — FABRIXPLASM.
 *
 * Charge les assets critiques du Hero 3D avec une progression réelle basée sur les
 * octets téléchargés, puis préchauffe en arrière-plan (idle) les assets non-critiques
 * des sections suivantes (CNC, Process) afin qu'elles apparaissent instantanément.
 */

// -- Assets critiques : tout ce que le Hero 3D consomme réellement --
export const CRITICAL_ASSETS: readonly string[] = [
  "/models/hero/nozzle.glb",
  "/textures/hero/color.webp",
  "/textures/hero/normal.webp",
  "/textures/hero/roughness.png",
  "/textures/hero/metalness.png",
  "/hdri/empty_warehouse_01_1k.hdr",
];

// -- Assets non-critiques, préchargés en arrière-plan après le Hero --
export const IDLE_ASSETS: readonly string[] = [
  "/images/cnc/cnc-machine.webp",
  // Process (Unsplash, data/processData.ts)
  "https://images.unsplash.com/photo-1618424181497-157f25b6ce50?q=80&w=2000&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1535813547-99c456a41d4a?q=80&w=2000&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1565439390234-58cb30cce4b4?q=80&w=2000&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1505098935706-93da5394beee?q=80&w=2000&auto=format&fit=crop",
];

// Les fonts Geist pèsent peu : petit poids dans le calcul global de progression.
const FONT_WEIGHT = 0.1;
const MAX_LOAD_MS = 8000;
const MIN_DISPLAY_MS = 900;
const FONT_FAMILIES = ["Geist Mono", "Geist Sans"];

export function getStatus(fraction: number): string {
  if (fraction <= 0) return "INITIALIZING";
  if (fraction < 0.25) return "LOADING TEXTURES";
  if (fraction < 0.55) return "LOADING 3D MODEL";
  if (fraction < 0.8) return "PREPARING SCENE";
  if (fraction < 1) return "BUILDING WORLD";
  return "READY";
}

const sleep = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

/**
 * Télécharge un asset et signale le progrès réel en octets.
 * Si la longueur est inconnue (ou fetch indisponible), l'asset est marqué [0,0]
 * et retiré du dénominateur afin de ne pas fausser la progression.
 */
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

/** Force le chargement des @font-face (next/font) pour qu'ils ne tardent pas après l'intro. */
async function forceFonts() {
  try {
    await Promise.allSettled(
      FONT_FAMILIES.map((family) => document.fonts.load(`600px "${family}"`, "FABRIXPLASM")),
    );
  } catch {
    /* API indisponible (vieux navigateurs) : on continue sans elle. */
  }
}

/**
 * Charge les assets critiques et émet des mises à jour (fraction 0..1, statut texte).
 * Garantit toujours un retour : minimum d'affichage + timeout de sécurité.
 */
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

  // Durée minimale d'affichage, puis passage à l'état "prêt" quoi qu'il arrive.
  const elapsed = performance.now() - start;
  if (elapsed < MIN_DISPLAY_MS) {
    await sleep(MIN_DISPLAY_MS - elapsed);
  }
  emit(1);
}

/**
 * Précharge les assets non-critiques (CNC, Process) en arrière-plan.
 * Non bloquant : il ne fait que remplir le cache navigateur.
 */
export function preloadIdleAssets(): void {
  for (const url of IDLE_ASSETS) {
    const img = new Image();
    img.decodingHint = "async";
    img.src = url;
  }
}