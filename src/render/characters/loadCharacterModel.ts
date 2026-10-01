import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { MeshoptDecoder } from "three/examples/jsm/libs/meshopt_decoder.module.js";
import * as THREE from "three";

export interface CharacterModelAsset {
  root: THREE.Object3D;
  clips: THREE.AnimationClip[];
}

export interface CharacterGLTFLoader {
  loadAsync(path: string): Promise<{
    scene: THREE.Object3D;
    animations?: THREE.AnimationClip[];
  }>;
}

export interface CharacterHeadResponse {
  ok: boolean;
  headers: { get(name: string): string | null };
}

export type CharacterHeadRequester = (
  path: string,
  init: { method: "HEAD" },
) => Promise<CharacterHeadResponse>;

let defaultLoader: GLTFLoader | null = null;

function getDefaultLoader(): GLTFLoader {
  if (!defaultLoader) {
    defaultLoader = new GLTFLoader();
    defaultLoader.setMeshoptDecoder(MeshoptDecoder);
  }
  return defaultLoader;
}

export async function isCharacterModelAvailable(
  path: string,
  request: CharacterHeadRequester = (url, init) => fetch(url, init),
): Promise<boolean> {
  try {
    const response = await request(path, { method: "HEAD" });
    const contentType = response.headers.get("content-type")?.toLowerCase() ?? "";
    return response.ok && (contentType.includes("model/gltf-binary") || contentType.includes("application/octet-stream"));
  } catch {
    return false;
  }
}

export async function loadCharacterModel(
  path: string,
  loader: CharacterGLTFLoader = getDefaultLoader(),
): Promise<CharacterModelAsset> {
  const gltf = await loader.loadAsync(path);
  gltf.scene.traverse((object) => {
    const mesh = object as THREE.Mesh;
    if (mesh.isMesh) {
      mesh.castShadow = false;
      mesh.receiveShadow = false;
      mesh.frustumCulled = true;
    }
  });
  return { root: gltf.scene, clips: gltf.animations ?? [] };
}
