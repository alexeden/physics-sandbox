import { SandboxMode } from './types';
import { Renderer } from './Renderer';
import { PhysicsEngine, Vector, PhysicsUtils, Point, Edge, RigidEdge } from '../physics';
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
  /**
   * When in edit mode, the last selected or created point.
   * Will be used as the origin point when a new edge is created.
   */
  private activePoint: Point | null = null;
  private dragPoint: Point | null = null;

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
      console.log(e.key);
      switch (e.key) {
        case 'Enter':
          this.activePoint = null;
          break;
        case 'e':
          this.mode = SandboxMode.Edit;
          // this.activePoint = null;
          break;
        case 'r':
          this.mode = SandboxMode.Running;
          this.activePoint = null;
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
        if (this.dragPoint) {
          this.dragPoint.X.x += (this.pointer.x - this.dragPoint.X.x) / this.opts.calcsPerFrame;
          this.dragPoint.X.y += (this.pointer.y - this.dragPoint.X.y) / this.opts.calcsPerFrame;
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
    this.engine.points.forEach(point => {
      const isActive = point === this.dragPoint || point === this.activePoint;
      this.renderer.drawPoint(point, point === this.hoveredPoint, isActive);
    });
    const textLines = [
      `Points\t${this.engine.points.length}`,
      `Links\t${this.engine.edges.length}`,
    ];

    textLines.forEach((line, i) =>
      this.renderer.text(line, this.canvas.width - 10, 20 * i + 10, 'end')
    );
    this.renderer.drawPointer(this.pointer, !!this.dragPoint);
  }

  private listen() {
    this.canvas.oncontextmenu = this.handleRightClick.bind(this);
    this.canvas.onclick = this.handleLeftClick.bind(this);
    this.canvas.onmousedown = e => this.hoveredPoint && (this.dragPoint = this.hoveredPoint);
    this.canvas.onmouseup = e => this.dragPoint = null;
    this.canvas.onmousemove = e => {
      const rect = this.canvas.getBoundingClientRect();
      this.pointer.x = e.clientX - rect.left;
      this.pointer.y = e.clientY - rect.top;
      const { point, distance } = PhysicsUtils.closestPoint(this.pointer, this.engine.points);
      this.hoveredPoint = distance < this.opts.pointerRange ? point : null;
    };
  }

  private handleLeftClick(e: MouseEvent) {
    if (this.mode === SandboxMode.Edit) {
      const rect = this.canvas.getBoundingClientRect();
      const clickPoint = new Vector(e.clientX - rect.left, e.clientY - rect.top);
      const { point, distance } = PhysicsUtils.closestPoint(clickPoint, this.engine.points);

      // If an existing point was in range of the click, select it,
      // otherwise, create a a new point at the click event coordinates
      const nextPoint = distance > this.opts.pointerRange
        ? Point[e.shiftKey ? 'fixed' : 'free'](clickPoint.x, clickPoint.y)
        : point;

      this.engine.addPoint(nextPoint);
      if (this.activePoint && !this.engine.pointsAreConnected(this.activePoint, nextPoint)) {
        const link = new RigidEdge(nextPoint, this.activePoint);
        this.engine.edges.push(link);
      }
      this.activePoint = nextPoint;
    }
  }

  private handleRightClick(e: MouseEvent) {
    e.preventDefault();
    const rect = this.canvas.getBoundingClientRect();
    const clickPoint = new Vector(e.clientX - rect.left, e.clientY - rect.top);
    const { point, distance } = PhysicsUtils.closestPoint(clickPoint, this.engine.points);
    this.activePoint = null;
    if (distance < this.opts.pointerRange) {
      this.engine.removePoint(point);
    }
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
