import * as THREE from "three";
import type { RunState } from "../../simulation/types";
import type { CharacterDefinition } from "./characterManifest";
import { createF1Car, type F1CarView } from "./createF1Car";
import { createNitroFx, type NitroFx } from "../fx/nitro";
import { createSpeedLinesFx, type SpeedLinesFx } from "../fx/speedLines";

function disposeObjectTree(root: THREE.Object3D): void {
  const geometries = new Set<THREE.BufferGeometry>();
  const materialSet = new Set<THREE.Material>();
  const textures = new Set<THREE.Texture>();
  root.traverse((object) => {
    const drawable = object as THREE.Mesh;
    if (drawable.geometry) geometries.add(drawable.geometry);
    const objectMaterials = Array.isArray(drawable.material) ? drawable.material : [drawable.material];
    objectMaterials.filter(Boolean).forEach((material) => {
      if (!material) return;
      materialSet.add(material);
      Object.values(material as unknown as Record<string, unknown>).forEach((value) => {
        if (value instanceof THREE.Texture) textures.add(value);
      });
    });
  });
  geometries.forEach((geometry) => geometry.dispose());
  textures.forEach((texture) => texture.dispose());
  materialSet.forEach((material) => material.dispose());
}

export interface CharacterView {
  group: THREE.Group;
  portrait: THREE.Mesh;
  car: F1CarView;
  nitro: NitroFx;
  speedLines: SpeedLinesFx;
  setPhotoTexture(texture: THREE.Texture): void;
  setModel(model: THREE.Object3D, clips?: THREE.AnimationClip[]): void;
  sync(state: RunState, dt: number): void;
  dispose(): void;
}

