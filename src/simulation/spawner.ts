import type { Lane, SpawnEvent } from "./types";

function random(seed: number): number {
  let value = seed >>> 0;
  value = (value * 1664525 + 1013904223) >>> 0;
  return value / 4294967296;
}

export function spawnEntities(seed: number, distance: number): SpawnEvent[] {
  const safeSeed = Math.floor(Math.max(0, seed));
  const lanes: Lane[] = [-1, 0, 1];
  const events: SpawnEvent[] = [];
  const count = 5 + (safeSeed % 3);

  for (let index = 0; index < count; index += 1) {
    const roll = random(safeSeed + index * 17);
    const lane = lanes[Math.floor(roll * lanes.length)];
    events.push({
      id: `${safeSeed}-${index}`,
      kind: index % 3 === 2 ? "energy" : "obstacle",
      lane,
      z: distance + 34 + index * 18,
      variant: index % 3 === 2 ? "orb" : index % 2 === 0 ? "barrier" : "arch",
    });
  }

  return events;
}
