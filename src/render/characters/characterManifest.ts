export interface CharacterDefinition {
  id: string;
  name: string;
  imagePath: string;
  accent: string;
  abilityId: string | null;
  tagline: string;
}

export const CHARACTERS: CharacterDefinition[] = [
  {
    id: "yang-hang",
    name: "杨杭",
    imagePath: "assets/characters/0bddcb6a916be752b92c31f67ee38c0d.jpg",
    accent: "#ffb454",
    abilityId: "yang-f1-sprint",
    tagline: "满能量，F1 氮气冲刺",
  },
  {
    id: "photo-runner-02",
    name: "二号跑者",
    imagePath: "assets/characters/01c305716c1d8cf6a175994d63910e2c.jpg",
    accent: "#54d4c4",
    abilityId: null,
    tagline: "稳住节奏，穿过夜色",
  },
  {
    id: "photo-runner-03",
    name: "三号跑者",
    imagePath: "assets/characters/c5265524f68deb3026d52e6bbbf5a3ac.jpg",
    accent: "#ee7a62",
    abilityId: null,
    tagline: "连跳、滑铲、越过边界",
  },
];
