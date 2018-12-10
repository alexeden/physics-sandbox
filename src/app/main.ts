import { Sandbox } from './ui';
import { Rectangle, Shape } from './shapes';

const canvas = document.createElement('canvas');
const sandbox = new Sandbox(canvas).setHeight(window.innerHeight).setWidth(window.innerWidth);
document.body.appendChild(canvas);

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
    .spring(p11, p12, 0.01)
    .connect(p12, p13)
    .connect(p12, p14)
    .connect(p13, p14);
sandbox.addShape(crane);
sandbox.addShape(new Rectangle(500, 70, 70, 70));
const square = new Rectangle(630, 70, 50, 50);
square.points[1].fixed = true;
sandbox.addShape(square);
sandbox.run();
