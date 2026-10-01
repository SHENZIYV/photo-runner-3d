import * as THREE from "three";

export function createBackground(): THREE.Group {
  const group = new THREE.Group();
  const skyline = new THREE.Group();
  const buildingColors = [0x173143, 0x1e3b43, 0x263c4d, 0x2a3045];

  for (let index = 0; index < 18; index += 1) {
    const width = 1.4 + (index % 4) * 0.45;
    const height = 2.2 + (index % 5) * 0.8;
    const building = new THREE.Mesh(
      new THREE.BoxGeometry(width, height, 2.4),
      new THREE.MeshStandardMaterial({ color: buildingColors[index % buildingColors.length], roughness: 0.82 }),
    );
    building.position.set(-15 + index * 1.75, height / 2 - 0.1, -34 - (index % 3) * 5);
    skyline.add(building);
  }

  const moon = new THREE.Mesh(
    new THREE.SphereGeometry(2.2, 24, 16),
    new THREE.MeshBasicMaterial({ color: 0xffd48a }),
  );
  moon.position.set(-9, 12, -46);
  group.add(skyline, moon);
  return group;
}
