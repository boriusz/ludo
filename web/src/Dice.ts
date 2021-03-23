import { board } from "./Main.js";
import { UserGameData } from "../types";

export default class Dice {
  private readonly gameWrapper: HTMLElement | null;
  public rolledNumber: 1 | 2 | 3 | 4 | 5 | 6 | null;
  constructor() {
    this.gameWrapper = document.querySelector(".game-wrapper");
  }

  public async roll(): Promise<void> {
    const response = await fetch("/game/roll");
    const parsedResponse = await response.json();
    const { rolledNumber } = parsedResponse;
    const players: UserGameData[] = parsedResponse?.players;
    const currentTurn = parsedResponse?.currentTurn;
    if (rolledNumber) this.rolledNumber = rolledNumber;
    else this.rolledNumber = parsedResponse;
    if (players) {
      const data = { players };
      board.playersPositions = data;
      board.renderTurnView(currentTurn, rolledNumber);
    }
  }

  public renderRollButton(): void {
    if (document.querySelector(".roll-button")) return;
    const rollButton = document.createElement("button");
    rollButton.className = "roll-button";
    rollButton.innerText = "Roll";
    rollButton.addEventListener("click", async () => {
      await this.roll();
      console.log(this.rolledNumber);
    });
    if (this.gameWrapper)
      this.gameWrapper.insertAdjacentElement("beforebegin", rollButton);
  }
}
