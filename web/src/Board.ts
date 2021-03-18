import { ColorType, GameData, UserGameData } from "../types";
import getPositions from "./positions.js";

const boardBg = new Image();
boardBg.src = "../../images/board.png";

export default class Board {
  private canvas: HTMLCanvasElement;
  private context: CanvasRenderingContext2D;
  private _playersPositions: any;

  constructor(data: GameData) {
    this.canvas = document.querySelector("canvas")!;
    this.context = this.canvas.getContext("2d")!;
    this.context.drawImage(boardBg, 0, 0, 600, 600);
    this._playersPositions = data.players.map((player: UserGameData) => {
      const obj = {
        color: Object.keys(player)[0],
        data: Object.values(player)[0].position,
      };
      return { [obj.color]: obj.data };
    });
  }

  set playersPositions(data: GameData) {
    this._playersPositions = data.players.map((player: UserGameData) => {
      const obj = {
        color: Object.keys(player)[0],
        data: Object.values(player)[0].position,
      };
      return { [obj.color]: obj.data };
    });
  }

  private drawCircle(x: number, y: number, color: string) {
    const { context } = this;
    context.beginPath();
    context.arc(x, y, 15, 0, 2 * Math.PI, false);
    context.fillStyle = color;
    context.fill();
    context.stroke();
  }

  public render() {
    this._playersPositions.forEach((player: any) => {
      const obj: { color: ColorType; positions: number[] } = {
        color: Object.keys(player)[0] as ColorType,
        positions: player[Object.keys(player)[0]],
      };
      const positions = getPositions(obj.color, obj.positions)!;
      if (!positions) return;
      for (const position of positions) {
        this.drawCircle(position.x, position.y, obj.color);
      }
      // this.context.moveTo();
    });
  }
}
