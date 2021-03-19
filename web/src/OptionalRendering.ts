export default class OptionalRendering {
  public static prepareLobbyForGame(): void {
    const readyButton = document.querySelector<HTMLElement>("#ready-button");
    const readyDescription = document.querySelector<HTMLElement>(
      "#ready-description"
    );
    const switcher = document.querySelector<HTMLElement>(".switch");
    const canvasElement = document.createElement("canvas");
    canvasElement.height = 640;
    canvasElement.width = 640;

    const gameWrapper = document.createElement("div");
    gameWrapper.className = "game-wrapper";
    gameWrapper.appendChild(canvasElement);

    if (readyButton && readyDescription && switcher) {
      readyButton.style.display = "none";
      readyDescription.style.display = "none";
      switcher.style.display = "none";
      document.body.appendChild(gameWrapper);
    }
  }
}
