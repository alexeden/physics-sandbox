import { Point, Link, Shape } from '../physics';

export class Rectangle implements Shape {
  points: Point[] = [];
  links: Link[] = [];

  constructor(
    x: number,
    y: number,
    w: number,
    h: number
  ) {
    const p1 = new Point(x, y);
    const p2 = new Point(x + w, y);
    const p3 = new Point(x, y + h);
    const p4 = new Point(x + w, y + h);

    this.points = [p1, p2, p3, p4];

    this.links = [
      new Link(p1, p2),
      new Link(p2, p3),
      new Link(p3, p4),
      new Link(p4, p1),
      new Link(p1, p3),
      new Link(p2, p4),
    ];
  }
}
