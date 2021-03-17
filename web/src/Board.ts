import { GameData, UserGameData } from "../types";

const boardBg = new Image();
boardBg.src = "../../images/board.png";

export default class Board {
  private canvas: HTMLCanvasElement;
  private context: CanvasRenderingContext2D;
  private playersPositions: any;

  constructor(data: GameData) {
    this.canvas = document.querySelector("canvas")!;
    this.context = this.canvas.getContext("2d")!;
    this.playersPositions = data.players.map((player: UserGameData) => {
      const obj = {
        color: Object.keys(player)[0],
        data: Object.values(player)[0].position,
      };
      return { [obj.color]: obj.data };
    });
    console.log(this.playersPositions);
  }

  // set playerPositions() {}

  public render() {
    this.context.drawImage(boardBg, 0, 0, 640, 640);
  }
}
