import { Color, Finish, RoomRO } from "../types";

const lobbyContainer = document.querySelector("#lobby-container");
const timerDiv = document.createElement("span");
timerDiv.id = "timer-div";
timerDiv.style.position = "absolute";
timerDiv.style.display = "none";
timerDiv.style.background = "pink";
timerDiv.style.color = "black";
timerDiv.style.width = "1rem";
timerDiv.style.height = "1rem";
if (lobbyContainer) lobbyContainer.appendChild(timerDiv);

// Medals
const medals = [
  "../../images/first-place.png",
  "../../images/second-place.png",
  "../../images/third-place.png",
  "../../images/fourth-place.png",
];

export default class Lobby {
  private readonly hasStarted: boolean;
  private readonly data: { name: string; isReady: boolean; color: Color }[];

  constructor({ hasStarted, players }: RoomRO) {
    this.hasStarted = hasStarted;
    this.data = players;
  }

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
  public updateHTMLElement(): void {
    const temporaryList = document.createElement("ul");
    temporaryList.id = "participants-container";
    const lobbyData = this.data;
    const colorsValues = {
      red: 4,
      blue: 3,
      green: 2,
      yellow: 1,
    };
    lobbyData.sort(
      (a: { color: Color }, b: { color: Color }) =>
        colorsValues[b.color] - colorsValues[a.color]
    );
    lobbyData.forEach(
      async (participant: { isReady: boolean; name: string; color: Color }) => {
        const listElement = document.createElement("li");

        if (!this.hasStarted) {
          if (!participant.isReady) {
            listElement.style.border = "3px solid red";
            listElement.innerText = `${decodeURIComponent(
              participant.name
            )} (not ready)`;
          } else {
            listElement.style.border = "3px solid green";
            listElement.innerText = `${decodeURIComponent(
              participant.name
            )} (ready)`;
          }
        } else {
          listElement.style.border = "none";
          listElement.innerText = decodeURIComponent(participant.name);
        }

        listElement.className = "user";
        listElement.style.background = participant.color;
        listElement.setAttribute("color", participant.color);

        temporaryList.appendChild(listElement);
      }
    );
    if (lobbyContainer)
      lobbyContainer.replaceChild(temporaryList, lobbyContainer.children[0]);
  }

  public displayPlayersTimeLeft(time: number, color: Color): void {
    const playerContainer = document.querySelector(
      `*[color='${color}']`
    ) as HTMLElement;
    if (playerContainer) {
      timerDiv.innerText = Math.floor(time / 1000).toString();
      timerDiv.style.display = "inline-block";
      timerDiv.style.top = `${playerContainer.offsetTop.toString()}px`;
      timerDiv.style.left = `${playerContainer.offsetLeft.toString()}px`;
    }
  }

  public displayMedals(finished: Finish[]): void {
    finished.forEach((item: Finish) => {
      const playerContainer = document.querySelector(
        `*[color='${item.player.color}']`
      ) as HTMLElement;
      if (playerContainer) {
        if (document.querySelector(`*[medal='${item.placement.toString()}']`))
          return;
        playerContainer.style.backgroundImage = `url(${
          medals[item.placement - 1]
        })`;
        playerContainer.style.backgroundRepeat = "no-repeat";
        playerContainer.style.backgroundSize = "contain";
      }
      item.player.color;
    });
  }
}
