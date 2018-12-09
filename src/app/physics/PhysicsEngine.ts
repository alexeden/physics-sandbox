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

  update(iter: number, width: number, height: number) {
    const delta = 1 / iter;
    while (iter--) {
      // if (this.selectedPoint) {
      //   this.selectedPoint.X.x += (this.pointer.x - this.selectedPoint.X.x) / iter;
      //   this.selectedPoint.X.y += (this.pointer.y - this.selectedPoint.X.y) / iter;
      // }

      this.points.forEach(point => {
        point.addForce(this.gravity);
        point.update(delta);
        point.checkWalls(0, 0, width, height);
      });

      this.links.forEach(link => {
        link.resolve();
      });
    }
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
