import * as THREE from "three";

export interface SpeedLinesFx {
  group: THREE.Group;
  setActive(active: boolean): void;
  update(dt: number): void;
}

export function createSpeedLinesFx(lineCount = 16): SpeedLinesFx {
  const group = new THREE.Group();
  const material = new THREE.LineBasicMaterial({ color: 0xfff0c6, transparent: true, opacity: 0.48 });
  for (let index = 0; index < lineCount; index += 1) {
    const x = -6 + (index % 8) * 1.7;
    const y = 0.8 + Math.floor(index / 8) * 1.7;
    const geometry = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(x, y, -2 - (index % 4)),
      new THREE.Vector3(x * 1.08, y, -5 - (index % 4)),
    ]);
    group.add(new THREE.Line(geometry, material));
  }
  group.visible = false;
  return {
    group,
    setActive(active) {
      group.visible = active;
    },
    update(dt) {
      if (!group.visible) return;
      group.position.z = (group.position.z - dt * 12) % 4;
    },
  };
}
