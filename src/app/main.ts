import { Sandbox } from './ui';
import { Rectangle, Shape } from './shapes';

const canvas = document.createElement('canvas');
const sandbox = new Sandbox(canvas, { calcsPerFrame: 100 }).setHeight(window.innerHeight).setWidth(window.innerWidth);
document.body.appendChild(canvas);

const h1 = canvas.height / 2;
const h2 = h1 + 100;
const dx = canvas.width / 10;
const wave = new Shape();
const wp1 = wave.addFixedPoint(dx, h1);
const wp6 = wave.addFixedPoint(dx * 6, h1);
const wp7 = wave.addFixedPoint(dx * 2, h2);
const wp8 = wave.addFixedPoint(dx * 3, h2);
const wp9 = wave.addFixedPoint(dx * 4, h2);
const wp10 = wave.addFixedPoint(dx * 5, h2);
const wp2 = wave.addPoint(dx * 2, h1);
const wp3 = wave.addPoint(dx * 3, h1);
const wp4 = wave.addPoint(dx * 4, h1);
const wp5 = wave.addPoint(dx * 5, h1);

const kh = 0.5;
const kv = 0.5;
wave
    .spring(wp1, wp2, kh)
    .spring(wp2, wp3, kh)
    .spring(wp3, wp4, kh)
    .spring(wp4, wp5, kh)
    .spring(wp5, wp6, kh)
    .spring(wp2, wp7, kv)
    .spring(wp3, wp8, kv)
    .spring(wp4, wp9, kv)
    .spring(wp5, wp10, kv);


sandbox.addShape(wave);

const crane = new Shape();
const p1 = crane.addPoint(90, 40);
const p2 = crane.addPoint(160, 40);
const p3 = crane.addPoint(90, 110);
const p4 = crane.addPoint(160, 110);
const p5 = crane.addPoint(90, 180);
const p6 = crane.addPoint(160, 180);
const p7 = crane.addPoint(90, 250);
const p8 = crane.addPoint(160, 250);
const p9 = crane.addFixedPoint(90, 320);
const p10 = crane.addFixedPoint(160, 320);
const p11 = crane.addPoint(300, 40);
const p12 = crane.addPoint(300, 198);
const p13 = crane.addPoint(280, 218);
const p14 = crane.addPoint(320, 218);
// const p12 = crane.addPoint(365, 198);
// const p13 = crane.addPoint(345, 218);
// const p14 = crane.addPoint(385, 218);

crane
    .connect(p1, p2)
    .connect(p3, p4)
    .connect(p5, p6)
    .connect(p7, p8)
    .connect(p1, p3)
    .connect(p3, p5)
    .connect(p5, p7)
    .connect(p7, p9)
    .connect(p2, p4)
    .connect(p4, p6)
    .connect(p6, p8)
    .connect(p8, p10)
    .connect(p1, p4)
    .connect(p2, p3)
    .connect(p3, p6)
    .connect(p4, p5)
    .connect(p5, p8)
    .connect(p6, p7)
    .connect(p7, p10)
    .connect(p8, p9)
    .connect(p2, p11)
    .connect(p4, p11)
    .spring(p11, p12, 0.1)
    .connect(p12, p13)
    .connect(p12, p14)
    .connect(p13, p14);
sandbox.addShape(crane);
sandbox.addShape(new Rectangle(500, 70, 70, 70));
const square = new Rectangle(630, 70, 50, 50);
square.points[1].fixed = true;
sandbox.addShape(square);
sandbox.run();
