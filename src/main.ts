import "./styles.css";
import { createGameApp, type GameApp } from "./render/app/createGameApp";
import { getDeviceQualityHints, getQualityProfile } from "./render/app/quality";
import { createCharacter, type CharacterView } from "./render/characters/createCharacter";
import { CHARACTERS } from "./render/characters/characterManifest";
import { isCharacterModelAvailable, loadCharacterModel } from "./render/characters/loadCharacterModel";
import { loadPhotoTexture } from "./render/characters/photoTexture";
import { getCharacterAnchorPosition } from "./render/characters/transform";
import { createObstacle } from "./render/world/obstacles";
import { createEnergyPickup } from "./render/world/pickups";
import { spawnEntities } from "./simulation/spawner";
import { createGameController, type GameController } from "./game/gameController";
import { getObstacleZ, isObstacleCollision, OPENING_OBSTACLE_BASES } from "./game/collision";
import { resetCollectibles } from "./game/pickupState";
import { loadBestScore, saveBestScore } from "./game/localScore";
import { renderHud } from "./ui/hud";
import { showCharacterMenu } from "./ui/menu";
import { showResults } from "./ui/results";
import { createTouchControls, type TouchControls } from "./ui/touchControls";
import type { RunState } from "./simulation/types";

const appHost = document.querySelector<HTMLDivElement>("#app");

if (!appHost) {
  throw new Error("App host not found");
}

appHost.innerHTML = `
  <main class="app-shell" aria-label="Photo Runner 3D">
    <div id="game-root" class="game-root"></div>
    <div id="ui-layer" class="ui-layer"></div>
  </main>
`;

const gameRootElement = document.querySelector<HTMLDivElement>("#game-root");
const uiLayerElement = document.querySelector<HTMLDivElement>("#ui-layer");

if (!gameRootElement || !uiLayerElement) throw new Error("Game shell not found");

const gameRoot = gameRootElement;
const uiLayer = uiLayerElement;
let app: GameApp;
try {
  app = createGameApp(gameRoot);
} catch (error) {
  const message = error instanceof Error ? error.message : "3D renderer failed";
  gameRoot.innerHTML = `<div class="runtime-fallback">3D 场景启动失败：${message}</div>`;
  throw error;
}

let activeCharacter: CharacterView | null = null;
let controller: GameController;
let touchControls: TouchControls;
const quality = getQualityProfile(getDeviceQualityHints());
const hudRoot = document.createElement("div");
hudRoot.className = "hud-root";
const touchRoot = document.createElement("div");
touchRoot.className = "touch-controls";

const spawnSchedule = spawnEntities(42, 0);
const obstacleViews = spawnSchedule.filter((event) => event.kind === "obstacle").map((event) => ({
  mesh: createObstacle(event.variant === "arch" ? "arch" : "barrier"),
  lane: event.lane,
  base: event.z,
}));
const energyViews = spawnSchedule.filter((event) => event.kind === "energy").map((event) => ({
  mesh: createEnergyPickup(),
  lane: event.lane,
  base: event.z,
  collected: false,
}));
obstacleViews.forEach((view) => app.world.add(view.mesh));
energyViews.forEach((view) => app.world.add(view.mesh));

function mountCharacter(characterId: string) {
  if (activeCharacter) {
    app.characterAnchor.remove(activeCharacter.group);
    activeCharacter.dispose();
  }
  activeCharacter = null;
  const definition = CHARACTERS.find((character) => character.id === characterId) ?? CHARACTERS[0];
  activeCharacter = createCharacter(definition, quality.geometryDetail, quality.speedLineCount);
  const character = activeCharacter;
  app.characterAnchor.add(character.group);
  void loadPhotoTexture(definition.imagePath)
    .then((texture) => {
      if (activeCharacter === character) character.setPhotoTexture(texture);
    })
    .catch(() => app.setFallback("角色照片加载失败，请刷新页面重试。"));
  void isCharacterModelAvailable(definition.modelPath).then((available) => {
    if (!available) return;
    return loadCharacterModel(definition.modelPath)
      .then(({ root, clips }) => {
        if (activeCharacter === character) character.setModel(root, clips);
      })
      .catch(() => {
        // The procedural character remains playable if a GLB cannot be decoded.
      });
  });
}

