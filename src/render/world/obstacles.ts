import * as THREE from "three";

export function createObstacle(variant: "barrier" | "arch" = "barrier"): THREE.Group {
  const group = new THREE.Group();
  const material = new THREE.MeshStandardMaterial({ color: 0xf06b4f, emissive: 0x57150d, emissiveIntensity: 0.7, roughness: 0.35 });
  if (variant === "barrier") {
    const block = new THREE.Mesh(new THREE.BoxGeometry(2.7, 1.1, 0.8), material);
    block.position.y = 0.55;
    group.add(block);
  } else {
    const top = new THREE.Mesh(new THREE.BoxGeometry(2.9, 0.55, 0.55), material);
    const left = new THREE.Mesh(new THREE.BoxGeometry(0.45, 2.1, 0.55), material);
    const right = left.clone();
    top.position.y = 2.1;
    left.position.set(-1.15, 1.05, 0);
    right.position.set(1.15, 1.05, 0);
    group.add(top, left, right);
  }
  return group;
}
