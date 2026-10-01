import { CHARACTERS } from "../render/characters/characterManifest";

export function showCharacterMenu(root: HTMLElement, onStart: (characterId: string) => void): void {
  root.innerHTML = `
    <section class="menu-panel" aria-labelledby="menu-title">
      <div class="menu-kicker">PHOTO RUNNER 3D · NIGHT CIRCUIT</div>
      <h1 id="menu-title">夜航跑道</h1>
      <p class="menu-copy">选一位跑者，穿过霓虹、障碍和不断加速的夜色。</p>
      <div class="character-grid">
        ${CHARACTERS.map((character, index) => `
          <button class="character-card${index === 0 ? " is-selected" : ""}" data-character="${character.id}" style="--accent: ${character.accent}" type="button">
            <img src="${character.imagePath}" alt="${character.name}" />
            <span class="character-card__meta"><strong>${character.name}</strong><small>${character.tagline}</small></span>
          </button>
        `).join("")}
      </div>
      <button class="primary-button" data-start type="button">开始跑酷 <span>→</span></button>
      <p class="menu-hint">滑动换道 · 上滑跳跃 · 下滑滑铲</p>
    </section>
  `;

  let selected = CHARACTERS[0].id;
  const cards = Array.from(root.querySelectorAll<HTMLButtonElement>("[data-character]"));
  cards.forEach((card) => {
    card.addEventListener("click", () => {
      selected = card.dataset.character ?? selected;
      cards.forEach((candidate) => candidate.classList.toggle("is-selected", candidate === card));
    });
  });
  root.querySelector<HTMLButtonElement>("[data-start]")?.addEventListener("click", () => onStart(selected));
}
