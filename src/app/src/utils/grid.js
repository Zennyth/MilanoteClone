export function snapValueToGrid(val, gridSize) {
  var snap_candidate = gridSize * Math.round(val / gridSize)
  if (val - snap_candidate < 2) {
    return snap_candidate
  } else {
    return null
  }
}