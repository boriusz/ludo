export default class Dice {
  private readonly gameWrapper: HTMLElement | null;
  public rolledNumber: 1 | 2 | 3 | 4 | 5 | 6 | null;
  constructor() {
    this.gameWrapper = document.querySelector(".game-wrapper");
  }

  public async roll(): Promise<void> {
    const response = await fetch("/game/roll");
    this.rolledNumber = await response.json();
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
