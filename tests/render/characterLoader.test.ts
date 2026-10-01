import * as THREE from "three";
import { isCharacterModelAvailable, loadCharacterModel } from "../../src/render/characters/loadCharacterModel";

describe("character model loader", () => {
  it("returns the imported scene and animation clips from a GLB loader", async () => {
    const scene = new THREE.Group();
    const clip = new THREE.AnimationClip("Run", 1, []);
    const loaded = await loadCharacterModel("assets/characters/test.glb", {
      loadAsync: async (path: string) => ({ scene, animations: [clip], path }),
    });

    expect(loaded.root).toBe(scene);
    expect(loaded.clips).toEqual([clip]);
  });

  it("only marks a binary GLB response as available", async () => {
    const available = await isCharacterModelAvailable("assets/characters/test.glb", async () => ({
      ok: true,
      headers: { get: () => "model/gltf-binary" },
    }));
    const htmlFallback = await isCharacterModelAvailable("assets/characters/missing.glb", async () => ({
      ok: true,
      headers: { get: () => "text/html" },
    }));

    expect(available).toBe(true);
    expect(htmlFallback).toBe(false);
  });
});
