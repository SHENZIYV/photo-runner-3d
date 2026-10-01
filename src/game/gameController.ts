import { activateAbility, addEnergy } from "../simulation/abilities";
import { createRunState, stepRunner } from "../simulation/runner";
import type { InputAction, RunResult, RunState } from "../simulation/types";

export interface RenderBridge {
  sync(state: RunState, dt: number): boolean | void;
  reset?(characterId: string): void;
}

export interface GameDependencies {
  render: RenderBridge;
  onState: (state: RunState) => void;
  onResult: (result: RunResult) => void;
  loadBestScore: () => number;
  saveBestScore: (score: number) => number | void;
}

export interface GameController {
  start(characterId: string): void;
  dispatch(action: InputAction): void;
  update(dt: number): void;
  collectEnergy(amount: number): void;
  collide(): void;
  togglePause(): void;
  restart(): void;
  getState(): RunState;
}

export function createGameController(deps: GameDependencies): GameController {
  let state = createRunState("yang-hang");
  let pendingAction: InputAction = { type: "none" };

  const publish = () => deps.onState({ ...state });

  return {
    start(characterId) {
      state = createRunState(characterId);
      pendingAction = { type: "none" };
      deps.render.reset?.(characterId);
      publish();
    },
    dispatch(action) {
      if (action.type === "pause") {
        if (state.phase === "running") state = { ...state, phase: "paused" };
        else if (state.phase === "paused") state = { ...state, phase: "running" };
        publish();
        return;
      }
      if (state.phase !== "running") return;
      if (action.type === "ability") {
        state = activateAbility(state);
        deps.render.sync(state, 0);
        publish();
        return;
      }
      pendingAction = action;
    },
    update(dt) {
      if (state.phase !== "running") return;
      state = stepRunner(state, pendingAction, dt);
      pendingAction = { type: "none" };
      if (deps.render.sync(state, dt)) {
        state = { ...state, phase: "gameover" };
        const savedBest = deps.saveBestScore(state.score);
        deps.onResult({
          characterId: state.characterId,
          distance: state.distance,
          score: state.score,
          bestScore: savedBest ?? Math.max(deps.loadBestScore(), state.score),
        });
      }
      publish();
    },
    collectEnergy(amount) {
      if (state.phase !== "running") return;
      state = addEnergy(state, amount);
      deps.render.sync(state, 0);
      publish();
    },
    collide() {
      if (state.phase !== "running") return;
      state = { ...state, phase: "gameover" };
      const savedBest = deps.saveBestScore(state.score);
      deps.onResult({
        characterId: state.characterId,
        distance: state.distance,
        score: state.score,
        bestScore: savedBest ?? Math.max(deps.loadBestScore(), state.score),
      });
      publish();
    },
    togglePause() {
      if (state.phase === "running") state = { ...state, phase: "paused" };
      else if (state.phase === "paused") state = { ...state, phase: "running" };
      publish();
    },
    restart() {
      this.start(state.characterId);
    },
    getState() {
      return { ...state };
    },
  };
}
