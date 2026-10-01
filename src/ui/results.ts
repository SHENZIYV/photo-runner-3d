import type { RunResult } from "../simulation/types";
import { formatDistance } from "../simulation/distance";

export function showResults(root: HTMLElement, result: RunResult, onReplay: () => void): void {
  root.innerHTML = `
    <section class="result-panel" aria-labelledby="result-title">
      <div class="menu-kicker">RUN COMPLETE</div>
      <h2 id="result-title">跑得漂亮</h2>
      <p class="result-score">${result.score.toLocaleString("zh-CN")}</p>
      <div class="result-grid">
        <span>距离<strong>${formatDistance(result.distance)}</strong></span>
        <span>最高分<strong>${result.bestScore.toLocaleString("zh-CN")}</strong></span>
      </div>
      <button class="primary-button" data-replay type="button">再跑一次 <span>↗</span></button>
    </section>
  `;
  root.querySelector<HTMLButtonElement>("[data-replay]")?.addEventListener("click", onReplay);
}
