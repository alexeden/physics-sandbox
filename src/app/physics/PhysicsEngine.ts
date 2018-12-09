import { Link } from './Link';
import { Point } from './Point';
import { Vector } from './Vector';

export class PhysicsEngine {
  links: Link[];
  points: Point[];

  constructor(
    public gravity: Vector = new Vector(0, 0.98)
  ) {
    this.links = [];
    this.points = [];
  }

  update(delta: number, width: number, height: number) {
    this.points.forEach(point => {
      point.addForce(this.gravity);
      point.update(delta);
      point.checkWalls(0, 0, width, height);
    });

    this.links.forEach(link => {
      link.resolve();
    });
  }

  removePoint(point: Point) {
    let i = this.links.length;
    while (i--) {
      const link = this.links[i];
      if (link.includes(point))
        this.links.splice(this.links.indexOf(link), 1);
    }

    if (this.points.indexOf(point) !== -1)
      this.points.splice(this.points.indexOf(point), 1);
  }
}
