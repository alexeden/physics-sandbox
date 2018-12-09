import { Link } from './Link';
import { Point } from './Point';
import { Vector } from './Vector';
import { PhysicsUtils } from './PhysicsUtils';

export class PhysicsEngine {
  width: number;
  height: number;

  links: Link[];
  points: Point[];
  selectedPoint: Point | null = null;
  // closestPoint: Point | null = null;
  // pointsBeingDrawn: Point[];
  // pointer: Vector;
  // editMode = false;

  constructor(
    readonly canvas: HTMLCanvasElement,
    public gravity: Vector = new Vector(0, 0.98)
  ) {
    this.canvas = canvas;

    this.width = canvas.width;
    this.height = canvas.height;

    this.links = [];
    this.points = [];
    // this.pointsBeingDrawn = [];

    // this.pointer = new Vector();

    // document.onkeypress = e => {
    //   switch (e.key) {
    //     case 'e':
    //       this.editMode = !this.editMode;
    //       this.pointsBeingDrawn = this.editMode ? this.pointsBeingDrawn : [];
    //   }
    // };

    // canvas.oncontextmenu = e => {
    //   e.preventDefault();
    //   if (this.closestPoint) this.removePoint(this.closestPoint);
    // };
    // canvas.onclick = e => {
    //   if (this.editMode) {
    //     const rect = this.canvas.getBoundingClientRect();
    //     this.pointer.x = e.clientX - rect.left;
    //     this.pointer.y = e.clientY - rect.top;

    //     let p = this.closestPoint;

    //     if (!p) {
    //       p = Point[e.shiftKey ? 'fixed' : 'free'](this.pointer.x, this.pointer.y);
    //       this.points.push(p);
    //     }

    //     if (this.pointsBeingDrawn.length) {
    //       const c = new Link(p, this.pointsBeingDrawn[this.pointsBeingDrawn.length - 1]);
    //       this.links.push(c);
    //     }

    //     this.pointsBeingDrawn.push(p);
    //   }
    // };

    // canvas.onmousedown = e => {
    //   if (this.closestPoint) {
    //     this.selectedPoint = this.closestPoint;
    //   }
    // };

    // canvas.onmouseup = e => {
    //   this.selectedPoint = null;
    // };

    // canvas.onmousemove = e => {
    //   const rect = this.canvas.getBoundingClientRect();
    //   this.pointer.x = e.clientX - rect.left;
    //   this.pointer.y = e.clientY - rect.top;
    //   const { point, distance } = PhysicsUtils.closestPoint(this.pointer, this.points);
    //   this.closestPoint = distance < 10 ? point : null;
    // };
  }

  update(iter: number) {
    // if (this.editMode) return;

    const delta = 1 / iter;
    while (iter--) {
      // if (this.selectedPoint) {
      //   this.selectedPoint.X.x += (this.pointer.x - this.selectedPoint.X.x) / iter;
      //   this.selectedPoint.X.y += (this.pointer.y - this.selectedPoint.X.y) / iter;
      // }

      this.points.forEach(point => {
        point.addForce(this.gravity);
        point.update(delta);
        point.checkWalls(0, 0, this.width, this.height);
      });

      this.links.forEach(link => {
        link.resolve();
      });
    }
  }

  removePoint(point: Point) {
    const pointIndex = this.points.indexOf(point);
    if (pointIndex >= 0) this.points.splice(pointIndex, 1);

    this.links.forEach(link => {
      if (link.includes(point)) {
        this.links.splice(this.links.indexOf(link), 1);
      }
    });
  }
}
