import { formatDistance } from "../simulation/distance";
import type { RunState } from "../simulation/types";

export function renderHud(root: HTMLElement, state: RunState): void {
  root.innerHTML = `
    <div class="hud-top" aria-live="polite">
      <div class="hud-stat"><span>距离</span><strong>${formatDistance(state.distance)}</strong></div>
      <div class="hud-stat"><span>分数</span><strong>${state.score.toLocaleString("zh-CN")}</strong></div>
      <button class="pause-button" data-pause type="button" aria-label="${state.phase === "paused" ? "继续" : "暂停"}">${state.phase === "paused" ? "▶" : "Ⅱ"}</button>
    </div>
    <div class="hud-energy">
      <div class="energy-label"><span>能量</span><strong>${Math.round(state.energy)}%</strong></div>
      <div class="energy-track"><span style="width: ${state.energy}%"></span></div>
      <button class="ability-button${state.energy >= 100 && state.characterId === "yang-hang" ? " is-ready" : ""}" data-action="ability" type="button" ${state.energy >= 100 && state.characterId === "yang-hang" ? "" : "disabled"}>${state.sprintRemaining > 0 ? "氮气冲刺中" : "F1 氮气"}</button>
    </div>
  `;
}
