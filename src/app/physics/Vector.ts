export class Vector {
  constructor(
    public x = 0,
    public y = 0
  ) {}

  sub(v: number | Vector) {
    this.x -= typeof v === 'number' ? v : v.x;
    this.y -= typeof v === 'number' ? v : v.y;
    return this;
  }

  add(v: number | Vector) {
    this.x += typeof v === 'number' ? v : v.x;
    this.y += typeof v === 'number' ? v : v.y;
    return this;
  }

  mul(v: number | Vector) {
    this.x *= typeof v === 'number' ? v : v.x;
    this.y *= typeof v === 'number' ? v : v.y;
    return this;
  }

  div(v: number | Vector) {
    this.x /= typeof v === 'number' ? v : v.x;
    this.y /= typeof v === 'number' ? v : v.y;
    return this;
  }

  normalize() {
    const length = this.length();

    if (length > 0) {
      this.x /= length;
      this.y /= length;
    }

    return this;
  }

  length() {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }

  distance(v: Vector) {
    const x = this.x - v.x;
    const y = this.y - v.y;

    return Math.sqrt(x * x + y * y);
  }

  reset() {
    this.x = this.y = 0;
    return this;
  }

  neg() {
    this.x *= -1;
    this.y *= -1;
    return this;
  }

  static add(v1: Vector, v2: number | Vector) {
    return new Vector(
      v1.x + (typeof v2 === 'number' ? v2 : v2.x),
      v1.y + (typeof v2 === 'number' ? v2 : v2.y)
    );
  }

  static sub(v1: Vector, v2: number | Vector) {
    return new Vector(
      v1.x - (typeof v2 === 'number' ? v2 : v2.x),
      v1.y - (typeof v2 === 'number' ? v2 : v2.y)
    );
  }

  static mul(v1: Vector, v2: number | Vector) {
    return new Vector(
      v1.x * (typeof v2 === 'number' ? v2 : v2.x),
      v1.y * (typeof v2 === 'number' ? v2 : v2.y)
    );
  }

  static div(v1: Vector, v2: number | Vector) {
    return new Vector(
      v1.x / (typeof v2 === 'number' ? v2 : v2.x),
      v1.y / (typeof v2 === 'number' ? v2 : v2.y)
    );
  }
}
