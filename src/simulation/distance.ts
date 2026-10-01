export function formatDistance(distance: number): string {
  return `${Math.max(0, Math.round(distance))} m`;
}
