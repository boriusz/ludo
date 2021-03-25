import { Color, GameData, UserGameData } from "../types";
import getPositions from "./positions.js";

const boardBg = new Image();
boardBg.src = "../../images/board.png";

export default class Board {
  private context: CanvasRenderingContext2D;
  private _playersPositions: { [p: string]: number[] }[];
  private gameWrapper: HTMLElement | null;

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

  set playersPositions(data: { players: UserGameData[] }) {
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
      const obj: { color: Color; positions: number[] } = {
        color: Object.keys(player)[0] as Color,
        positions: player[Object.keys(player)[0]],
      };
      const positions = getPositions(obj.color, obj.positions);
      if (!positions) return;
      for (const position of positions)
        this.drawCircle(position.x, position.y, obj.color);

      // this.context.moveTo();
    });
  }

  public static removeAllPawns(): void {
    const pawns = document.querySelectorAll(".pawn");
    pawns.forEach((pawn: Element) => {
      pawn.remove();
    });
    const possibleDivs = document.querySelectorAll(".possible-pawn");
    if (possibleDivs)
      Array.from(possibleDivs).forEach((child: Element) => child.remove());
  }

  public renderTurnView(currentTurn: Color, rolledNumber: number): void {
    const currentPlayer = this._playersPositions.find(
      (position: { [p: string]: number[] }) =>
        Object.keys(position)[0] === currentTurn
    );
    if (!currentPlayer) return;
    const positions = getPositions(currentTurn, currentPlayer[currentTurn]);
    positions?.forEach(
      (position: { x: number; y: number; isHome?: boolean }, index: number) => {
        if (rolledNumber !== 1 && rolledNumber !== 6 && position.isHome) return;
        const pawn = document.createElement("div");
        pawn.className = "pawn";
        pawn.style.top = (position.y - 20).toString() + "px";
        pawn.style.left = (position.x - 20).toString() + "px";
        setInterval(() => {
          pawn.classList.toggle("pawn-blink");
        }, 500);
        pawn.onmouseover = () => {
          const elapsedPositions = currentPlayer[currentTurn].map(
            (item: number) => {
              if (item === 0) return 1;
              return item + rolledNumber;
            }
          );
          const possibleNextPosition = getPositions(
            currentTurn,
            elapsedPositions
          );
          const nextPosition = possibleNextPosition?.[index];
          if (nextPosition) {
            const possiblePawn = document.createElement("div");
            possiblePawn.className = "possible-pawn";
            possiblePawn.style.top = (nextPosition.y - 20).toString() + "px";
            possiblePawn.style.left = (nextPosition.x - 20).toString() + "px";
            this.gameWrapper?.appendChild(possiblePawn);
          }
        };
        pawn.onmouseleave = () => {
          const possibleDivs = document.querySelectorAll(".possible-pawn");
          if (possibleDivs) {
            Array.from(possibleDivs).forEach((child: Element) =>
              child.remove()
            );
          }
        };
        pawn.addEventListener("click", async () => {
          const body = JSON.stringify({ pawnId: index });
          const headers = { "Content-Type": "application/json" };
          await fetch("/game/movePawn", {
            method: "post",
            headers,
            body,
          });
        });
        this.gameWrapper?.appendChild(pawn);
      }
    );
  }
}
