export interface Vector2 {
  x: number
  y: number
}

export interface BoardComponentData {
  id: string

  // css
  position: Vector2
  size: Vector2

  // state
  type: string
  isDraggable: boolean
  isDragged: boolean
  isSelected: boolean
  velocity: Vector2
}

export function createDefaultComponent(
  type: string,
  top: number,
  left: number
): BoardComponentData {
  return {
    id: Date.now().toString(),
    position: { x: left, y: top },
    size: { x: 0, y: 0 },
    type,
    isDraggable: true,
    isDragged: false,
    isSelected: false,
    velocity: { x: 0, y: 0 }
  }
}
