import type { InputAction } from "../simulation/types";

export interface TouchControls {
  setAbilityEnabled(enabled: boolean): void;
  dispose(): void;
}

type PointerLike = PointerEvent | (Event & { clientX: number; clientY: number; pointerId?: number });

export function createTouchControls(root: HTMLElement, dispatch: (action: InputAction) => void): TouchControls {
  let active = false;
  let startX = 0;
  let startY = 0;
  let abilityEnabled = false;

  const onPointerDown = (event: Event) => {
    const pointer = event as PointerLike;
    active = true;
    startX = pointer.clientX;
    startY = pointer.clientY;
  };

  const onPointerUp = (event: Event) => {
    if (!active) return;
    const pointer = event as PointerLike;
    const dx = pointer.clientX - startX;
    const dy = pointer.clientY - startY;
    active = false;
    event.preventDefault();

    if (Math.max(Math.abs(dx), Math.abs(dy)) < 24) return;
    if (Math.abs(dx) > Math.abs(dy)) {
      dispatch({ type: dx > 0 ? "right" : "left" });
    } else {
      dispatch({ type: dy < 0 ? "jump" : "slide" });
    }
  };

  const onPointerCancel = () => {
    active = false;
  };

  const onClick = (event: Event) => {
    const target = event.target as HTMLElement | null;
    const action = target?.closest<HTMLElement>("[data-action]")?.dataset.action;
    if (!action) return;
    if (action === "ability" && !abilityEnabled) return;
    if (action === "left" || action === "right" || action === "jump" || action === "slide" || action === "ability") {
      dispatch({ type: action });
    }
  };

  const onKeyDown = (event: KeyboardEvent) => {
    const keys: Record<string, InputAction["type"]> = {
      ArrowLeft: "left",
      a: "left",
      ArrowRight: "right",
      d: "right",
      ArrowUp: "jump",
      " ": "jump",
      w: "jump",
      ArrowDown: "slide",
      s: "slide",
      e: "ability",
      Escape: "pause",
    };
    const action = keys[event.key];
    if (!action || (action === "ability" && !abilityEnabled)) return;
    event.preventDefault();
    dispatch({ type: action });
  };

  root.addEventListener("pointerdown", onPointerDown, { passive: false });
  root.addEventListener("pointerup", onPointerUp, { passive: false });
  root.addEventListener("pointercancel", onPointerCancel);
  root.addEventListener("click", onClick);
  window.addEventListener("keydown", onKeyDown, { passive: false });
  root.style.touchAction = "none";

  return {
    setAbilityEnabled(enabled) {
      abilityEnabled = enabled;
    },
    dispose() {
      root.removeEventListener("pointerdown", onPointerDown);
      root.removeEventListener("pointerup", onPointerUp);
      root.removeEventListener("pointercancel", onPointerCancel);
      root.removeEventListener("click", onClick);
      window.removeEventListener("keydown", onKeyDown);
    },
  };
}
