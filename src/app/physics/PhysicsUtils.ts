import { Point } from './Point';
import { Vector } from './Vector';

interface ClosestPoint {
  point: Point;
  distance: number;
}

export class PhysicsUtils {
  static closestPoint(v: Vector, pts: Point[]): ClosestPoint {
    if (pts.length < 1) throw new Error(`No points provided!`);

    return pts.reduce(
      (closest, point) => {
        const d = point.X.distance(v);
        return d < closest.distance
          ? { point, distance: d }
          : closest;
      },
      { point: null as any, distance: Infinity }
    );
  }
}