function renderFrame(state: RunState, dt: number): boolean {
  if (!activeCharacter) return false;
  const anchor = getCharacterAnchorPosition();
  app.characterAnchor.position.set(anchor.x, anchor.y, anchor.z);
  activeCharacter.sync(state, dt);
  app.track.scroll(state.distance);
  app.setSprintMode(state.sprintRemaining > 0);

  let collision = false;
  obstacleViews.forEach((view) => {
    const z = getObstacleZ(view.base, state.distance);
    view.mesh.position.set(view.lane * 2, 0, z);
    view.mesh.visible = z < 5 && z > -64;
    if (isObstacleCollision(z, view.lane, state.lane, state.y >= 0.75 || state.sprintRemaining > 0, state.isSliding)) {
      collision = true;
    }
  });

  energyViews.forEach((view) => {
    const cycle = ((view.base - state.distance * 0.35) % 78 + 78) % 78;
    const z = 3.4 - cycle;
    view.mesh.position.set(view.lane * 2, 1.2, z);
    view.mesh.rotation.y += dt * 2.6;
    view.mesh.visible = !view.collected && z < 5 && z > -64;
    if (!view.collected && z > 0.1 && z < 1.5 && view.lane === state.lane) {
      view.collected = true;
      controller.collectEnergy(40);
    }
  });

  return collision;
}

function showActiveHud(state: RunState) {
  if (!uiLayer.contains(hudRoot)) uiLayer.append(hudRoot);
  renderHud(hudRoot, state);
}

function showTouchButtons() {
  touchRoot.innerHTML = `
    <button class="touch-button" data-action="left" type="button" aria-label="向左">←</button>
    <button class="touch-button" data-action="jump" type="button" aria-label="跳跃">↑</button>
    <button class="touch-button" data-action="slide" type="button" aria-label="滑铲">↓</button>
    <button class="touch-button" data-action="right" type="button" aria-label="向右">→</button>
  `;
  uiLayer.append(touchRoot);
}

function startGame(characterId: string) {
  uiLayer.replaceChildren(hudRoot, touchRoot);
  showTouchButtons();
  resetCollectibles(energyViews);
  mountCharacter(characterId);
  controller.start(characterId);
  app.start();
}

controller = createGameController({
  render: {
    reset: mountCharacter,
    sync: renderFrame,
  },
  onState: (state) => {
    if (state.phase === "running" || state.phase === "paused") {
      showActiveHud(state);
      touchControls.setAbilityEnabled(state.characterId === "yang-hang" && state.energy >= 100);
    }
  },
  onResult: (result) => {
    app.stop();
    touchControls.setAbilityEnabled(false);
    showResults(uiLayer, result, () => startGame(result.characterId));
  },
  loadBestScore: () => loadBestScore(),
  saveBestScore: (score) => saveBestScore(score),
});

app.setFrameCallback((dt) => controller.update(dt));

touchControls = createTouchControls(uiLayer, (action) => controller.dispatch(action));
uiLayer.addEventListener("click", (event) => {
  const target = event.target as HTMLElement | null;
  if (target?.closest("[data-pause]")) controller.togglePause();
});

mountCharacter(CHARACTERS[0].id);
showCharacterMenu(uiLayer, startGame);

window.addEventListener("beforeunload", () => {
  app.stop();
  touchControls.dispose();
  activeCharacter?.dispose();
  app.dispose();
});

document.addEventListener("visibilitychange", () => {
  if (document.hidden) {
    app.stop();
  } else if (controller.getState().phase === "running") {
    app.start();
  }
});
