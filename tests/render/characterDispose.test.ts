import * as THREE from "three";
import { CHARACTERS } from "../../src/render/characters/characterManifest";
import { createCharacter } from "../../src/render/characters/createCharacter";

describe("character resource lifecycle", () => {
  it("disposes the active photo texture when the character is removed", () => {
    const character = createCharacter(CHARACTERS[0], 0.65, 8);
    const texture = new THREE.Texture();
    const dispose = vi.spyOn(texture, "dispose");

    character.setPhotoTexture(texture);
    character.dispose();

    expect(dispose).toHaveBeenCalledOnce();
  });
});
