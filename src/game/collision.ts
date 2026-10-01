export const OPENING_OBSTACLE_BASES = [31, 52, 84] as const;

export function getObstacleZ(base: number, distance: number): number {
  const cycle = (base + Math.max(0, distance) * 0.35) % 78;
  return 3.4 - cycle;
}

export function isObstacleCollision(z: number, lane: number, playerLane: number, jumping: boolean, sliding: boolean): boolean {
  return z > 0.2 && z < 1.4 && lane === playerLane && !jumping && !sliding;
}
