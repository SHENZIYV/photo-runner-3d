import * as THREE from "three";
import { CHARACTERS } from "../../src/render/characters/characterManifest";
import { createCharacter } from "../../src/render/characters/createCharacter";

describe("character model replacement", () => {
  it("mounts a full 3D model while keeping the character group stable", () => {
    const character = createCharacter(CHARACTERS[0], 0.65, 8);
    const model = new THREE.Group();
    model.name = "ImportedCharacter";

    character.setModel(model, []);

    expect(character.group.getObjectByName("ImportedCharacter")).toBe(model);
    expect(character.group).toBeDefined();
    character.dispose();
  });

  it("releases the previous model resources before replacing it", () => {
    const character = createCharacter(CHARACTERS[0], 0.65, 8);
    const oldGeometry = new THREE.BoxGeometry();
    const oldTexture = new THREE.Texture();
    const oldMaterial = new THREE.MeshStandardMaterial({ map: oldTexture });
    const oldModel = new THREE.Group();
    oldModel.add(new THREE.Mesh(oldGeometry, oldMaterial));
    const geometryDispose = vi.spyOn(oldGeometry, "dispose");
    const materialDispose = vi.spyOn(oldMaterial, "dispose");
    const textureDispose = vi.spyOn(oldTexture, "dispose");

    character.setModel(oldModel, []);
    character.setModel(new THREE.Group(), []);

    expect(geometryDispose).toHaveBeenCalledOnce();
    expect(materialDispose).toHaveBeenCalledOnce();
    expect(textureDispose).toHaveBeenCalledOnce();
    character.dispose();
  });
});
