import * as THREE from "three";

export function createEnergyPickup(): THREE.Mesh {
  const pickup = new THREE.Mesh(
    new THREE.IcosahedronGeometry(0.35, 1),
    new THREE.MeshStandardMaterial({ color: 0x55e0c5, emissive: 0x1d8b7c, emissiveIntensity: 1.2, roughness: 0.2, metalness: 0.3 }),
  );
  pickup.position.y = 1.35;
  return pickup;
}
