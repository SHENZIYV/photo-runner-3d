import * as THREE from "three";

export interface F1CarView {
  group: THREE.Group;
  nitroMount: THREE.Group;
  update(dt: number): void;
  dispose(): void;
}

export function createF1Car(): F1CarView {
  const group = new THREE.Group();
  const bodyMaterial = new THREE.MeshStandardMaterial({ color: 0xe34f3d, emissive: 0x3b0c08, emissiveIntensity: 0.5, metalness: 0.45, roughness: 0.28 });
  const darkMaterial = new THREE.MeshStandardMaterial({ color: 0x101922, metalness: 0.7, roughness: 0.25 });
  const body = new THREE.Mesh(new THREE.BoxGeometry(1.75, 0.28, 2.8), bodyMaterial);
  body.position.y = 0.55;
  group.add(body);

  const nose = new THREE.Mesh(new THREE.ConeGeometry(0.44, 1.5, 4), bodyMaterial);
  nose.rotation.x = Math.PI / 2;
  nose.position.set(0, 0.57, -1.7);
  group.add(nose);

  const cockpit = new THREE.Mesh(new THREE.BoxGeometry(0.85, 0.22, 0.95), darkMaterial);
  cockpit.position.set(0, 0.78, 0.2);
  group.add(cockpit);

  for (const x of [-0.9, 0.9]) {
    for (const z of [-0.92, 0.95]) {
      const wheel = new THREE.Mesh(new THREE.CylinderGeometry(0.32, 0.32, 0.22, 16), darkMaterial);
      wheel.rotation.z = Math.PI / 2;
      wheel.position.set(x, 0.34, z);
      group.add(wheel);
    }
  }

  const rearWing = new THREE.Mesh(new THREE.BoxGeometry(2.2, 0.12, 0.25), bodyMaterial);
  rearWing.position.set(0, 1.05, 1.1);
  group.add(rearWing);

  const nitroMount = new THREE.Group();
  nitroMount.position.set(0, 0.52, 1.58);
  group.add(nitroMount);

  return {
    group,
    nitroMount,
    update(dt) {
      group.rotation.z = Math.sin(performance.now() * 0.004) * 0.025;
      group.position.y = Math.sin(performance.now() * 0.007) * 0.025;
      void dt;
    },
    dispose() {
      group.clear();
    },
  };
}
