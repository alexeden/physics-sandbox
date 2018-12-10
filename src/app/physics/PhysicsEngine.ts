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
    this.points.forEach(point => {
      point.addForce(this.gravity);
      point.update(delta);
      point.checkWalls(0, 0, width, height);
    });

    this.edges.forEach(edge => {
      edge.resolve();
    });
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
