import { SandboxMode } from './types';
import { Renderer } from './Renderer';
import { PhysicsEngine, Vector, PhysicsUtils, Point, Link } from '../physics';
import { Shape } from '../shapes/Shape';

export class Sandbox {
  private readonly renderer: Renderer;
  private readonly engine: PhysicsEngine;
  mode = SandboxMode.Running;
  private pointer = new Vector();
  private pendingPoints: Point[] = [];

  constructor(
    readonly canvas: HTMLCanvasElement
  ) {
    this.renderer = new Renderer(this.canvas);
    this.engine = new PhysicsEngine(this.canvas);
    this.listen();
    document.onkeypress = e => {
      switch (e.key) {
        case 'e':
          this.mode = SandboxMode.Edit;
          this.pendingPoints = [];
        case 'r':
          this.mode = SandboxMode.Running;
          // this.editMode ? this.pointsBeingDrawn : [];
      }
    };
  }

  run() {
    this.mode = SandboxMode.Running;
    this.loop();
  }

  private loop() {
    this.engine.update(24);
    this.renderer.draw(this.engine);
    window.requestAnimationFrame(this.loop.bind(this));
  }

  private listen() {
    this.canvas.oncontextmenu = e => {
      const rect = this.canvas.getBoundingClientRect();
      const clickPoint = new Vector(e.clientX - rect.left, e.clientY - rect.top);
      const { point, distance } = PhysicsUtils.closestPoint(clickPoint, this.engine.points);

      if (distance < 10) {
        e.preventDefault();
        this.engine.removePoint(point);
      }
    };

    this.canvas.onclick = e => {
      if (this.mode === SandboxMode.Edit) {
        const rect = this.canvas.getBoundingClientRect();
        const clickPoint = new Vector(e.clientX - rect.left, e.clientY - rect.top);
        const { point, distance } = PhysicsUtils.closestPoint(clickPoint, this.engine.points.concat(this.pendingPoints));

        const p = distance > 10
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

    // this.canvas.onmousedown = e => {
    //   if (this.closestPoint) {
    //     this.selectedPoint = this.closestPoint;
    //   }
    // };

    // this.canvas.onmouseup = e => {
    //   this.selectedPoint = null;
    // };

    // this.canvas.onmousemove = e => {
    //   const rect = this.canvas.getBoundingClientRect();
    //   this.pointer.x = e.clientX - rect.left;
    //   this.pointer.y = e.clientY - rect.top;
    //   const { point, distance } = PhysicsUtils.closestPoint(this.pointer, this.points);
    //   this.closestPoint = distance < 10 ? point : null;
    // };
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
