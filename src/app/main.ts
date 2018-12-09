class Vector {
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

class Point {
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


class Link {
  readonly length: number;

  constructor(
    readonly p1: Point,
    readonly p2: Point
  ) {
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

class VerletEngine {
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
      if (this.getClosestPoint()) {
        this.removePoint(this.getClosestPoint());
      }
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
      this.closestPoint = this.getClosestPoint();
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

  getClosestPoint(): Point | null {
    let closest = null;
    let i = this.points.length;
    while (i--) {
      const point = this.points[i];
      if (point.X.distance(this.mouse) < 10) {
        closest = point;
      }
    }
    return closest;
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

class Shape {
  points: Point[] = [];
  links: Link[] = [];
}

class Rectangle extends Shape {
  constructor(
    x: number,
    y: number,
    w: number,
    h: number
  ) {
    super();
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

interface RendererOptions {
  pointSize: number;
  cursorSize: number;
  showStress: boolean;
  linkStressRatio: number;
}

class Renderer {
  private readonly ctx: CanvasRenderingContext2D;
  opts: RendererOptions;

  constructor(
    private readonly canvas: HTMLCanvasElement,
    opts: Partial<RendererOptions> = {}
  ) {
    this.opts = {
      cursorSize: 10,
      pointSize: 4,
      linkStressRatio: 0.15,
      showStress: true,
      ...opts,
    };
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    this.ctx = canvas.getContext('2d')!;
  }

  draw(scene: VerletEngine) {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    if (scene.closestPoint) {
      const { X, fixed } = scene.closestPoint;
      this.ctx.fillStyle = fixed ? '#EDEA2633' : '#ffffff33';
      this.ctx.beginPath();
      this.ctx.arc(X.x, X.y, this.opts.pointSize * 3, 0, Math.PI * 2, false);
      this.ctx.fill();
    }
    scene.links.forEach(con => this.drawLink(con));
    scene.points.forEach(point => this.drawPoint(point));

    if (scene.selectedPoint) {
      const x = scene.selectedPoint.X.x;
      const y = scene.selectedPoint.X.y;
      this.ctx.beginPath();
      this.ctx.arc(x, y, this.opts.pointSize * 3, 0, Math.PI * 2);
      this.ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
      this.ctx.fill();

      this.ctx.beginPath();
      this.ctx.arc(x, y, this.opts.pointSize, 0, Math.PI * 2);
      this.ctx.fillStyle = scene.selectedPoint.fixed ? '#EDEA26' : '#aaa';
      this.ctx.fill();
    }

    if (scene.pointsBeingDrawn.length) {
      const point = scene.pointsBeingDrawn[scene.pointsBeingDrawn.length - 1];

      this.ctx.beginPath();
      this.ctx.arc(point.X.x, point.X.y, this.opts.pointSize * 3, 0, Math.PI * 2);
      this.ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
      this.ctx.fill();

      this.ctx.beginPath();
      this.ctx.arc(point.X.x, point.X.y, this.opts.pointSize, 0, Math.PI * 2);
      this.ctx.fillStyle = '#aaa';
      this.ctx.fill();
    }

    /* Cursor */
    this.ctx.beginPath();
    this.ctx.arc(scene.mouse.x, scene.mouse.y, this.opts.cursorSize, 0, Math.PI * 2);
    if (scene.selectedPoint) {
      this.ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
      this.ctx.fill();
    }
    this.ctx.strokeStyle = 'rgba(255, 255, 255, 1)';
    this.ctx.stroke();
  }

  drawPoint(pt: Point) {
    if (pt.fixed) {
      this.ctx.fillStyle = 'rgba(255,255,255,0.2)';
      this.ctx.beginPath();
      this.ctx.arc(pt.X.x, pt.X.y, this.opts.pointSize * 3, 0, Math.PI * 2, false);
      this.ctx.fill();
    }

    this.ctx.fillStyle = pt.fixed ? '#EDEA26' : '#fff';
    this.ctx.beginPath();
    this.ctx.arc(pt.X.x, pt.X.y, this.opts.pointSize, 0, Math.PI * 2, false);
    this.ctx.fill();
  }

  drawLink(link: Link) {
    if (this.opts.showStress) {
      const diff = link.length - link.p1.X.distance(link.p2.X);
      const per = Math.round(Math.min(Math.abs(diff / (link.length * this.opts.linkStressRatio)), 1) * 255);
      this.ctx.strokeStyle = 'rgba(255, ' + (255 - per) + ', ' + (255 - per) + ', 1)';
    }
    else this.ctx.strokeStyle = 'rgba(255,255,255,0.8)';

    this.ctx.beginPath();
    this.ctx.moveTo(link.p1.X.x, link.p1.X.y);
    this.ctx.lineTo(link.p2.X.x, link.p2.X.y);
    this.ctx.stroke();
  }
}


(() => {

  const canvas = document.getElementById('c') as HTMLCanvasElement;
  const scene = new VerletEngine(canvas);
  const renderer = new Renderer(canvas);
  // canvas.width = window.innerWidth;
  // canvas.height = window.innerHeight;
  // const ctx = canvas.getContext('2d')!;
  const p1 = scene.addPoint(90, 40, false);
  const p2 = scene.addPoint(160, 40, false);
  const p3 = scene.addPoint(90, 110, false);
  const p4 = scene.addPoint(160, 110, false);
  const p5 = scene.addPoint(90, 180, false);
  const p6 = scene.addPoint(160, 180, false);
  const p7 = scene.addPoint(90, 250, false);
  const p8 = scene.addPoint(160, 250, false);
  const p9 = scene.addPoint(90, 320, true);
  const p10 = scene.addPoint(160, 320, true);
  const p11 = scene.addPoint(300, 40, false);
  const p12 = scene.addPoint(365, 198, false);
  const p13 = scene.addPoint(345, 218, false);
  const p14 = scene.addPoint(385, 218, false);

  scene.addLink(p1, p2);
  scene.addLink(p3, p4);
  scene.addLink(p5, p6);
  scene.addLink(p7, p8);
  scene.addLink(p1, p3);
  scene.addLink(p3, p5);
  scene.addLink(p5, p7);
  scene.addLink(p7, p9);
  scene.addLink(p2, p4);
  scene.addLink(p4, p6);
  scene.addLink(p6, p8);
  scene.addLink(p8, p10);
  scene.addLink(p1, p4);
  scene.addLink(p2, p3);
  scene.addLink(p3, p6);
  scene.addLink(p4, p5);
  scene.addLink(p5, p8);
  scene.addLink(p6, p7);
  scene.addLink(p7, p10);
  scene.addLink(p8, p9);
  scene.addLink(p2, p11);
  scene.addLink(p4, p11);
  scene.addLink(p11, p12);
  scene.addLink(p12, p13);
  scene.addLink(p12, p14);
  scene.addLink(p13, p14);
  scene.addShape(new Rectangle(500, 70, 70, 70));
  const square = new Rectangle(630, 70, 50, 50);
  square.points[1].fixed = true;
  scene.addShape(square);


  const Loop = () => {
    scene.update(24);
    renderer.draw(scene);
    // scene.draw(ctx);
    window.requestAnimationFrame(Loop);
  };

  Loop();
})();
