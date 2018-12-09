import { Vector } from './Vector';

export class Point {
  readonly X: Vector;
  readonly X0: Vector;
  readonly A: Vector;

  constructor(
    public x: number,
    public y: number,
    public fixed = false
  ) {
    this.X = new Vector(x, y);
    this.X0 = new Vector(x, y);
    this.A = new Vector();
  }

  move(v: Vector) {
    if (this.fixed) return;
    this.X.add(v);
  }

  addForce(v: Vector) {
    if (this.fixed) return;
    this.A.add(v);
  }

  update(delta: number) {
    if (this.fixed) return;
    const { x, y } = this.X;
    this.A.mul(delta * delta);
    this.X.x += x - this.X0.x + this.A.x;
    this.X.y += y - this.X0.y + this.A.y;
    this.A.reset();
    this.X0.x = x;
    this.X0.y = y;
  }

  checkWalls(x: number, y: number, w: number, h: number) {
    if (this.fixed) return;

    this.X.x = Math.max(x + 1, Math.min(w - 1, this.X.x));
    this.X.y = Math.max(y + 1, Math.min(h - 1, this.X.y));

    if (this.X.y >= h - 1) {
      this.X.x -= (this.X.x - this.X0.x + this.A.x);
    }
  }
}
