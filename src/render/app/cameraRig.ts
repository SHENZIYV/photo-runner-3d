import * as THREE from "three";

export interface CameraTarget {
  x: number;
  y: number;
  z: number;
}

export interface CameraRig {
  update(target: CameraTarget, sprinting: boolean, dt: number): void;
  setPull(value: number): void;
  dispose(): void;
}

export function createCameraRig(camera: THREE.PerspectiveCamera): CameraRig {
  const desired = new THREE.Vector3(5.8, 4.2, 8.6);
  const lookAt = new THREE.Vector3(0, 1.4, -7);
  let pull = 0;

  return {
    update(target, sprinting, dt) {
      const easing = 1 - Math.pow(0.001, Math.max(dt, 0.016));
      const sprintPull = sprinting ? 1 : 0;
      const nextPosition = new THREE.Vector3(
        target.x + desired.x - sprintPull * 1.9,
        target.y + desired.y - sprintPull * 0.45,
        target.z + desired.z - sprintPull * 2.5,
      );
      camera.position.lerp(nextPosition, easing);
      lookAt.set(target.x * 0.4, target.y + 1.25, target.z - 8 - pull * 3);
      camera.lookAt(lookAt);
    },
    setPull(value) {
      pull = THREE.MathUtils.clamp(value, 0, 1);
    },
    dispose() {
      desired.set(0, 0, 0);
      lookAt.set(0, 0, 0);
    },
  };
}
