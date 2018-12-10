import { Point } from '../physics';
import { Shape } from './Shape';

export class Rectangle extends Shape {
  constructor(
    x: number,
    y: number,
    w: number,
    h: number
  ) {
    super();
    const p1 = Point.free(x, y);
    const p2 = Point.free(x + w, y);
    const p3 = Point.free(x, y + h);
    const p4 = Point.free(x + w, y + h);

    this.points.push(p1, p2, p3, p4);
    this.connect(p1, p2)
        .connect(p2, p3)
        .connect(p3, p4)
        .connect(p4, p1)
        .connect(p1, p3)
        .connect(p2, p4);
  }
}
