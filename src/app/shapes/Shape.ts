import { Edge, Point } from '../physics';

export class Shape {
  readonly edges: Edge[] = [];
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
    this.edges.push(new Edge(p1, p2));
    return this;
  }
}
