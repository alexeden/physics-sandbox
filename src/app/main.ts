import { PhysicsEngine } from './physics';
import { Renderer, Sandbox } from './ui';
import { Rectangle } from './shapes';

const canvas = document.createElement('canvas');
const sandbox = new Sandbox(canvas);
document.body.appendChild(canvas);
// canvas.width = window.innerWidth;
// canvas.height = window.innerHeight;
const engine = new PhysicsEngine(canvas);
const renderer = new Renderer(canvas);
const p1 = engine.addPoint(90, 40, false);
const p2 = engine.addPoint(160, 40, false);
const p3 = engine.addPoint(90, 110, false);
const p4 = engine.addPoint(160, 110, false);
const p5 = engine.addPoint(90, 180, false);
const p6 = engine.addPoint(160, 180, false);
const p7 = engine.addPoint(90, 250, false);
const p8 = engine.addPoint(160, 250, false);
const p9 = engine.addPoint(90, 320, true);
const p10 = engine.addPoint(160, 320, true);
const p11 = engine.addPoint(300, 40, false);
const p12 = engine.addPoint(365, 198, false);
const p13 = engine.addPoint(345, 218, false);
const p14 = engine.addPoint(385, 218, false);

engine.addLink(p1, p2);
engine.addLink(p3, p4);
engine.addLink(p5, p6);
engine.addLink(p7, p8);
engine.addLink(p1, p3);
engine.addLink(p3, p5);
engine.addLink(p5, p7);
engine.addLink(p7, p9);
engine.addLink(p2, p4);
engine.addLink(p4, p6);
engine.addLink(p6, p8);
engine.addLink(p8, p10);
engine.addLink(p1, p4);
engine.addLink(p2, p3);
engine.addLink(p3, p6);
engine.addLink(p4, p5);
engine.addLink(p5, p8);
engine.addLink(p6, p7);
engine.addLink(p7, p10);
engine.addLink(p8, p9);
engine.addLink(p2, p11);
engine.addLink(p4, p11);
engine.addLink(p11, p12);
engine.addLink(p12, p13);
engine.addLink(p12, p14);
engine.addLink(p13, p14);
engine.addShape(new Rectangle(500, 70, 70, 70));
const square = new Rectangle(630, 70, 50, 50);
square.points[1].fixed = true;
engine.addShape(square);


const Loop = () => {
  engine.update(24);
  renderer.draw(engine);
  window.requestAnimationFrame(Loop);
};

Loop();
