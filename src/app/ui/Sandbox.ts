import { SandboxMode } from './types';
import { Renderer } from './Renderer';
import { PhysicsEngine, Vector, PhysicsUtils, Point, Edge } from '../physics';
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
    this.engine.edges.forEach(edge => this.renderer.drawEdge(edge));
    const lastPendingPoint = this.pendingPoints.slice(-1)[0];
    this.engine.points.forEach(point => {
      const isActive = point === this.activePoint || point === lastPendingPoint;
      this.renderer.drawPoint(point, point === this.hoveredPoint, isActive);
    });
    const lines = [
      `Points\t${this.engine.points.length}`,
      `Links\t${this.engine.edges.length}`,
      `Pending\t${this.pendingPoints.length}`,
    ];

    lines.forEach((line, i) =>
      this.renderer.text(line, this.canvas.width - 10, 20 * i + 10, 'end')
    );
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

        // If an existing point was in range of the click, select it,
        // otherwise, create a a new point at the click event coordinates
        const activePoint = distance > this.opts.pointerRange
          ? Point[e.shiftKey ? 'fixed' : 'free'](clickPoint.x, clickPoint.y)
          : point;

        const pointIsNew = activePoint !== point;
        // If the active point is new, push it to the engine
        if (pointIsNew) {
          console.log('new point created, pushing to engine');
          this.engine.points.push(activePoint);
        }

        if (pointIsNew && this.pendingPoints.length) {
          const link = new Edge(activePoint, this.pendingPoints.slice(-1)[0]);
          this.engine.edges.push(link);
        }

        this.pendingPoints.push(activePoint);
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
    this.engine.edges.push(...shape.edges);
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
