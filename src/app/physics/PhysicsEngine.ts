import { Link } from './Link';
import { Point } from './Point';
import { Vector } from './Vector';
import { Shape } from './types';
import { PhysicsUtils } from './PhysicsUtils';

export class PhysicsEngine {
  readonly ctx: CanvasRenderingContext2D;
  width: number;
  height: number;

  links: Link[];
  points: Point[];
  selectedPoint: Point | null = null;
  closestPoint: Point | null = null;
  pointsBeingDrawn: Point[];
  mouse: Vector;
  editMode = false;

  constructor(
    readonly canvas: HTMLCanvasElement,
    public gravity: Vector = new Vector(0, 0.98)
  ) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d')!;
    this.ctx.lineWidth = 1;

    this.width = canvas.width;
    this.height = canvas.height;

    this.links = [];
    this.points = [];
    this.pointsBeingDrawn = [];

    this.mouse = new Vector();

    document.onkeypress = e => {
      switch (e.key) {
        case 'e':
          this.editMode = !this.editMode;
          this.pointsBeingDrawn = this.editMode ? this.pointsBeingDrawn : [];
      }
    };

    canvas.oncontextmenu = e => {
      e.preventDefault();
      if (this.closestPoint) this.removePoint(this.closestPoint);
    };
    canvas.onclick = e => {
      if (this.editMode) {
        const rect = this.canvas.getBoundingClientRect();
        this.mouse.x = e.clientX - rect.left;
        this.mouse.y = e.clientY - rect.top;

        let p = this.closestPoint;

        if (!p) {
          p = new Point(this.mouse.x, this.mouse.y, e.shiftKey);
          this.points.push(p);
        }

        if (this.pointsBeingDrawn.length) {
          const c = new Link(p, this.pointsBeingDrawn[this.pointsBeingDrawn.length - 1]);
          this.links.push(c);
        }

        this.pointsBeingDrawn.push(p);
      }
    };

    canvas.onmousedown = e => {
      if (this.closestPoint) {
        this.selectedPoint = this.closestPoint;
      }
    };

    canvas.onmouseup = e => {
      this.selectedPoint = null;
    };

    canvas.onmousemove = e => {
      const rect = this.canvas.getBoundingClientRect();
      this.mouse.x = e.clientX - rect.left;
      this.mouse.y = e.clientY - rect.top;
      const { point, distance } = PhysicsUtils.closestPoint(this.mouse, this.points);
      this.closestPoint = distance < 10 ? point : null;
    };
  }

  update(iter = 6) {
    if (this.editMode) return;

    const delta = 1 / iter;
    let n = iter;
    while (n--) {
      if (this.selectedPoint) {
        this.selectedPoint.X.x += (this.mouse.x - this.selectedPoint.X.x) / iter;
        this.selectedPoint.X.y += (this.mouse.y - this.selectedPoint.X.y) / iter;
      }

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

  removePoint(point: Point | null) {
    if (!point) return;

    let i = this.links.length;
    while (i--) {
      const link = this.links[i];
      if (link.includes(point))
        this.links.splice(this.links.indexOf(link), 1);
    }

    if (this.points.indexOf(point) !== -1)
      this.points.splice(this.points.indexOf(point), 1);
  }

  addPoint(x: number, y: number, fixed: boolean) {
    const point = new Point(x, y, fixed);
    this.points.push(point);
    return point;
  }

  addLink(p1: Point, p2: Point) {
    this.links.push(new Link(p1, p2));
  }

  addShape(shape: Shape) {
    this.points.push(...shape.points);
    this.links.push(...shape.links);
  }
}
