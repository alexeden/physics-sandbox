import { Point } from './Point';
import { Vector } from './Vector';

const newId = (() => {
  let id = 0;
  return () => id++;
})();

export abstract class Edge {
  constructor(
    readonly p1: Point,
    readonly p2: Point,
    readonly id = newId()
  ) {}

  abstract resolve(): void;

  includes(p: Point) {
    return p === this.p1 || p === this.p2;
  }

  center(): Vector {
    return Vector.sub(this.p2.X, this.p1.X).div(2).add(this.p1.X);
  }
}


export class RigidEdge extends Edge {
  readonly length: number;

  constructor(
    readonly p1: Point,
    readonly p2: Point
  ) {
    super(p1, p2);
    this.length = this.p1.X.distance(p2.X);
  }

  resolve() {
    const connector = Vector.sub(this.p2.X, this.p1.X);
    const offset = connector.length() - this.length;
    const correction = connector.normalize().mul(offset * 0.5);
    this.p1.move(correction);
    this.p2.move(correction.neg());
  }
}

export class SpringEdge extends Edge {
  readonly length: number;

  constructor(
    readonly p1: Point,
    readonly p2: Point,
    readonly k = 0.5
  ) {
    super(p1, p2);
    this.length = this.p1.X.distance(p2.X);
  }

  resolve() {
    const connector = Vector.sub(this.p2.X, this.p1.X);
    const offset = connector.length() - this.length;
    const correction = connector.normalize().mul(offset * this.k);
    this.p1.addForce(correction);
    this.p2.addForce(correction.neg());
  }
}
