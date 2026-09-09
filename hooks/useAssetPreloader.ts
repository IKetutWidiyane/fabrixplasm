"use client";

import { useEffect, useState } from "react";
import { loadCriticalAssets } from "@/lib/assetLoader";

export interface PreloaderState {
  /** Progression 0..100 (réelle, basée sur les octets chargés). */
  progress: number;
  /** Statut lisible (branding). */
  status: string;
  /** true quand tous les assets critiques sont prêts (Hero peut monter). */
  done: boolean;
}

const INITIAL: PreloaderState = {
  progress: 0,
  status: "INITIALIZING",
  done: false,
};

/**
 * Ordonne le chargement des assets critiques du Hero et expose l'état
 * de progression au preloader (et au montage différé du Hero).
 */
export function useAssetPreloader(): PreloaderState {
  const [state, setState] = useState<PreloaderState>(INITIAL);

  useEffect(() => {
    let cancelled = false;

    void loadCriticalAssets((fraction, status) => {
      if (cancelled) return;
      const progress = Math.min(100, Math.round(fraction * 100));
      setState({ progress, status, done: progress >= 100 });
    });

    return () => {
      cancelled = true;
    };
  }, []);

  return state;
}