export function createCharacter(definition: CharacterDefinition, geometryDetail = 1, speedLineCount = 16): CharacterView {
  const group = new THREE.Group();
  const body = new THREE.Group();
  const skin = new THREE.MeshStandardMaterial({ color: 0xc78368, roughness: 0.7 });
  const clothing = new THREE.MeshStandardMaterial({ color: definition.accent, roughness: 0.62 });
  const dark = new THREE.MeshStandardMaterial({ color: 0x111b22, roughness: 0.45 });

  const torso = new THREE.Mesh(new THREE.BoxGeometry(0.82, 1.08, 0.5), clothing);
  torso.position.y = 1.1;
  body.add(torso);
  const head = new THREE.Mesh(new THREE.SphereGeometry(0.43, Math.max(10, Math.round(18 * geometryDetail)), Math.max(8, Math.round(14 * geometryDetail))), skin);
  head.scale.set(1, 1.08, 0.8);
  head.position.set(0, 1.95, 0.02);
  body.add(head);

  const hair = new THREE.Mesh(new THREE.SphereGeometry(0.46, Math.max(8, Math.round(14 * geometryDetail)), Math.max(7, Math.round(10 * geometryDetail)), 0, Math.PI * 2, 0, Math.PI * 0.58), dark);
  hair.scale.set(1.05, 0.86, 0.9);
  hair.position.set(0, 2.13, 0.01);
  body.add(hair);

  const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.16, 0.2, 10), skin);
  neck.position.y = 1.52;
  body.add(neck);

  const limbMaterial = new THREE.MeshStandardMaterial({ color: definition.accent, roughness: 0.7 });
  const leftArm = new THREE.Mesh(new THREE.CapsuleGeometry(0.13, 0.66, Math.max(3, Math.round(5 * geometryDetail)), Math.max(6, Math.round(10 * geometryDetail))), limbMaterial);
  const rightArm = leftArm.clone();
  leftArm.position.set(-0.58, 1.04, 0);
  rightArm.position.set(0.58, 1.04, 0);
  leftArm.rotation.z = -0.18;
  rightArm.rotation.z = 0.18;
  body.add(leftArm, rightArm);

  const leftLeg = new THREE.Mesh(new THREE.CapsuleGeometry(0.16, 0.72, Math.max(3, Math.round(5 * geometryDetail)), Math.max(6, Math.round(10 * geometryDetail))), dark);
  const rightLeg = leftLeg.clone();
  leftLeg.position.set(-0.22, 0.25, 0);
  rightLeg.position.set(0.22, 0.25, 0);
  body.add(leftLeg, rightLeg);

  const portrait = new THREE.Mesh(
    new THREE.PlaneGeometry(0.58, 0.72),
    new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, side: THREE.DoubleSide }),
  );
  portrait.position.set(0, 1.95, -0.37);
  body.add(portrait);

  const glassesMaterial = new THREE.MeshBasicMaterial({ color: 0x16232b, transparent: true, opacity: 0.9 });
  const glasses = new THREE.Group();
  for (const x of [-0.14, 0.14]) {
    const lens = new THREE.Mesh(new THREE.TorusGeometry(0.105, 0.018, 5, Math.max(8, Math.round(16 * geometryDetail))), glassesMaterial);
    lens.position.set(x, 2.02, -0.405);
    glasses.add(lens);
  }
  body.add(glasses);
  // The chase camera is behind the runner. Keep the photo as a camera-facing
  // presentation layer while the body and its movement use the forward -Z axis.
  body.rotation.y = Math.PI;
  group.add(body);

  const car = createF1Car();
  car.group.visible = false;
  group.add(car.group);
  const nitro = createNitroFx();
  const speedLines = createSpeedLinesFx(speedLineCount);
  group.add(nitro.group, speedLines.group);
  let photoTexture: THREE.Texture | null = null;
  let importedModel: THREE.Object3D | null = null;
  let mixer: THREE.AnimationMixer | null = null;
  const actions = new Map<string, THREE.AnimationAction>();
  let activeAction: THREE.AnimationAction | null = null;

  function selectAction(state: RunState): THREE.AnimationAction | null {
    if (actions.size === 0) return null;
    const requestedName = state.isSliding ? "slide" : state.isJumping ? "jump" : "run";
    return actions.get(requestedName) ?? actions.get("idle") ?? actions.values().next().value ?? null;
  }

  return {
    group,
    portrait,
    car,
    nitro,
    speedLines,
    setPhotoTexture(texture) {
      const material = portrait.material as THREE.MeshBasicMaterial;
      photoTexture?.dispose();
      photoTexture = texture;
      material.map = texture;
      material.needsUpdate = true;
    },
    setModel(model, clips = []) {
      if (importedModel) {
        group.remove(importedModel);
        disposeObjectTree(importedModel);
        importedModel = null;
      }
      importedModel = model;
      importedModel.name = importedModel.name || "ImportedCharacter";
      importedModel.position.set(0, 0, 0);
      importedModel.rotation.set(0, 0, 0);
      importedModel.traverse((object) => {
        const drawable = object as THREE.Mesh;
        if (drawable.isMesh) {
          drawable.castShadow = false;
          drawable.receiveShadow = false;
        }
      });
      group.add(importedModel);
      body.visible = false;
      portrait.visible = false;
      mixer?.stopAllAction();
      mixer = clips.length > 0 ? new THREE.AnimationMixer(importedModel) : null;
      actions.clear();
      activeAction = null;
      clips.forEach((clip) => {
        const key = clip.name.trim().toLowerCase();
        if (key) actions.set(key, mixer!.clipAction(clip));
      });
      const initialAction = actions.get("idle") ?? actions.get("run") ?? actions.values().next().value;
      if (initialAction) {
        initialAction.play();
        activeAction = initialAction;
      }
    },
    sync(state, dt) {
      group.position.x = state.lane * 2;
      group.position.y = state.y;
      if (importedModel) {
        importedModel.visible = true;
        importedModel.scale.setScalar(state.sprintRemaining > 0 ? 0.72 : 1);
        importedModel.position.y = state.sprintRemaining > 0 ? 0.9 : 0;
        const nextAction = selectAction(state);
        if (nextAction && nextAction !== activeAction) {
          activeAction?.fadeOut(0.12);
          nextAction.reset().fadeIn(0.12).play();
          activeAction = nextAction;
        }
        mixer?.update(dt);
      } else {
        body.visible = true;
        body.scale.setScalar(state.sprintRemaining > 0 ? 0.72 : 1);
        body.position.y = state.sprintRemaining > 0 ? 0.9 : 0;
      }
      car.group.visible = state.sprintRemaining > 0;
      if (car.group.visible) {
        car.update(dt);
        nitro.group.position.copy(car.nitroMount.position);
      }
      nitro.setActive(state.nitro);
      speedLines.setActive(state.speedLines);
      nitro.update(dt);
      speedLines.update(dt);
      if (!importedModel) {
        body.rotation.z = THREE.MathUtils.lerp(body.rotation.z, state.isJumping ? -0.08 : state.isSliding ? 0.12 : 0, 0.18);
        leftArm.rotation.x = state.isSliding ? -0.4 : 0;
        rightArm.rotation.x = state.isSliding ? -0.4 : 0;
        leftLeg.rotation.x = Math.sin(performance.now() * 0.012) * 0.25;
        rightLeg.rotation.x = -leftLeg.rotation.x;
      }
    },
    dispose() {
      disposeObjectTree(group);
      photoTexture = null;
      mixer?.stopAllAction();
      mixer = null;
      car.dispose();
      group.clear();
    },
  };
}
