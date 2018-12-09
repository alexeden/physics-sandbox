import { SandboxMode } from './types';

export class Sandbox {
  width = 0;
  height = 0;
  mode = SandboxMode.Running;


  constructor(
    readonly canvas: HTMLCanvasElement
  ) {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;

  }
}
