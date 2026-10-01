import { createTouchControls } from "../../src/ui/touchControls";

function pointer(type: string, x: number, y: number): Event {
  const event = new Event(type, { bubbles: true, cancelable: true });
  Object.defineProperties(event, {
    clientX: { value: x },
    clientY: { value: y },
    pointerId: { value: 1 },
  });
  return event;
}

describe("touch controls", () => {
  it("dispatches one action per swipe and prevents page scrolling", () => {
    const root = document.createElement("div");
    document.body.append(root);
    const actions: string[] = [];
    createTouchControls(root, (action) => actions.push(action.type));

    root.dispatchEvent(pointer("pointerdown", 40, 120));
    const release = pointer("pointerup", 140, 120);
    root.dispatchEvent(release);
    root.dispatchEvent(pointer("pointerup", 220, 120));

    expect(actions).toEqual(["right"]);
    expect(release.defaultPrevented).toBe(true);
  });

  it("clears a cancelled gesture before the next pointer release", () => {
    const root = document.createElement("div");
    document.body.append(root);
    const actions: string[] = [];
    createTouchControls(root, (action) => actions.push(action.type));

    root.dispatchEvent(pointer("pointerdown", 40, 120));
    root.dispatchEvent(pointer("pointercancel", 140, 120));
    root.dispatchEvent(pointer("pointerup", 220, 120));

    expect(actions).toEqual([]);
  });
});
