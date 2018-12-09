import { PhysicsEngine, Link, Point, Vector } from '../physics';

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

  clear(): this {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    return this;
  }

  drawPointer(pt: Vector, active = false) {
    this.circle(pt.x, pt.y, this.opts.cursorSize).stroke('rgba(255, 255, 255, 1)');
    if (active) this.fill('rgba(255, 255, 255, 0.5)');
  }

  drawPoint({ X, fixed }: Point, hovered: boolean, active: boolean) {
    this.circle(X.x, X.y, this.opts.pointSize).fill(fixed ? '#EDEA26' : '#fff');
    if (fixed) this.circle(X.x, X.y, 3 * this.opts.pointSize).fill('rgba(255,255,255,0.2)');
    if (active) {
      this.circle(X.x, X.y, 3 * this.opts.pointSize).fill('rgba(255, 255, 255, 0.2)');
      this.circle(X.x, X.y, this.opts.pointSize).fill(fixed ? '#EDEA26' : '#aaa');
    }
    else if (hovered) {
      this.circle(X.x, X.y, 3 * this.opts.pointSize).fill(fixed ? '#EDEA2633' : '#ffffff33');
    }
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
