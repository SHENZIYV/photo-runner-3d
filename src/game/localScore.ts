const BEST_SCORE_KEY = "photo-runner-3d:best-score";

export function loadBestScore(storage: Storage = window.localStorage): number {
  const value = Number(storage.getItem(BEST_SCORE_KEY));
  return Number.isFinite(value) ? Math.max(0, value) : 0;
}

export function saveBestScore(score: number, storage: Storage = window.localStorage): number {
  const best = Math.max(loadBestScore(storage), Math.floor(score));
  storage.setItem(BEST_SCORE_KEY, String(best));
  return best;
}
