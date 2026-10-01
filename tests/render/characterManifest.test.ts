import { CHARACTERS } from "../../src/render/characters/characterManifest";

describe("character manifest", () => {
  it("keeps the three photo characters and Yang Hang ability stable", () => {
    expect(CHARACTERS).toHaveLength(3);
    expect(CHARACTERS.map((character) => character.id)).toEqual([
      "yang-hang",
      "photo-runner-02",
      "photo-runner-03",
    ]);
    expect(CHARACTERS[0].imagePath).toContain("0bddcb6a916be752b92c31f67ee38c0d.jpg");
    expect(CHARACTERS[0].abilityId).toBe("yang-f1-sprint");
  });
});
