# 3D Photo Runner Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build a mobile browser 3D endless runner with three photo-based playable characters and Yang Hang's F1 nitro sprint ability.

**Architecture:** Keep deterministic runner rules in pure TypeScript simulation modules. Use Three.js as a render adapter for the 3D track, character meshes, car, camera, and effects. Use DOM for menus, HUD, touch controls, and results.

**Tech Stack:** Vite, TypeScript, Three.js, Vitest, Playwright/browser screenshots.

**Spec:** `docs/superpowers/specs/2026-10-01-3d-photo-runner-design.md`

## Global Constraints

- Use vanilla Three.js + TypeScript + Vite.
- Keep simulation state independent of Three.js objects.
- Support touch gestures and keyboard fallback.
- Use the three supplied JPGs locally under `public/assets/characters/`.
- Use a generic open-wheel car with no real team branding.
- Cap device pixel ratio at 1.5 on mobile and 2 on desktop.
- Keep the persistent HUD compact and protect the track center.

## Review Focus

- A swipe must produce only one movement action and must not scroll the page; test in the touch input module.
- Energy must clamp at full and F1 activation must be rejected when Yang Hang is not full; test in ability rules.
- Sprint must expire and restore normal speed/camera state; test in simulation and render bridge.
- Mobile portrait and landscape resize must preserve a visible canvas and non-overlapping HUD; test with Playwright screenshots.
- WebGL or asset failure must leave an actionable fallback message instead of a blank screen; test the boot path.

### Task 1: Scaffold the Vite/Three.js project and test harness

**Files:**
- Create: `package.json`, `tsconfig.json`, `vite.config.ts`, `index.html`
- Create: `src/main.ts`, `src/styles.css`
- Create: `tests/setup.test.ts`
- Create: `public/assets/characters/0bddcb6a916be752b92c31f67ee38c0d.jpg`, `public/assets/characters/01c305716c1d8cf6a175994d63910e2c.jpg`, `public/assets/characters/c5265524f68deb3026d52e6bbbf5a3ac.jpg`

**Interfaces:**
- Produces npm scripts `dev`, `build`, `test`, and `test:watch`.
- Produces a Vite entry point that renders a root shell and exposes the asset paths.

- [ ] **Step 1: Add the package manifest and TypeScript/Vite configuration.** Pin Three.js, Vitest, and Vite-compatible TypeScript versions; configure `npm run build` and `npm test`.
- [ ] **Step 2: Write the smoke test for the test harness.** Assert a minimal exported `formatDistance(0)` helper returns `"0 m"` once the simulation utility exists; run it and confirm the missing-helper failure.
- [ ] **Step 3: Add the minimal shared utility and entry shell.** Create the helper, `main.ts`, responsive canvas host, and base CSS; rerun the smoke test and `npm run build`.
- [ ] **Step 4: Copy the supplied photos into the public asset directory and verify all three files are readable.**
- [ ] **Step 5: Commit.** `git add package.json tsconfig.json vite.config.ts index.html src public tests && git commit -m "chore: scaffold three runner"`

### Task 2: Implement pure runner simulation and ability rules

**Files:**
- Create: `src/simulation/types.ts`
- Create: `src/simulation/runner.ts`
- Create: `src/simulation/difficulty.ts`
- Create: `src/simulation/abilities.ts`
- Create: `src/simulation/spawner.ts`
- Test: `tests/simulation/runner.test.ts`, `tests/simulation/abilities.test.ts`, `tests/simulation/spawner.test.ts`

**Interfaces:**
- `createRunState(characterId: string): RunState`
- `stepRunner(state: RunState, action: InputAction, dt: number): RunState`
- `updateDifficulty(distance: number): DifficultyState`
- `addEnergy(state: RunState, amount: number): RunState`
- `activateAbility(state: RunState): RunState`
- `spawnEntities(seed: number, distance: number): SpawnEvent[]`

