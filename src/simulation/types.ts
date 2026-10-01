export type Lane = -1 | 0 | 1;

export type InputAction =
  | { type: "left" }
  | { type: "right" }
  | { type: "jump" }
  | { type: "slide" }
  | { type: "ability" }
  | { type: "pause" }
  | { type: "none" };

export type RunPhase = "ready" | "running" | "paused" | "gameover";

export interface RunState {
  characterId: string;
  phase: RunPhase;
  lane: Lane;
  y: number;
  verticalVelocity: number;
  isJumping: boolean;
  isSliding: boolean;
  slideRemaining: number;
  distance: number;
  score: number;
  speed: number;
  energy: number;
  sprintRemaining: number;
  speedMultiplier: number;
  nitro: boolean;
  speedLines: boolean;
  cameraPull: boolean;
}

export interface DifficultyState {
  speed: number;
  spawnInterval: number;
  obstacleWeight: number;
}

export interface SpawnEvent {
  id: string;
  kind: "obstacle" | "energy";
  lane: Lane;
  z: number;
  variant: "barrier" | "arch" | "orb";
}

export interface RunResult {
  characterId: string;
  distance: number;
  score: number;
  bestScore: number;
}
