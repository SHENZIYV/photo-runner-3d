import { createRunState, stepRunner } from "../../src/simulation/runner";

describe("runner simulation", () => {
  it("keeps the player inside three lanes", () => {
    const start = createRunState("yang-hang");
    const left = stepRunner(start, { type: "left" }, 0.016);
    const farLeft = stepRunner(left, { type: "left" }, 0.016);
    const farRight = stepRunner(farLeft, { type: "right" }, 0.016);

    expect(left.lane).toBe(-1);
    expect(farLeft.lane).toBe(-1);
    expect(farRight.lane).toBe(0);
  });

  it("starts a jump and slide for their expected windows", () => {
    const start = createRunState("yang-hang");
    const jumped = stepRunner(start, { type: "jump" }, 0.016);
    const sliding = stepRunner(start, { type: "slide" }, 0.016);

    expect(jumped.verticalVelocity).toBeGreaterThan(0);
    expect(jumped.isJumping).toBe(true);
    expect(sliding.isSliding).toBe(true);
    expect(sliding.slideRemaining).toBeGreaterThan(0);
  });

  it("advances distance and score without leaving negative values", () => {
    const state = createRunState("yang-hang");
    const next = stepRunner(state, { type: "none" }, 1);

    expect(next.distance).toBeGreaterThan(0);
    expect(next.score).toBeGreaterThan(0);
    expect(next.distance).toBeGreaterThanOrEqual(0);
  });
});