- [ ] **Step 1: Write failing tests for lane changes, jump/slide state, distance, and collision bounds.** Include the expected three lanes `-1`, `0`, `1` and reject a fourth lane.
- [ ] **Step 2: Run `npm test -- tests/simulation/runner.test.ts` and confirm the failures are caused by missing simulation functions.**
- [ ] **Step 3: Implement the minimal typed run state and deterministic runner step.** Keep timers and positions in plain data, not render objects.
- [ ] **Step 4: Write failing ability tests.** Assert energy clamps to `100`, Yang Hang can activate only at `100`, activation sets `sprintRemaining` to `4`, speed multiplier to `2.2`, and clears energy.
- [ ] **Step 5: Run the ability test and confirm the expected missing-implementation failure.**
- [ ] **Step 6: Implement ability rules and distance-based difficulty.** Include `nitro`, `speedLines`, and `cameraPull` flags in the returned ability state.
- [ ] **Step 7: Write and run spawner tests.** Assert seeded events are repeatable and entity kinds include obstacles and energy pickups.
- [ ] **Step 8: Run the full unit suite and commit.** `npm test && git add src/simulation tests/simulation && git commit -m "feat: add runner simulation and abilities"`

### Task 3: Build the Three.js scene, reusable track, and camera

**Files:**
- Create: `src/render/app/createGameApp.ts`
- Create: `src/render/app/cameraRig.ts`
- Create: `src/render/world/track.ts`
- Create: `src/render/world/obstacles.ts`
- Create: `src/render/world/pickups.ts`
- Create: `src/render/world/background.ts`
- Modify: `src/main.ts`, `src/styles.css`

**Interfaces:**
- `createGameApp(host: HTMLElement): GameApp`
- `GameApp.start(): void`, `GameApp.resize(): void`, `GameApp.dispose(): void`
- `createTrack(): TrackView`
- `createCameraRig(camera: THREE.PerspectiveCamera): CameraRig`

- [ ] **Step 1: Add a render smoke test for `createGameApp` exports and a DOM host.** Run it to establish the initial failure.
- [ ] **Step 2: Implement renderer, scene, lights, resize handling, animation-loop pause on hidden tabs, and context-loss fallback.** Cap pixel ratio using the global constraint.
- [ ] **Step 3: Implement recycled track segments, lane markers, simple campus/city backdrop, obstacle meshes, and energy pickups.** Keep the center view readable and reuse instances.
- [ ] **Step 4: Implement the chase camera with eased look-ahead and a sprint pull-in parameter.**
- [ ] **Step 5: Run `npm run build` and the unit suite; commit.** `git add src/main.ts src/styles.css src/render && git commit -m "feat: add three runner scene"`

### Task 4: Add complete 3D characters, photo textures, and Yang Hang's F1 car

**Files:**
- Create: `src/render/characters/characterManifest.ts`
- Create: `src/render/characters/photoTexture.ts`
- Create: `src/render/characters/createCharacter.ts`
- Create: `src/render/characters/createF1Car.ts`
- Create: `src/render/fx/nitro.ts`
- Create: `src/render/fx/speedLines.ts`
- Test: `tests/render/characterManifest.test.ts`

**Interfaces:**
- `CHARACTERS: CharacterDefinition[]`
- `createPhotoAtlas(image: HTMLImageElement, accent: string): Promise<THREE.CanvasTexture>`
- `createCharacter(definition: CharacterDefinition): CharacterView`
- `createF1Car(): F1CarView`
- `setSprintFx(view: CharacterView, active: boolean): void`

- [ ] **Step 1: Write a failing manifest test.** Assert the three stable IDs, Yang Hang's image path, and ability ID `yang-f1-sprint`.
- [ ] **Step 2: Run the manifest test and confirm it fails before the manifest exists.**
- [ ] **Step 3: Implement manifest, photo atlas compositor, and a low-poly character group with explicit head/body/limb pivots.** Preserve the source photo on the face/upper-body materials and keep the group rotatable.
- [ ] **Step 4: Implement the generic open-wheel car group, cockpit portrait mount, nitro emitter, and speed-line pool.**
- [ ] **Step 5: Run the manifest test, build, and a manual local render check; commit.** `git add src/render/characters src/render/fx tests/render && git commit -m "feat: add photo characters and f1 sprint visuals"`

