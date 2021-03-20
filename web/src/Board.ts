import { ColorType, GameData, UserGameData } from "../types";
import getPositions from "./positions.js";

const boardBg = new Image();
boardBg.src = "../../images/board.png";

export default class Board {
  private context: CanvasRenderingContext2D;
  private _playersPositions: { [p: string]: number[] }[];
  private gameWrapper: HTMLElement | null;
  private isTurnViewRendered = false;

  constructor(data: GameData) {
    this.gameWrapper = document.querySelector(".game-wrapper");
    const canvas = document.querySelector("canvas");
    if (!canvas) return;
    const context = canvas.getContext("2d");
    if (!context) return;
    this.context = context;
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

  public render(): void {
    this.context.clearRect(0, 0, 600, 600);
    this.context.drawImage(boardBg, 0, 0, 600, 600);
    this._playersPositions.forEach((player: { [p: string]: number[] }) => {
      const obj: { color: ColorType; positions: number[] } = {
        color: Object.keys(player)[0] as ColorType,
        positions: player[Object.keys(player)[0]],
      };
      const positions = getPositions(obj.color, obj.positions);
      if (!positions) return;
      for (const position of positions)
        this.drawCircle(position.x, position.y, obj.color);

      // this.context.moveTo();
    });
  }

  public renderTurnView(currentTurn: ColorType, rolledNumber: number): void {
    if (this.isTurnViewRendered) return;
    const currentPlayersPositions = this._playersPositions.find(
      (position: { [p: string]: number[] }) =>
        Object.keys(position)[0] === currentTurn
    );
    if (
      (rolledNumber === 1 || rolledNumber === 6) &&
      currentPlayersPositions?.[currentTurn]
    ) {
      const positions = getPositions(
        currentTurn,
        currentPlayersPositions[currentTurn]
      );
      positions?.forEach((position: { x: number; y: number }) => {
        const pawn = document.createElement("div");
        pawn.className = "pawn";
        pawn.style.top = (position.y - 15).toString() + "px";
        pawn.style.left = (position.x - 15).toString() + "px";
        console.log(pawn.style.top, pawn.style.left);
        this.gameWrapper?.appendChild(pawn);
      });
    }
    this.isTurnViewRendered = true;
  }
}
