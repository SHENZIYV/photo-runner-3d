import { resetCollectibles } from "../../src/game/pickupState";

describe("pickup state", () => {
  it("resets collected energy items for a new run", () => {
    const pickups = [{ collected: true }, { collected: true }];

    resetCollectibles(pickups);

    expect(pickups.every((pickup) => !pickup.collected)).toBe(true);
  });
});
