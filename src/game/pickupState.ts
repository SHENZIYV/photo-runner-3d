export interface CollectibleState {
  collected: boolean;
}

export function resetCollectibles<T extends CollectibleState>(items: T[]): void {
  items.forEach((item) => {
    item.collected = false;
  });
}
