export type QualityTier = "low" | "standard";

export interface QualityHints {
  viewportWidth: number;
  viewportHeight: number;
  devicePixelRatio: number;
  deviceMemory?: number;
  hardwareConcurrency?: number;
}

export interface QualityProfile {
  tier: QualityTier;
  antialias: boolean;
  pixelRatio: number;
  geometryDetail: number;
  speedLineCount: number;
}

export function getQualityProfile(hints: QualityHints): QualityProfile {
  const compactViewport = hints.viewportWidth <= 700 || hints.viewportHeight <= 700;
  const constrainedMemory = hints.deviceMemory !== undefined && hints.deviceMemory <= 4;
  const constrainedCpu = hints.hardwareConcurrency !== undefined && hints.hardwareConcurrency <= 4;
  const low = compactViewport || constrainedMemory || constrainedCpu;

  if (low) {
    return {
      tier: "low",
      antialias: false,
      pixelRatio: Math.min(Math.max(hints.devicePixelRatio || 1, 1), 1.25),
      geometryDetail: 0.65,
      speedLineCount: 8,
    };
  }

  return {
    tier: "standard",
    antialias: true,
    pixelRatio: Math.min(Math.max(hints.devicePixelRatio || 1, 1), 2),
    geometryDetail: 1,
    speedLineCount: 16,
  };
}

export function getDeviceQualityHints(): QualityHints {
  const navigatorWithHints = navigator as Navigator & { deviceMemory?: number };
  return {
    viewportWidth: window.innerWidth,
    viewportHeight: window.innerHeight,
    devicePixelRatio: window.devicePixelRatio || 1,
    deviceMemory: navigatorWithHints.deviceMemory,
    hardwareConcurrency: navigator.hardwareConcurrency,
  };
}
