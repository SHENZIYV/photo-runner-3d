import { activateAbility, addEnergy, createAbilityState } from "../../src/simulation/abilities";
import { createRunState } from "../../src/simulation/runner";

describe("character abilities", () => {
  it("clamps energy at 100", () => {
    const state = createRunState("yang-hang");
    const charged = addEnergy(state, 140);

    expect(charged.energy).toBe(100);
  });

  it("allows Yang Hang F1 sprint only at full energy", () => {
    const empty = createRunState("yang-hang");
    const blocked = activateAbility(empty);
    const ready = addEnergy(empty, 100);
    const sprinting = activateAbility(ready);

    expect(blocked.sprintRemaining).toBe(0);
    expect(sprinting.sprintRemaining).toBe(4);
    expect(sprinting.speedMultiplier).toBe(2.2);
    expect(sprinting.energy).toBe(0);
    expect(sprinting.nitro).toBe(true);
    expect(sprinting.speedLines).toBe(true);
    expect(sprinting.cameraPull).toBe(true);
  });

  it("ticks sprint back to normal state", () => {
    const ready = addEnergy(createRunState("yang-hang"), 100);
    const sprinting = activateAbility(ready);
    const settled = createAbilityState({ ...sprinting, sprintRemaining: 0 });

    expect(settled.speedMultiplier).toBe(1);
    expect(settled.nitro).toBe(false);
  });
});
