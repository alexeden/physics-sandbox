import { PhysicsEngine } from './lib';
import { Renderer } from './ui';
import { Rectangle } from './shapes';

const canvas = document.createElement('canvas');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
// const canvas = document.getElementById('c') as HTMLCanvasElement;
document.body.appendChild(canvas);
const scene = new PhysicsEngine(canvas);
const renderer = new Renderer(canvas);
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
