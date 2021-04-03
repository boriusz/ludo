import { board } from "./Main.js";
import { PlayerData } from "../types";

export default class Dice {
  private readonly gameWrapper: HTMLElement | null;
  public rolledNumber: 1 | 2 | 3 | 4 | 5 | 6 | null;
  private voice: SpeechSynthesisVoice;
  constructor() {
    this.gameWrapper = document.querySelector(".game-wrapper");
    const synth = window.speechSynthesis;
    const interval = setInterval(() => {
      if (synth.getVoices().length !== 0) {
        this.voice = synth.getVoices()[0];
        clearInterval(interval);
      }
    }, 10);
  }

  public async roll(): Promise<void> {
    const response = await fetch("/game/roll");
    const parsedResponse = await response.json();
    const { rolledNumber } = parsedResponse;
    const players: PlayerData[] = parsedResponse?.players;
    const currentTurn = parsedResponse?.currentTurn;
    if (rolledNumber) this.rolledNumber = rolledNumber;
    else this.rolledNumber = parsedResponse;
    board.renderDice(this.rolledNumber as number);
    if (players) {
      console.log(rolledNumber);
      board.playersPositions = { players };
      board.renderTurnView(currentTurn, rolledNumber);
    }
  }

  private static convertNumberToSentence(num: number): string {
    if (num === 1) return "jeden";
    else if (num === 2) return "dwa";
    else if (num === 3) return "trzy";
    else if (num === 4) return "cztery";
    else if (num === 5) return "pięć";
    else if (num === 6) return "sześć";
    return "achtung";
  }

  private speak(rolled: number | null) {
    if (rolled) {
      const numberAsText = Dice.convertNumberToSentence(rolled);
      const utterance = new SpeechSynthesisUtterance(numberAsText);
      utterance.voice = this.voice;
      speechSynthesis.speak(utterance);
    }
  }

  public renderRollButton(): void {
    if (document.querySelector(".roll-button")) return;
    const rollButton = document.createElement("button");
    rollButton.className = "roll-button";
    rollButton.innerText = "Roll";
    rollButton.addEventListener("click", async (e: MouseEvent) => {
      await this.roll();
      this.speak(this.rolledNumber);
      const target = e.target as Element;
      target.remove();
    });
    if (this.gameWrapper) this.gameWrapper.prepend(rollButton);
  }
}
