import { CHARACTERS } from "../../src/render/characters/characterManifest";

describe("character manifest", () => {
  it("keeps the two supplied characters and Yang Hang ability stable", () => {
    expect(CHARACTERS).toHaveLength(2);
    expect(CHARACTERS.map((character) => character.id)).toEqual([
      "yang-hang",
      "photo-runner-02",
    ]);
    expect(CHARACTERS[0].imagePath).toContain("0bddcb6a916be752b92c31f67ee38c0d.jpg");
    expect(CHARACTERS[0].abilityId).toBe("yang-f1-sprint");
    expect(CHARACTERS[0].referencePath).toContain("yang-hang-reference");
    expect(CHARACTERS[1].referencePath).toContain("runner-02-reference");
    expect(CHARACTERS.every((character) => character.modelPath?.endsWith(".glb"))).toBe(true);
  });
});
