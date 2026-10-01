import type { DifficultyState } from "./types";

export function updateDifficulty(distance: number): DifficultyState {
  const safeDistance = Math.max(0, distance);
  return {
    speed: Math.min(18, 8 + safeDistance * 0.018),
    spawnInterval: Math.max(0.58, 1.25 - safeDistance * 0.0008),
    obstacleWeight: Math.min(0.82, 0.35 + safeDistance * 0.0015),
  };
}
