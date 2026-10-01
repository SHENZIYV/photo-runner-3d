import { getObstacleZ, isObstacleCollision, OPENING_OBSTACLE_BASES } from "../../src/game/collision";

describe("runner obstacle spacing", () => {
  it("keeps all opening obstacles away from the player at 20 meters", () => {
    const opening = OPENING_OBSTACLE_BASES.map((base) => getObstacleZ(base, 20));

    expect(opening.some((z) => isObstacleCollision(z, 0, 0, false, false))).toBe(false);
  });

  it("moves obstacles toward the camera as distance advances", () => {
    expect(getObstacleZ(31, 1)).toBeGreaterThan(getObstacleZ(31, 0));
  });
});
