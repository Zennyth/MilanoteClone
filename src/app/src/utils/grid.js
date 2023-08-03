export function snapValueToGrid(val, gridSize) {
  return gridSize * Math.round(val / gridSize)
}