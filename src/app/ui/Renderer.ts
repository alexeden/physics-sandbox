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

  draw(scene: PhysicsEngine) {
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
