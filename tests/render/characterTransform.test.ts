import { getCharacterAnchorPosition, getCharacterLocalPosition } from "../../src/render/characters/transform";

describe("character transforms", () => {
  it("keeps anchor and character local motion from double-applying", () => {
    expect(getCharacterAnchorPosition()).toEqual({ x: 0, y: 0, z: 3.4 });
    expect(getCharacterLocalPosition({ lane: 1, y: 0.5 })).toEqual({ x: 2, y: 0.5, z: 0 });
  });
});
