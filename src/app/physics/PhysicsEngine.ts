import { Edge } from './Edge';
import { Point } from './Point';
import { Vector } from './Vector';

export class PhysicsEngine {
  edges: Edge[];
  points: Point[];

  constructor(
    public gravity: Vector = new Vector(0, 0.98)
  ) {
    this.edges = [];
    this.points = [];
  }

  update(delta: number, width: number, height: number) {
    this.edges.forEach(edge => {
      edge.resolve();
    });
    this.points.forEach(point => {
      point.addForce(this.gravity);
      point.update(delta);
      point.checkWalls(0, 0, width, height);
    });
  }

  pointsAreConnected(p1: Point, p2: Point): Edge | null {
    return this.edges.find(edge => edge.includes(p1) && edge.includes(p2)) || null;
  }

  addPoint(point: Point) {
    if (this.points.map(({ id }) => id).includes(point.id)) return point;
    else {
      this.points.push(point);
      return point;
    }
  }

  removePoint(point: Point) {
    let i = this.edges.length;
    while (i--) {
      const edge = this.edges[i];
      if (edge.includes(point))
        this.edges.splice(this.edges.indexOf(edge), 1);
    }

    if (this.points.indexOf(point) !== -1)
      this.points.splice(this.points.indexOf(point), 1);
  }
}
