export function snapValueToGrid(val: number, gridSize: number): number {
  return gridSize * Math.round(val / gridSize)
}