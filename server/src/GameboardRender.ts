import { Canvas, createCanvas, CanvasRenderingContext2D } from "canvas";

export default class GameboardRender {
  private playerPos: string;
  private canvas: Canvas;
  private context: CanvasRenderingContext2D;

  constructor(playerPos: string) {
    this.playerPos = playerPos;
    this.canvas = createCanvas(200, 200);
    this.context = this.canvas.getContext("2d");
  }
  public renderCanvas() {
    console.log(this.playerPos);
    console.log(this.context);
    return this.context;
  }
}
