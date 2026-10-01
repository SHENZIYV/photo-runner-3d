import * as THREE from "three";

export interface TrackView {
  group: THREE.Group;
  scroll(distance: number): void;
  dispose(): void;
}

export function createTrack(): TrackView {
  const group = new THREE.Group();
  const floor = new THREE.Mesh(
    new THREE.BoxGeometry(13, 0.25, 160),
    new THREE.MeshStandardMaterial({ color: 0x12222e, roughness: 0.9, metalness: 0.08 }),
  );
  floor.position.set(0, -0.15, -48);
  group.add(floor);

  const shoulder = new THREE.MeshStandardMaterial({ color: 0xe06f47, emissive: 0x3b120d, emissiveIntensity: 0.4 });
  for (const x of [-6.1, 6.1]) {
    const edge = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.08, 160), shoulder);
    edge.position.set(x, 0.02, -48);
    group.add(edge);
  }

  const laneMaterial = new THREE.MeshStandardMaterial({ color: 0x4b8e91, emissive: 0x0f282d, emissiveIntensity: 0.35 });
  for (const x of [-2, 2]) {
    for (let index = 0; index < 20; index += 1) {
      const marker = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.025, 3.2), laneMaterial);
      marker.position.set(x, 0.02, -index * 8);
      group.add(marker);
    }
  }

  const pads = new THREE.MeshStandardMaterial({ color: 0xf2a653, emissive: 0x6a2d0d, emissiveIntensity: 0.5 });
  for (let index = 0; index < 12; index += 1) {
    const pad = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.04, 0.18), pads);
    pad.position.set(-5.5 + (index % 2) * 11, 0.04, -index * 13 - 4);
    group.add(pad);
  }

  return {
    group,
    scroll(distance) {
      const offset = (distance * 0.35) % 160;
      group.position.z = offset > 0 ? -offset : 0;
    },
    dispose() {
      group.clear();
    },
  };
}
