import { createCharacter } from "../../src/render/characters/createCharacter";
import { CHARACTERS } from "../../src/render/characters/characterManifest";

describe("runner facing", () => {
  it("faces the forward track direction while keeping the portrait camera-facing", () => {
    const character = createCharacter(CHARACTERS[0], 0.65, 8);
    const body = character.group.children[0];

    expect(body.rotation.y).toBeCloseTo(Math.PI);
    expect(character.portrait.position.z).toBeLessThan(0);

    character.dispose();
  });
});
