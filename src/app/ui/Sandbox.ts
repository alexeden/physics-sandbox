import { SandboxMode } from './types';
import { Renderer } from './Renderer';
import { PhysicsEngine, Vector, PhysicsUtils, Point, Link } from '../physics';
import { Shape } from '../shapes/Shape';

export interface SandboxOptions {
  pointerRange: number;
  calcsPerFrame: number;
}

export class Sandbox {
  private readonly renderer: Renderer;
  private readonly engine: PhysicsEngine;
  readonly opts: SandboxOptions;
  mode = SandboxMode.Running;
  private pointer = new Vector();
  private hoveredPoint: Point | null = null;
  private activePoint: Point | null = null;
  private pendingPoints: Point[] = [];

  constructor(
    readonly canvas: HTMLCanvasElement,
    opts: Partial<SandboxOptions> = {}
  ) {
    this.opts = {
      calcsPerFrame: 24,
      pointerRange: 10,
      ...opts,
    };
    this.renderer = new Renderer(this.canvas);
    this.engine = new PhysicsEngine();
    this.listen();
    document.onkeypress = e => {
      switch (e.key) {
        case 'e':
          this.mode = SandboxMode.Edit;
          this.pendingPoints = [];
          break;
        case 'r':
          this.mode = SandboxMode.Running;
          this.pendingPoints = [];
          break;
      }
    };
  }

  run() {
    this.mode = SandboxMode.Running;
    this.loop();
  }

  private loop() {
    if (this.mode === SandboxMode.Running) {
      let calcs = this.opts.calcsPerFrame;
      const delta = 1 / calcs;
      while (calcs--) {
        if (this.activePoint) {
          this.activePoint.X.x += (this.pointer.x - this.activePoint.X.x) / this.opts.calcsPerFrame;
          this.activePoint.X.y += (this.pointer.y - this.activePoint.X.y) / this.opts.calcsPerFrame;
        }
        this.engine.update(delta, this.canvas.width, this.canvas.height);
      }
    }
    this.render();
    window.requestAnimationFrame(this.loop.bind(this));
  }

  private render() {
    this.renderer.clear();
    this.engine.links.forEach(con => this.renderer.drawLink(con));
    const lastPendingPoint = this.pendingPoints.slice(-1)[0];
    this.engine.points.forEach(point => {
      const isActive = point === this.activePoint || point === lastPendingPoint;
      this.renderer.drawPoint(point, point === this.hoveredPoint, isActive);
    });
    this.renderer.drawPointer(this.pointer, !!this.activePoint);
  }

  private listen() {
    this.canvas.oncontextmenu = e => {
      e.preventDefault();
      const rect = this.canvas.getBoundingClientRect();
      const clickPoint = new Vector(e.clientX - rect.left, e.clientY - rect.top);
      const { point, distance } = PhysicsUtils.closestPoint(clickPoint, this.engine.points);

      if (distance < this.opts.pointerRange) {
        this.engine.removePoint(point);
      }
    };

    this.canvas.onclick = e => {
      if (this.mode === SandboxMode.Edit) {
        const rect = this.canvas.getBoundingClientRect();
        const clickPoint = new Vector(e.clientX - rect.left, e.clientY - rect.top);
        const { point, distance } = PhysicsUtils.closestPoint(clickPoint, this.engine.points.concat(this.pendingPoints));

        const p = distance > this.opts.pointerRange
          ? Point[e.shiftKey ? 'fixed' : 'free'](clickPoint.x, clickPoint.y)
          : point;

        if (p !== point) this.engine.points.push(p);

        if (this.pendingPoints.length) {
          const c = new Link(p, this.pendingPoints.slice(-1)[0]);
          this.engine.links.push(c);
        }

        this.pendingPoints.push(p);
      }
    };

    this.canvas.onmousedown = e => this.hoveredPoint && (this.activePoint = this.hoveredPoint);
    this.canvas.onmouseup = e => this.activePoint = null;
    this.canvas.onmousemove = e => {
      const rect = this.canvas.getBoundingClientRect();
      this.pointer.x = e.clientX - rect.left;
      this.pointer.y = e.clientY - rect.top;
      const { point, distance } = PhysicsUtils.closestPoint(this.pointer, this.engine.points);
      this.hoveredPoint = distance < this.opts.pointerRange ? point : null;
    };
  }

  addShape(shape: Shape) {
    this.engine.points.push(...shape.points);
    this.engine.links.push(...shape.links);
  }

  setHeight(h: number) {
    this.canvas.height = h;
    return this;
  }

  setWidth(w: number) {
    this.canvas.width = w;
    return this;
  }
}
