export interface CharacterDefinition {
  id: string;
  name: string;
  imagePath: string;
  referencePath: string;
  modelPath: string;
  accent: string;
  abilityId: string | null;
  tagline: string;
}

export const CHARACTERS: CharacterDefinition[] = [
  {
    id: "yang-hang",
    name: "杨杭",
    imagePath: "assets/characters/0bddcb6a916be752b92c31f67ee38c0d.jpg",
    referencePath: "assets/characters/reference/yang-hang-reference.png",
    modelPath: "assets/characters/yang-hang.glb",
    accent: "#ffb454",
    abilityId: "yang-f1-sprint",
    tagline: "满能量，F1 氮气冲刺",
  },
  {
    id: "photo-runner-02",
    name: "第二位跑者",
    imagePath: "assets/characters/01c305716c1d8cf6a175994d63910e2c.jpg",
    referencePath: "assets/characters/reference/runner-02-reference.png",
    modelPath: "assets/characters/runner-02.glb",
    accent: "#54d4c4",
    abilityId: null,
    tagline: "稳住节奏，穿过障碍",
  },
];
