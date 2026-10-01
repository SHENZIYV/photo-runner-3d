import * as THREE from "three";
import { createCameraRig, type CameraRig } from "./cameraRig";
import { createBackground } from "../world/background";
import { createTrack, type TrackView } from "../world/track";
import { getDeviceQualityHints, getQualityProfile } from "./quality";

export interface GameApp {
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  renderer: THREE.WebGLRenderer;
  world: THREE.Group;
  characterAnchor: THREE.Group;
  cameraRig: CameraRig;
  track: TrackView;
  start(): void;
  stop(): void;
  setFrameCallback(callback: (dt: number) => void): void;
  resize(): void;
  setSprintMode(active: boolean): void;
  setFallback(message: string): void;
  dispose(): void;
}

export function createGameApp(host: HTMLElement): GameApp {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x071018);
  scene.fog = new THREE.Fog(0x071018, 24, 72);

  const camera = new THREE.PerspectiveCamera(56, 1, 0.1, 120);
  camera.position.set(5.8, 4.2, 8.6);

  const quality = getQualityProfile(getDeviceQualityHints());
  const renderer = new THREE.WebGLRenderer({ antialias: quality.antialias, powerPreference: "high-performance" });
  renderer.setPixelRatio(quality.pixelRatio);
  renderer.setSize(host.clientWidth || window.innerWidth, host.clientHeight || window.innerHeight);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  host.replaceChildren(renderer.domElement);

  const world = new THREE.Group();
  const track = createTrack();
  const background = createBackground();
  const characterAnchor = new THREE.Group();
  characterAnchor.position.set(0, 0, 3.4);
  world.add(track.group, background, characterAnchor);
  scene.add(world);

  scene.add(new THREE.HemisphereLight(0x9ec4d8, 0x0a1016, 1.3));
  const key = new THREE.DirectionalLight(0xffc783, 2.2);
  key.position.set(4, 10, 8);
  scene.add(key);
  const rim = new THREE.PointLight(0x54d4c4, 18, 30, 2);
  rim.position.set(-6, 4, -4);
  scene.add(rim);

  const cameraRig = createCameraRig(camera);
  let frame = 0;
  let running = false;
  let sprinting = false;
  let lastTime = performance.now();
  let frameCallback: ((dt: number) => void) | null = null;

  const render = (time: number) => {
    if (!running) return;
    const dt = Math.min(0.1, (time - lastTime) / 1000);
    lastTime = time;
    frameCallback?.(dt);
    cameraRig.update(characterAnchor.position, sprinting, dt);
    renderer.render(scene, camera);
  };

  const onContextLost = (event: Event) => {
    event.preventDefault();
    setFallback("3D 图形暂时不可用，请刷新页面重试。");
  };
  renderer.domElement.addEventListener("webglcontextlost", onContextLost);

  const resize = () => {
    const width = host.clientWidth || window.innerWidth;
    const height = host.clientHeight || window.innerHeight;
    camera.aspect = width / Math.max(1, height);
    camera.updateProjectionMatrix();
    renderer.setSize(width, height, false);
  };
  window.addEventListener("resize", resize);

  function setFallback(message: string) {
    host.dataset.webglError = "true";
    const notice = document.createElement("div");
    notice.className = "runtime-fallback";
    notice.textContent = message;
    host.append(notice);
  }

  return {
    scene,
    camera,
    renderer,
    world,
    characterAnchor,
    cameraRig,
    track,
    start() {
      if (running) return;
      running = true;
      lastTime = performance.now();
      frame = renderer.setAnimationLoop(render) as unknown as number;
    },
    stop() {
      running = false;
      renderer.setAnimationLoop(null);
      if (frame) cancelAnimationFrame(frame);
    },
    setFrameCallback(callback) {
      frameCallback = callback;
    },
    resize,
    setSprintMode(active) {
      sprinting = active;
      cameraRig.setPull(active ? 1 : 0);
    },
    setFallback,
    dispose() {
      running = false;
      frameCallback = null;
      renderer.setAnimationLoop(null);
      renderer.domElement.removeEventListener("webglcontextlost", onContextLost);
      window.removeEventListener("resize", resize);
      cameraRig.dispose();
      track.dispose();
      renderer.dispose();
      host.replaceChildren();
    },
  };
}
