import type { RunState } from "../../simulation/types";

export function getCharacterAnchorPosition(): { x: number; y: number; z: number } {
  return { x: 0, y: 0, z: 3.4 };
}

export function getCharacterLocalPosition(state: Pick<RunState, "lane" | "y">): { x: number; y: number; z: number } {
  return { x: state.lane * 2, y: state.y, z: 0 };
}
