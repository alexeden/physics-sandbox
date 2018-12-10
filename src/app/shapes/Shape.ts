import { RigidEdge, Point, SpringEdge } from '../physics';

export class Shape {
  readonly edges: RigidEdge[] = [];
  readonly points: Point[] = [];

  addPoint(x: number, y: number): Point {
    const point = Point.free(x, y);
    this.points.push(point);
    return point;
  }

  addFixedPoint(x: number, y: number): Point {
    const point = Point.fixed(x, y);
    this.points.push(point);
    return point;
  }

  connect(p1: Point, p2: Point): this {
    this.edges.push(new RigidEdge(p1, p2));
    return this;
  }

  spring(p1: Point, p2: Point, k?: number): this {
    this.edges.push(new SpringEdge(p1, p2, k));
    return this;
  }
}
