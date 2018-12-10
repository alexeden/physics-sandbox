import { Point } from './Point';
import { Vector } from './Vector';

const newId = (() => {
  let id = 0;
  return () => id++;
})();

export class Edge {
  readonly length: number;
  readonly id: number;

  constructor(
    readonly p1: Point,
    readonly p2: Point
  ) {
    this.id = newId();
    this.length = this.p1.X.distance(p2.X);
  }

  includes(p: Point) {
    return p === this.p1 || p === this.p2;
  }

  resolve() {
    const connector = Vector.sub(this.p2.X, this.p1.X);
    const diff = connector.length() - this.length;
    connector.normalize();
    const f = connector.mul(diff * 0.5);
    this.p1.move(f);
    this.p2.move(f.neg());
  }
}