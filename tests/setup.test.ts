import { formatDistance } from "../src/simulation/distance";

describe("formatDistance", () => {
  it("formats zero distance with metric units", () => {
    expect(formatDistance(0)).toBe("0 m");
  });
});
