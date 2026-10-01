import { spawnEntities } from "../../src/simulation/spawner";

describe("runner spawner", () => {
  it("returns repeatable seeded events with obstacles and energy pickups", () => {
    const first = spawnEntities(42, 120);
    const second = spawnEntities(42, 120);
    const kinds = new Set(first.map((event) => event.kind));

    expect(second).toEqual(first);
    expect(first.length).toBeGreaterThan(0);
    expect(kinds.has("obstacle")).toBe(true);
    expect(kinds.has("energy")).toBe(true);
  });
});
