export default class OptionalRendering {
  public static prepareLobbyForGame(): void {
    if (document.querySelector(".game-wrapper")) return;
    const readyButton = document.querySelector<HTMLElement>("#ready-button");
    const readyDescription = document.querySelector<HTMLElement>(
      "#ready-description"
    );
    const switcher = document.querySelector<HTMLElement>(".switch");
    const canvasElement = document.createElement("canvas");
    canvasElement.height = 600;
    canvasElement.width = 700;

    const gameWrapper = document.createElement("div");
    gameWrapper.className = "game-wrapper";
    gameWrapper.appendChild(canvasElement);

    if (readyButton && readyDescription && switcher) {
      readyButton.style.display = "none";
      readyDescription.style.display = "none";
      switcher.style.display = "none";
      document.querySelector(".game-container")?.appendChild(gameWrapper);
    }
  }
}
