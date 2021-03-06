import {RigidEdge, Point, Vector, Edge, SpringEdge } from '../physics';

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
    this.ctx = canvas.getContext('2d', { alpha: false })!;
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

  text(text: string, x = 10, y = 10, align: CanvasTextAlign = 'start', baseline: CanvasTextBaseline = 'top') {
    this.ctx.save();
    this.ctx.fillStyle = '#ffffff';
    this.ctx.textBaseline = baseline;
    this.ctx.textAlign = align;
    this.ctx.font = '16px monospace';
    this.ctx.fillText(text, x, y);
    this.ctx.restore();
  }

  drawPointer(pt: Vector, active = false) {
    this.ctx.save();
    this.circle(pt.x, pt.y, this.opts.cursorSize).stroke('rgba(255, 255, 255, 1)');
    if (active) this.fill('rgba(255, 255, 255, 0.5)');
    this.ctx.restore();
  }

  drawPoint({ X, A, fixed, id }: Point, hovered: boolean, active: boolean) {
    this.ctx.save();
    this.circle(X.x, X.y, this.opts.pointSize).fill(fixed ? '#EDEA26' : '#fff');
    if (fixed) this.circle(X.x, X.y, 3 * this.opts.pointSize).fill('rgba(255,255,255,0.2)');
    if (active) {
      this.circle(X.x, X.y, 5 * this.opts.pointSize).fill('rgba(255, 255, 255, 0.2)');
    }
    else if (hovered) {
      this.circle(X.x, X.y, 3 * this.opts.pointSize).fill(fixed ? '#EDEA2633' : '#ffffff33');
    }
    this.ctx.restore();
  }

  drawEdge(edge: Edge) {
    const { p1, p2 } = edge;
    this.ctx.save();

    if (edge instanceof RigidEdge) {
      let strokeStyle = 'rgba(255,255,255,1)';
      // if (this.opts.showStress) {
      //   const diff = edge.length - edge.p1.X.distance(edge.p2.X);
      //   const per = Math.round(Math.min(Math.abs(diff / (edge.length * this.opts.linkStressRatio)), 1) * 255);
      //   strokeStyle = 'rgba(255, ' + (255 - per) + ', ' + (255 - per) + ', 1)';
      // }
      // const center = edge.center();
      // this.text(`${p1.id} ${p2.id}`, center.x, center.y - 5, 'center', 'middle');

      this.line(p1.X.x, p1.X.y, p2.X.x, p2.X.y).stroke(strokeStyle);
    }
    else if (edge instanceof SpringEdge) {
      this.ctx.lineCap = 'round';
      this.ctx.lineJoin = 'round';
      this.ctx.lineWidth = 3;
      this.ctx.strokeStyle = '#8c6eef';
      const vec = edge.asVector();
      const angle = Math.atan2(vec.y, vec.x) - Math.PI/2;
      this.ctx.translate(p1.X.x, p1.X.y);
      this.ctx.rotate(angle);
      this.ctx.beginPath();
      this.ctx.lineTo(0, 0);
      const coils = this.canvas.height / 30;
      const dist = vec.length() / coils;
      const dx = this.canvas.height * 0.004;
      for (let n = 1; n <= coils; n++)
        this.ctx.lineTo((n % 2 === 0 ? -1 : 1) * dx, dist * n);
      this.ctx.stroke();
      this.ctx.closePath();
    }
    this.ctx.restore();
  }
}
