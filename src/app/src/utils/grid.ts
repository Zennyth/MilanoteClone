import { Shape } from "@/components/board/types";

export function snapValueToGrid(val: number, gridSize: number): number {
  return gridSize * Math.round(val / gridSize)
}

export function degToRad(angle: number): number {
  return angle / 180 * Math.PI;
}


export function getShapeRect(shape: Shape): Shape {
  const angleRad = degToRad(shape.rotation);
  const x1 = shape.position.x;
  const y1 = shape.position.y;
  const x2 = x1 + shape.size.x * Math.cos(angleRad);
  const y2 = y1 + shape.size.x * Math.sin(angleRad);
  const x3 =
    shape.position.x +
    shape.size.x * Math.cos(angleRad) +
    shape.size.y * Math.sin(-angleRad);
  const y3 =
    shape.position.y +
    shape.size.y * Math.cos(angleRad) +
    shape.size.x * Math.sin(angleRad);
  const x4 = shape.position.x + shape.size.y * Math.sin(-angleRad);
  const y4 = shape.position.y + shape.size.y * Math.cos(angleRad);

  const leftX = Math.min(x1, x2, x3, x4);
  const rightX = Math.max(x1, x2, x3, x4);
  const topY = Math.min(y1, y2, y3, y4);
  const bottomY = Math.max(y1, y2, y3, y4);
  return {
    position: {
      x: leftX,
      y: topY,
    },
    size: {
      x: rightX - leftX,
      y: bottomY - topY,
    },
    rotation: 0
  };
}

export function getBoundingBox(shapes: Array<Shape>): Shape {
  let x1 = 9999999999;
  let y1 = 9999999999;
  let x2 = -999999999;
  let y2 = -999999999;

  shapes.forEach(shape => {
    const rect = shape;

    x1 = Math.min(x1, rect.position.x);
    y1 = Math.min(y1, rect.position.y);
    x2 = Math.max(x2, rect.position.x + rect.size.x);
    y2 = Math.max(y2, rect.position.y + rect.size.y);
  });

  return {
    position: {
      x: x1,
      y: y1,
    },
    size: {
      x: x2 - x1,
      y: y2 - y1,
    },
    rotation: 0
  };
}

export function rectanglesIntersect(r1: Shape, r2: Shape): boolean {
	const aLeftOfB: boolean = r1.position.x + r1.size.x < r2.position.x;
	const aRightOfB: boolean = r1.position.x > r2.position.x + r2.size.x;
	const aBelowB: boolean = r1.position.y + r1.size.y < r2.position.y;
	const aAboveB: boolean = r1.position.y > r2.position.y + r2.size.y;

	return !( aLeftOfB || aRightOfB || aAboveB || aBelowB );
}