### Task 5: Add menus, HUD, touch controls, and results flow

**Files:**
- Create: `src/ui/menu.ts`
- Create: `src/ui/hud.ts`
- Create: `src/ui/touchControls.ts`
- Create: `src/ui/results.ts`
- Modify: `src/main.ts`, `src/styles.css`
- Test: `tests/ui/touchControls.test.ts`

**Interfaces:**
- `createTouchControls(root: HTMLElement, dispatch: (action: InputAction) => void): TouchControls`
- `renderHud(root: HTMLElement, state: RunState): void`
- `showCharacterMenu(root: HTMLElement, onStart: (characterId: string) => void): void`
- `showResults(root: HTMLElement, result: RunResult, onReplay: () => void): void`

- [ ] **Step 1: Write failing touch tests for one-action-per-swipe, tap zones, and `preventDefault` on active gestures.**
- [ ] **Step 2: Run the touch test and confirm the missing-control failure.**
- [ ] **Step 3: Implement gesture recognition and keyboard fallback.** Keep the ability button disabled until Yang Hang energy reaches full.
- [ ] **Step 4: Implement the character menu with three photo previews, the compact HUD, energy meter, pause chip, touch zones, and results panel.** Use safe-area CSS and keep the lower-middle playfield clear.
- [ ] **Step 5: Run the UI tests and `npm run build`; commit.** `git add src/ui src/main.ts src/styles.css tests/ui && git commit -m "feat: add mobile runner ui"`

### Task 6: Wire the game loop and persistence

**Files:**
- Create: `src/game/gameController.ts`
- Create: `src/game/localScore.ts`
- Modify: `src/main.ts`, `src/render/app/createGameApp.ts`
- Test: `tests/game/gameController.test.ts`

**Interfaces:**
- `createGameController(deps: GameDependencies): GameController`
- `GameController.start(characterId): void`
- `GameController.dispatch(action: InputAction): void`
- `GameController.update(dt: number): void`
- `GameController.restart(): void`

- [ ] **Step 1: Write failing controller tests for start, action dispatch, collision to results, replay reset, and Yang Hang sprint activation.**
- [ ] **Step 2: Run the controller test and confirm the missing-controller failure.**
- [ ] **Step 3: Implement the controller bridge from simulation state to render views and DOM UI.** Update character pose, car swap, camera pull-in, nitro, speed lines, score, energy, and result state from simulation data.
- [ ] **Step 4: Implement local best-score persistence using a namespaced localStorage key and render it on the result screen.**
- [ ] **Step 5: Run the full unit suite and `npm run build`; commit.** `git add src/game src/main.ts src/render/app tests/game && git commit -m "feat: wire playable runner loop"`

### Task 7: Browser playtest and responsive polish

**Files:**
- Create: `playwright.config.ts`
- Create: `tests/e2e/runner.spec.ts`
- Modify: `src/styles.css` and any files required by test findings.

- [ ] **Step 1: Start Vite and run the browser smoke test at 390x844.** Assert the character menu, start action, HUD, and canvas are visible.
- [ ] **Step 2: Exercise keyboard fallback and capture screenshots after lane change, jump, collision, and Yang Hang sprint.**
- [ ] **Step 3: Exercise touch input in a mobile emulation context and verify page scrolling stays disabled during gestures.**
- [ ] **Step 4: Repeat at 844x390 and 1440x900; fix safe-area, HUD overlap, camera framing, and nonblank canvas issues.**
- [ ] **Step 5: Run final verification.** `npm test && npm run build && npx playwright test`
- [ ] **Step 6: Commit the verified result.** `git add . && git commit -m "test: verify mobile 3d runner"`
