import type { RunState } from "./types";

export interface AbilityState {
  energy: number;
  sprintRemaining: number;
  speedMultiplier: number;
  nitro: boolean;
  speedLines: boolean;
  cameraPull: boolean;
}

export function createAbilityState(state: RunState): AbilityState {
  if (state.sprintRemaining <= 0) {
    return {
      energy: Math.max(0, Math.min(100, state.energy)),
      sprintRemaining: 0,
      speedMultiplier: 1,
      nitro: false,
      speedLines: false,
      cameraPull: false,
    };
  }

  return {
    energy: Math.max(0, Math.min(100, state.energy)),
    sprintRemaining: state.sprintRemaining,
    speedMultiplier: 2.2,
    nitro: true,
    speedLines: true,
    cameraPull: true,
  };
}

export function addEnergy(state: RunState, amount: number): RunState {
  return { ...state, energy: Math.max(0, Math.min(100, state.energy + amount)) };
}

export function activateAbility(state: RunState): RunState {
  if (state.characterId !== "yang-hang" || state.energy < 100 || state.sprintRemaining > 0) {
    return state;
  }

  return {
    ...state,
    energy: 0,
    sprintRemaining: 4,
    speedMultiplier: 2.2,
    nitro: true,
    speedLines: true,
    cameraPull: true,
  };
}

export function tickAbility(state: RunState, dt: number): RunState {
  if (state.sprintRemaining <= 0) {
    return createAbilityState(state).speedMultiplier === state.speedMultiplier
      ? state
      : { ...state, ...createAbilityState(state) };
  }

  const remaining = Math.max(0, state.sprintRemaining - Math.max(0, dt));
  const next = { ...state, sprintRemaining: remaining };
  return remaining === 0 ? { ...next, ...createAbilityState({ ...next, sprintRemaining: 0 }) } : next;
}
