import { tickAbility } from "./abilities";
import { updateDifficulty } from "./difficulty";
import type { InputAction, Lane, RunState } from "./types";

const LANES: Lane[] = [-1, 0, 1];
const GRAVITY = 20;
const JUMP_SPEED = 8;
const SLIDE_DURATION = 0.72;

export function createRunState(characterId: string): RunState {
  return {
    characterId,
    phase: "running",
    lane: 0,
    y: 0,
    verticalVelocity: 0,
    isJumping: false,
    isSliding: false,
    slideRemaining: 0,
    distance: 0,
    score: 0,
    speed: 8,
    energy: 0,
    sprintRemaining: 0,
    speedMultiplier: 1,
    nitro: false,
    speedLines: false,
    cameraPull: false,
  };
}

function shiftLane(lane: Lane, amount: -1 | 1): Lane {
  const index = Math.max(0, Math.min(LANES.length - 1, LANES.indexOf(lane) + amount));
  return LANES[index];
}

export function stepRunner(state: RunState, action: InputAction, dt: number): RunState {
  const delta = Math.max(0, Math.min(dt, 0.1));
  let next = tickAbility(state, delta);

  if (action.type === "left") next = { ...next, lane: shiftLane(next.lane, -1) };
  if (action.type === "right") next = { ...next, lane: shiftLane(next.lane, 1) };
  if (action.type === "jump" && !next.isJumping && next.y === 0) {
    next = { ...next, isJumping: true, isSliding: false, slideRemaining: 0, verticalVelocity: JUMP_SPEED };
  }
  if (action.type === "slide" && !next.isJumping && next.y === 0) {
    next = { ...next, isSliding: true, slideRemaining: SLIDE_DURATION };
  }

  const velocity = next.isJumping ? next.verticalVelocity - GRAVITY * delta : 0;
  const y = next.isJumping ? next.y + next.verticalVelocity * delta - (GRAVITY * delta * delta) / 2 : 0;
  const landed = next.isJumping && y <= 0;
  const slideRemaining = next.isSliding ? Math.max(0, next.slideRemaining - delta) : 0;
  const isSliding = slideRemaining > 0;
  const difficulty = updateDifficulty(next.distance);
  const speed = difficulty.speed;
  const distance = next.distance + speed * next.speedMultiplier * delta;

  return {
    ...next,
    y: landed ? 0 : Math.max(0, y),
    verticalVelocity: landed ? 0 : velocity,
    isJumping: landed ? false : next.isJumping,
    isSliding,
    slideRemaining,
    speed,
    distance,
    score: Math.max(0, Math.floor(distance * 10)),
  };
}
