# 3D Photo Runner Design

## Goal

Build a mobile-friendly browser endless runner in which two supplied multi-angle character references represent selectable playable characters. The game uses a real 3D track, camera, lighting, obstacles, and character meshes. It runs in a normal mobile browser without a native app install.

The first character is Yang Hang, represented by `0bddcb6a916be752b92c31f67ee38c0d.jpg`. Yang Hang has a unique full-energy ability: he mounts a stylized open-wheel F1-style car and performs a short high-speed sprint with nitro flames, speed lines, and a closer chase camera.

## Scope and assumptions

- Runtime: vanilla Three.js, TypeScript, and Vite.
- View: third-person chase camera looking down a three-lane 3D track.
- The world uses a compact night campus/city circuit so the track reads clearly on phone screens.
- Characters are complete rotatable low-poly meshes assembled from reusable body parts and photo-based face, hair, glasses, and clothing textures. This keeps the characters real 3D objects while avoiding an unreliable automatic full-body scan.
- The first version ships with local best score only. No account, server, or external photo upload is required.
- The second character is selectable and playable with the shared movement kit; unique abilities remain future extension points.

## Player loop

1. Character select shows two photo-backed 3D character previews.
2. The selected character starts running automatically.
3. The player changes lanes, jumps, and slides to avoid obstacles and collect energy.
4. Distance increases score. Near misses and energy pickups increase the energy meter.
5. When Yang Hang reaches full energy, the player taps the ability button to enter F1 sprint.
6. F1 sprint temporarily increases speed, pulls the camera closer, adds nitro exhaust and speed-line FX, and lets the car clear small obstacles.
7. A collision ends the run. The result screen shows distance, score, ability use, and a replay action.

## Input map

| Action | Touch | Keyboard fallback |
| --- | --- | --- |
| Move left/right | Swipe horizontally or tap left/right zones | Arrow keys / A-D |
| Jump | Swipe up or tap jump zone | Space / ArrowUp |
| Slide | Swipe down or tap slide zone | ArrowDown / S |
| Yang Hang ability | Tap the full energy button | E |
| Pause | Tap pause chip | Escape |

Touch zones are DOM controls layered over the canvas and respect safe-area insets. A swipe is recognized once per gesture and does not scroll the page while the game is active.

## Architecture

Simulation is independent of Three.js objects.

### Simulation modules

- `simulation/gameState.ts`: serializable run state, phase, selected character, score, distance, energy, lane, vertical action, and sprint timer.
- `simulation/runner.ts`: deterministic auto-runner movement, lane changes, jump arc, slide window, and collision bounds.
- `simulation/spawner.ts`: seeded obstacle and energy pickup schedule with recycle-friendly entity IDs.
- `simulation/difficulty.ts`: distance-based speed, spawn gap, and obstacle mix curve.
- `simulation/abilities.ts`: character ability contracts; Yang Hang's F1 sprint is the first implementation.

### Render modules

- `render/app/`: renderer, scene, camera, resize, animation loop, and WebGL context recovery.
- `render/characters/`: character mesh factory, photo texture composition, animation poses, and F1 car attachment.
- `render/world/`: reusable track segments, lane markers, campus/city backdrop, obstacle meshes, and pickups.
- `render/fx/`: nitro flames, speed lines, lane-change trails, and impact feedback.
- `render/loaders/`: texture and optional GLTF loading behind stable manifest keys.

### UI modules

- `ui/menu.ts`: character selection and start flow.
- `ui/hud.ts`: score, distance, energy, pause, and ability button.
- `ui/touchControls.ts`: mobile gestures and touch zones.
- `ui/results.ts`: game-over results and replay.

DOM owns text, controls, menus, and accessibility-sensitive actions. Three.js owns the playfield and visual feedback.

## Character and photo asset strategy

The two supplied characters have stable manifest keys and reference sheets under `public/assets/characters/reference/`. The runtime first attempts to load `yang-hang.glb` or `runner-02.glb` with Meshopt decoding; until those Blender exports exist, it uses a programmatic 3D fallback and keeps the JPG menu portraits. Each character is one `THREE.Group` with explicit pivots so it can rotate and animate without changing simulation state.

Yang Hang's F1 state swaps the runner body for a reusable open-wheel car group, keeps the face portrait visible above the cockpit, and attaches an exhaust emitter and speed-line rig. The car is a generic open-wheel shape with no real team branding.

## Camera and presentation

The normal camera is a restrained third-person chase camera with a slight side offset so lane changes remain readable. During F1 sprint it moves closer, increases look-ahead, and eases back when the ability ends. The track center and lower-middle area remain clear of persistent UI. Lighting uses an ambient fill, a warm key, and cool rim lights so the photo textures remain readable without expensive post-processing.

## Performance and mobile constraints

- Cap device pixel ratio at 1.5 on mobile and 2 on desktop.
- Recycle track, obstacle, pickup, and FX instances instead of creating them per frame.
- Keep character meshes low-poly and photo atlases at a practical mobile resolution.
- Avoid mandatory bloom or heavy physics; collisions use simulation bounds with simple spatial checks.
- Pause the animation loop when the page is hidden and recover from WebGL context loss where possible.

## Open-source references

The implementation follows publicly documented patterns from:

- [misterpaul4/Demon-Runner](https://github.com/misterpaul4/Demon-Runner): Phaser 3 + TypeScript scene separation, distance-based difficulty, mobile jump/fast-fall controls, and local-first scoring.
- [zackproser/CanyonRunner](https://github.com/zackproser/CanyonRunner): horizontal runner camera flow and recycled world segments.
- [jcy2704/endless-forest](https://github.com/jcy2704/endless-forest): explicit jump/attack/drop action mapping and reusable endless-runner scene structure.

These repositories are references only. No source code or third-party artwork is copied into this project.

## Verification

- `npm run build` must complete without TypeScript errors.
- Browser smoke test: start screen, character selection, run, lane change, jump, slide, collision, replay.
- Yang Hang test: collect energy to full, activate F1 sprint, confirm car swap, nitro, speed lines, camera pull-in, timer expiry, and energy reset.
- Mobile viewport checks at 390x844 and 844x390, plus desktop 1440x900.
- Screenshot review confirms readable character faces, no HUD overlap with the track, and a nonblank WebGL canvas.
