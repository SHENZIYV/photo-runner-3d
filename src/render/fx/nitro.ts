import * as THREE from "three";

export interface NitroFx {
  group: THREE.Group;
  setActive(active: boolean): void;
  update(dt: number): void;
}

export function createNitroFx(): NitroFx {
  const group = new THREE.Group();
  const material = new THREE.MeshBasicMaterial({ color: 0xffb454, transparent: true, opacity: 0.86 });
  for (const x of [-0.55, 0.55]) {
    const flame = new THREE.Mesh(new THREE.ConeGeometry(0.18, 1.1, 8), material.clone());
    flame.rotation.x = -Math.PI / 2;
    flame.position.set(x, 0.52, 0.1);
    group.add(flame);
  }
  group.visible = false;
  return {
    group,
    setActive(active) {
      group.visible = active;
    },
    update(dt) {
      if (!group.visible) return;
      group.children.forEach((child, index) => {
        child.scale.y = 0.8 + Math.sin(performance.now() * 0.018 + index) * 0.2;
      });
      void dt;
    },
  };
}
