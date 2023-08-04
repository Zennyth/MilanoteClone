export interface Vector2 {
  x: number
  y: number
}

export interface Shape {
  size: Vector2;
  position: Vector2;
  rotation: number;
}

export interface BoardComponentData extends Shape {
  id: string

  // state
  type: string
  isDraggable: boolean
  isDragged: boolean
  isSelected: boolean
  velocity: Vector2

  [propName: string]: any
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
    rotation: 0,
    type,
    isDraggable: true,
    isDragged: false,
    isSelected: false,
    velocity: { x: 0, y: 0 }
  }
}
