import { PhysicsEngine, Link, Point } from '../lib';

export interface RendererOptions {
  pointSize: number;
  cursorSize: number;
  showStress: boolean;
  linkStressRatio: number;
}

export class Renderer {
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

  private fill(fillStyle: string): this {
    this.ctx.fillStyle = fillStyle;
    this.ctx.fill();
    return this;
  }

  private stroke(strokeStyle: string): this {
    this.ctx.strokeStyle = strokeStyle;
    this.ctx.stroke();
    return this;
  }

  private line(x1: number, y1: number, x2: number, y2: number): this {
    this.ctx.beginPath();
    this.ctx.moveTo(x1, y1);
    this.ctx.lineTo(x2, y2);
    return this;
  }

  private circle(x: number, y: number, radius: number): this {
    this.ctx.beginPath();
    this.ctx.arc(x, y, radius, 0, Math.PI * 2, false);
    return this;
  }

  draw(engine: PhysicsEngine) {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    if (engine.closestPoint) {
      const { X, fixed } = engine.closestPoint;
      this.circle(X.x, X.y, 3 * this.opts.pointSize).fill(fixed ? '#EDEA2633' : '#ffffff33');
    }
    engine.links.forEach(con => this.drawLink(con));
    engine.points.forEach(point => this.drawPoint(point));

    if (engine.selectedPoint) {
      const x = engine.selectedPoint.X.x;
      const y = engine.selectedPoint.X.y;
      this.circle(x, y, 3 * this.opts.pointSize).fill('rgba(255, 255, 255, 0.2)');
      this.circle(x, y, this.opts.pointSize).fill(engine.selectedPoint.fixed ? '#EDEA26' : '#aaa');
    }

    if (engine.pointsBeingDrawn.length) {
      const point = engine.pointsBeingDrawn[engine.pointsBeingDrawn.length - 1];
      this.circle(point.X.x, point.X.y, 3 * this.opts.pointSize).fill('rgba(255, 255, 255, 0.2)');
      this.circle(point.X.x, point.X.y, this.opts.pointSize).fill('#aaa');
    }

    /* Cursor */
    this.circle(engine.mouse.x, engine.mouse.y, this.opts.cursorSize).stroke('rgba(255, 255, 255, 1)');
    if (engine.selectedPoint) this.fill('rgba(255, 255, 255, 0.5)');
  }

  drawPoint(pt: Point) {
    this.circle(pt.X.x, pt.X.y, this.opts.pointSize).fill(pt.fixed ? '#EDEA26' : '#fff');
    if (pt.fixed) this.circle(pt.X.x, pt.X.y, 3 * this.opts.pointSize).fill('rgba(255,255,255,0.2)');
  }

  drawLink(link: Link) {
    let strokeStyle = 'rgba(255,255,255,0.8)';
    if (this.opts.showStress) {
      const diff = link.length - link.p1.X.distance(link.p2.X);
      const per = Math.round(Math.min(Math.abs(diff / (link.length * this.opts.linkStressRatio)), 1) * 255);
      strokeStyle = 'rgba(255, ' + (255 - per) + ', ' + (255 - per) + ', 1)';
    }
    this.line(link.p1.X.x, link.p1.X.y, link.p2.X.x, link.p2.X.y).stroke(strokeStyle);
  }
}
